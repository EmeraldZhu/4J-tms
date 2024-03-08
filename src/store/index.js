import { createStore } from 'vuex';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Initialize Firebase services
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(); // Initialize Firebase Storage

export const store = createStore({
  state() {
    return {
      user: null,
    };
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async registerLandlord({ commit }, payload) {
      console.log(payload); // Log the payload
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
        commit('setUser', { uid: user.uid, email, ...userData });
      } catch (error) {
        console.error('Registration error:', error.message);
        throw error; // Propagate the error to be handled by the component
      }
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
  },
});
