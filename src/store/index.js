import { createStore } from 'vuex';
import { useRouter } from 'vue-router';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
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
    };
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading; // Add mutation to set loading state
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
        const userData = { ...userDetails, profileImageUrl: imageUrl };

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
            // User is signed in, get their data from Firestore
            const docRef = doc(db, 'landlords', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              // User data exists in Firestore, commit to Vuext state
              const userData = docSnap.data();
              commit('setUser', { uid: user.uid, email: user.email, profileImageUrl: userData.profileImageUrl, ...userData });
            } else {
              // // User data does not exist in Firestore
              console.log('No such document!');
            }
          } else {
            // User is signed out, clear Vuex state
            commit('setUser', null);
          }
          commit('setLoading', false); // Set loading state to false after fetching user data
        });
      } catch (error) {
        console.error('Fetch user error:', error.message);
        throw error;
      }
    },

    async logout({ commit }) {
      try {
        await signOut(auth);
        commit('setUser', null);
        // const router = useRouter();
        // router.push('/login/owner');
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
