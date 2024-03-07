import { createStore } from 'vuex';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Initialize Firebase Auth and Firestore
const auth = getAuth();
const db = getFirestore();

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
      try {
        const { email, password, userDetails } = payload;
        // Firebase Auth user creation
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Additional user details for Firestore
        await setDoc(doc(db, 'landlords', user.uid), {
          uid: user.uid,
          ...userDetails,
        });

        // Update Vuex state
        commit('setUser', { uid: user.uid, email, ...userDetails });
      } catch (error) {
        console.error('Registration error:', error.message);
        throw error; // Rethrow to handle it in the component
      }
    },
    // Additional actions like loginUser, logoutUser, etc., can be added here
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
  },
});
