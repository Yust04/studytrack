import { createSubject, deleteSubject, listenSubjects, updateSubject } from "../../data/repositories/SubjectRepository";
import { newSubject } from "../../models/Subject";

export const SubjectService = {
  listen(uid, semesterId, cb) { return listenSubjects(uid, semesterId, cb); },
  async add(uid, semesterId, payload) { return createSubject(uid, semesterId, newSubject(payload)); },
  async patch(uid, semesterId, id, patch) { return updateSubject(uid, semesterId, id, patch); },
  async remove(uid, semesterId, id) { return deleteSubject(uid, semesterId, id); },
};
