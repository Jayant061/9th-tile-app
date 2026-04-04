import { effect, inject, Injectable, signal } from "@angular/core";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";

import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { IUser } from "../../shared/auth.interface";
import { secrets } from "../../../assets/secrets";
import { Router } from "@angular/router";
import { IPlayerData } from "../../shared/interface";

@Injectable({
  providedIn: "root",
})
export class FirebaseService {
  private readonly router = inject(Router);
  private readonly firebaseConfig = {
    apiKey: secrets.apiKey,
    authDomain: "eight-puzzle-app.firebaseapp.com",
    projectId: "eight-puzzle-app",
    storageBucket: "eight-puzzle-app.firebasestorage.app",
    messagingSenderId: "964805092994",
    appId: "1:964805092994:web:aaa75ca9a9e115f613f69b",
    measurementId: "G-TQ66NZ1C2N",
  };

  // Initialize Firebase
  public app = initializeApp(this.firebaseConfig);
  // public analytics = getAnalytics(this.app);
  public auth = getAuth(this.app);
  public db = getFirestore();

  public user = signal<User | null | undefined>(undefined);

  constructor() {
    effect((cleanup) => {
      const unsub = onAuthStateChanged(this.auth, (data) => {
        this.user.set(data);
        if (this.router.url.includes("auth")) {
          this.router.navigate([""]);
        }
      });
      cleanup(() => unsub());
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
      await updateProfile(userCredential.user, {
        displayName: data.name,
      });
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

  public async logOut() {
    await signOut(this.auth);
  }

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
      return null;
    }
  };

  public async setPlayerData(data: IPlayerData) {
    const userId = this.user()?.uid;
    if (!userId) return;
    const playerDataRef = doc(this.db, "players", userId);
    await setDoc(
      playerDataRef,
      { data, createdAt: new Date() },
      { merge: true },
    );
  }

  public async getPlayerData() {
    const userId = this.user()?.uid;
    if (!userId) return;
    const playerDataRef = doc(this.db, "players", userId);
    const playerDataDoc = await getDoc(playerDataRef);
    const playerData = playerDataDoc.data() as {data:IPlayerData};
    return playerData.data;
  }

  public isAuthenticated() {
    return this.user();
  }
}
