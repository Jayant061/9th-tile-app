import { effect, Injectable, signal } from "@angular/core";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";

import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { IUser } from "../../shared/auth.interface";

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  private readonly firebaseConfig = {
    apiKey: "AIzaSyD0cVD3-e19cjBbI01A6FbX8AzJKkMMo8Q",
    authDomain: "eight-puzzle-app.firebaseapp.com",
    projectId: "eight-puzzle-app",
    storageBucket: "eight-puzzle-app.firebasestorage.app",
    messagingSenderId: "964805092994",
    appId: "1:964805092994:web:aaa75ca9a9e115f613f69b",
    measurementId: "G-TQ66NZ1C2N",
  };

  // Initialize Firebase
  public app = initializeApp(this.firebaseConfig);
  public analytics = getAnalytics(this.app);
  public auth = getAuth(this.app);
  public db = getFirestore();

  public user = signal<User | null>(null);

  constructor() {
    effect(() => {
      this.user.set(this.auth.currentUser);
    });
  }

  public provider = new GoogleAuthProvider();

  public signUp = async (email: string, password: string, data: IUser) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      this.user.set(userCredential.user);
      await this.createUserProfile(userCredential.user.uid, data);
    } catch (err) {
      const error = err as { code: string; message: string };
      console.error("Sign Up Error:", error.code, error.message);
      throw error;
    }
  };

  /**
   * Sign in an existing user
   */
  public signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );

      this.user.set(userCredential.user);
    } catch (err) {
      const error = err as { code: string; message: string };
      console.error("Sign In Error:", error.code, error.message);
      throw error;
    }
  };

  public signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(this.auth, this.provider);

      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential) return;
      const token = credential.accessToken;

      localStorage.setItem("token", token ?? "");

      const user = result.user;
      this.user.set(user);
    } catch (err) {
      // Handle Errors here.
      const error = err as { code: string; message: string };
      const errorCode = error.code;
      const errorMessage = error.message;

      console.error(`Error ${errorCode}: ${errorMessage}`);
      throw error;
    }
  };

  public setToken(token: string) {
    localStorage.setItem("token", token);
  }

  public getToken(): string | null {
    return localStorage.getItem("token");
  }

  /* Stores extra user details in Firestore
   * @param {string} userId - The UID from the Auth user object
   * @param {object} data - Object containing { name, age, gender, etc. }
   */
  public createUserProfile = async (userId: string, data: IUser) => {
    try {
      // Reference to the 'users' collection, using UID as the document ID
      const userRef = doc(this.db, "users", userId);

      await setDoc(
        userRef,
        {
          ...data,
          createdAt: new Date(),
        },
        { merge: true },
      ); // Merge: true prevents overwriting existing fields accidentally
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  public getUserData = async (uid: string) => {
    const docRef = doc(this.db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such profile!");
      return null;
    }
  };
}
