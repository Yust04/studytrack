// src/data/repositories/SubjectRepository.js
import { db, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy } from "../firebase/firestore";
const subjectsCol = (uid, semesterId) => collection(db, "users", uid, "semesters", semesterId, "subjects");

export const listenSubjects = (uid, semesterId, cb) => {
  const q = query(subjectsCol(uid, semesterId), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};
export const createSubject = (uid, semesterId, data) => addDoc(subjectsCol(uid, semesterId), data);
export const updateSubject = (uid, semesterId, id, patch) => updateDoc(doc(subjectsCol(uid, semesterId), id), patch);
export const deleteSubject = (uid, semesterId, id) => deleteDoc(doc(subjectsCol(uid, semesterId), id));
