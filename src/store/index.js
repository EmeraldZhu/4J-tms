import { createStore } from 'vuex';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, where, getDocs, query } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Initialize Firebase services
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(); // Initialize Firebase Storage

// Resolves once the first onAuthStateChanged callback has run and the user's
// profile (and therefore their role) has been loaded. Route guards await this so
// that a refresh on a protected URL cannot slip through while auth is still unknown.
let resolveAuthReady;
const authReady = new Promise((resolve) => {
  resolveAuthReady = resolve;
});

// Resolve a signed-in Firebase user to their application profile and role.
// The tenant lookup keys off authUid rather than email, so it matches what the
// Firestore rules are able to prove about the caller.
async function loadProfile(user) {
  const landlordSnap = await getDoc(doc(db, 'landlords', user.uid));
  if (landlordSnap.exists()) {
    return { ...landlordSnap.data(), role: 'landlord', docId: landlordSnap.id };
  }

  const tenantsQuery = query(collection(db, 'tenants'), where('authUid', '==', user.uid));
  const tenantSnapshot = await getDocs(tenantsQuery);
  if (!tenantSnapshot.empty) {
    const tenantDoc = tenantSnapshot.docs[0];
    return { ...tenantDoc.data(), role: 'tenant', docId: tenantDoc.id };
  }

  return null;
}

export const store = createStore({
  state() {
    return {
      user: null,
      isLoading: true, // unknown until the first auth callback resolves
      showLogoutToast: false,
      role: null,
      authInitialized: false,
    };
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setRole(state, role) {
      state.role = role;
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading; // Add mutation to set loading state
    },
    setShowLogoutToast(state, value) {
      state.showLogoutToast = value;
    },
    setAuthInitialized(state, value) {
      state.authInitialized = value;
    },
  },
  actions: {
    async registerLandlord({ commit }, payload) {
      try {
        // Destructure the payload to extract the image file and other user details.
        // password is pulled out here and is never logged or persisted.
        const { email, password, profileImage, ...userDetails } = payload;

        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        let imageUrl = '';
        // Check if an image file was provided
        if (profileImage) {
          // Create a storage reference
          const imageRef = storageRef(storage, `profileImages/${user.uid}/${profileImage.name}`);
          // Upload the image
          const snapshot = await uploadBytes(imageRef, profileImage);
          // Get the download URL
          imageUrl = await getDownloadURL(snapshot.ref);
        }

        // Combine userDetails with the image URL
        const userData = { ...userDetails, profileImageUrl: imageUrl, role: 'landlord' };

        // Save user details to Firestore, including the image URL
        await setDoc(doc(db, 'landlords', user.uid), userData);

        // Commit the user to Vuex state
        commit('setUser', { uid: user.uid, email, ...userData, photoURL: imageUrl });
        commit('setRole', 'landlord');
      } catch (error) {
        console.error('Registration error:', error.message);
        throw error; // Propagate the error to be handled by the component
      }
    },

    // Registers the single auth listener. Safe to dispatch more than once; later
    // calls just await the listener that is already in place.
    fetchUser({ commit, state }) {
      if (state.authInitialized) return authReady;

      commit('setAuthInitialized', true);
      onAuthStateChanged(auth, async (user) => {
        commit('setLoading', true);
        try {
          if (user) {
            const profile = await loadProfile(user);
            if (profile) {
              commit('setUser', { uid: user.uid, email: user.email, ...profile });
              commit('setRole', profile.role);
            } else {
              // Authenticated but with no application profile. Sign out rather than
              // leaving a half-initialised session that guards would have to reason about.
              commit('setUser', null);
              commit('setRole', null);
              await signOut(auth);
            }
          } else {
            commit('setUser', null);
            commit('setRole', null);
          }
        } catch (error) {
          console.error('Fetch user error:', error.message);
          commit('setUser', null);
          commit('setRole', null);
        } finally {
          commit('setLoading', false);
          resolveAuthReady();
        }
      });

      return authReady;
    },

    // Signs in, then verifies the account actually holds the expected role before
    // the caller may proceed. Without this check a tenant could sign in at the
    // landlord login page and be handed the landlord dashboard.
    async loginWithRole({ commit }, { email, password, expectedRole }) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      let profile;
      try {
        profile = await loadProfile(userCredential.user);
      } catch (error) {
        await signOut(auth);
        throw new Error('Unable to verify your account. Please try again.');
      }

      if (!profile || profile.role !== expectedRole) {
        // Drop the session immediately so a wrong-portal login leaves no usable
        // credentials behind in the tab.
        await signOut(auth);
        throw new Error('Invalid email or password.');
      }

      commit('setUser', { uid: userCredential.user.uid, email: userCredential.user.email, ...profile });
      commit('setRole', profile.role);
      return profile;
    },

    loginTenant({ dispatch }, { email, password }) {
      return dispatch('loginWithRole', { email, password, expectedRole: 'tenant' });
    },

    loginLandlord({ dispatch }, { email, password }) {
      return dispatch('loginWithRole', { email, password, expectedRole: 'landlord' });
    },

    async logout({ commit }) {
      try {
        await signOut(auth);
        commit('setUser', null);
        commit('setRole', null);
        commit('setShowLogoutToast', true); // Set the flag before redirecting
      } catch (error) {
        console.error('Logout error:', error.message);
        throw error;
      }
    }
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    role(state) {
      return state.role;
    },
  },
});

export { authReady };
