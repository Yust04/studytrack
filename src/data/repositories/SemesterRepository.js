// src/data/repositories/SemesterRepository.js
import { db, collection, doc, addDoc, setDoc, getDocs, updateDoc, deleteDoc, onSnapshot, query, orderBy } from "../firebase/firestore";

export const semestersCol = (uid) => collection(db, "users", uid, "semesters");

export const listenSemesters = (uid, cb) => {
  const q = query(semestersCol(uid), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    cb(list);
  });
};

export const createSemester = (uid, data) => addDoc(semestersCol(uid), data);
export const updateSemester = (uid, id, patch) => updateDoc(doc(semestersCol(uid), id), patch);
export const deleteSemester = (uid, id) => deleteDoc(doc(semestersCol(uid), id));
