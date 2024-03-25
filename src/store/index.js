import { createStore } from 'vuex';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, where, getDocs, query } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Initialize Firebase services
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(); // Initialize Firebase Storage

export const store = createStore({
  state() {
    return {
      user: null,
      isLoading: false, // add loading state
      showLogoutToast: false,
      role: null,
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
  },
  actions: {
    async registerLandlord({ commit }, payload) {
      try {
        console.log(payload); // Log the payload
        // Destructure the payload to extract the image file and other user details
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
          const snapshot = await uploadBytes(imageRef, profileImage).catch((error) => {
            console.error('Upload error:', error.message);
            throw error;
          });
          // Get the download URL
          imageUrl = await getDownloadURL(snapshot.ref).catch((error) => {
            console.error('Download URL error:', error.message);
            throw error;
          });
          console.log(imageUrl); // Log the download URL
        }

        // Combine userDetails with the image URL
        const userData = { ...userDetails, profileImageUrl: imageUrl, role: 'landlord' };

        // Save user details to Firestore, including the image URL
        await setDoc(doc(db, 'landlords', user.uid), userData);

        // Commit the user to Vuex state
        commit('setUser', { uid: user.uid, email, ...userData, photoURL: imageUrl });
      } catch (error) {
        console.error('Registration error:', error.message);
        throw error; // Propagate the error to be handled by the component
      }
    },
    
    async fetchUser({ commit }) {
      commit('setLoading', true); // Set loading state to true before fetching user data
      try {
        // Listen for user auth state changes
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            // Attempt to fetch from landlords collection first
            let docRef = doc(db, 'landlords', user.uid);
            let docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
              // If not found, attempt to fetch from tenants collection
              const tenantsQuery = query(collection(db, "tenants"), where("authUid", "==", user.uid));
              const querySnapshot = await getDocs(tenantsQuery);

              if (!querySnapshot.empty) {
                // Assuming email uniqueness, we can directly access the first document
                docSnap = querySnapshot.docs[0];
              }
            }

            if (docSnap.exists()) {
              // User data exists in Firestore, commit to Vuex state
              const userData = docSnap.data();
              commit('setUser', { uid: user.uid, email: user.email, ...userData });
              commit('setRole', userData.role);
            } else {
              // User data does not exist in Firestore
              console.log('No such document!');
              commit('setUser', null);
            }
          } else {
            // User is signed out, clear Vuex state
            commit('setUser', null);
          }
          commit('setLoading', false); // Set loading state to false after fetching user data
        });
      } catch (error) {
        console.error('Fetch user error:', error.message);
        commit('setLoading', false);
        throw error;
      }
    },

    async loginTenant({ commit }, { email, password }) {
      console.log('Attempting tenant login with email:', email);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in successfully:', userCredential.user.uid);
        // The user's email is used to log in, so we use it to fetch the tenant document
        const tenantsQuery = query(collection(db, "tenants"), where("email", "==", email));
        const querySnapshot = await getDocs(tenantsQuery);
        console.log('Fetched tenant document:', querySnapshot.empty);
    
        if (!querySnapshot.empty) {
          const tenantDoc = querySnapshot.docs[0];
          console.log('Tenant document data:', tenantDoc.data()); // Debugging statement 4
          commit('setUser', { uid: userCredential.user.uid, email, ...tenantDoc.data() });
          commit('setRole', tenantDoc.data().role);
          console.log('User and role committed to Vuex'); // Debugging statement 5
        } else {
          throw new Error('No user document found');
        }
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    async logout({ commit }) {
      try {
        await signOut(auth);
        commit('setUser', null);
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
  },
});
