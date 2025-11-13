import { createSemester, deleteSemester, listenSemesters, updateSemester } from "../../data/repositories/SemesterRepository";
import { newSemester } from "../../models/Semester";

export const SemesterService = {
  listen(uid, cb) { return listenSemesters(uid, cb); },
  async add(uid, payload) { return createSemester(uid, newSemester(payload)); },
  async patch(uid, id, patch) { return updateSemester(uid, id, patch); },
  async remove(uid, id) { return deleteSemester(uid, id); },

  async setActive(uid, semesters, idToActivate) {
    // зняти active з усіх → поставити одному
    await Promise.all(semesters.map(s =>
      updateSemester(uid, s.id, { active: s.id === idToActivate })
    ));
  },

  getActive(semesters) {
    return semesters.find(s => s.active) || null;
  }
};
