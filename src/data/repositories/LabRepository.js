// src/data/repositories/LabRepository.js
import { db, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from "../firebase/firestore";
const labsCol = (uid, semesterId, subjectId) => collection(db, "users", uid, "semesters", semesterId, "subjects", subjectId, "labs");

export const listenLabs = (uid, semesterId, subjectId, cb) => {
  const q = query(labsCol(uid, semesterId, subjectId), orderBy("number", "asc"));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
};

export const createLab = (uid, semesterId, subjectId, data) => addDoc(labsCol(uid, semesterId, subjectId), data);
export const updateLab = (uid, semesterId, subjectId, id, patch) => updateDoc(doc(labsCol(uid, semesterId, subjectId), id), patch);
export const deleteLab = (uid, semesterId, subjectId, id) => deleteDoc(doc(labsCol(uid, semesterId, subjectId), id));
