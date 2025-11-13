// src/data/firebase/firestore.js
import {
  collection, doc, addDoc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  onSnapshot, query, where, orderBy
} from "firebase/firestore";
import { db } from "../../firebase";

export {
  db, collection, doc, addDoc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  onSnapshot, query, where, orderBy
};
