import { useEffect, useState } from "react";
import "./index.css";

import Sidebar from "./presentation/components/Sidebar";
import Dashboard from "./presentation/components/Dashboard";
import Grades from "./presentation/components/Grades";
import SemesterManagerUI from "./presentation/components/SemesterManagerUI";
import SubjectList from "./presentation/components/SubjectList";
import SubjectDetail from "./presentation/components/SubjectDetail";

import { UserManager } from "./business/managers/UserManager";
import { SemesterService } from "./business/services/SemesterService";
import { SubjectService } from "./business/services/SubjectService";
import { LabService } from "./business/services/LabService";

export default function App() {
  // auth
  const [user, setUser] = useState(null);

  // data
  const [semesters, setSemesters] = useState([]);
  const [activeSemester, setActiveSemester] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [labsBySubject, setLabsBySubject] = useState({});
  const [openSubject, setOpenSubject] = useState(null);

  // ui
  const [tab, setTab] = useState("dashboard"); // dashboard | semesters | subjects | grades

  // auth subscribe
  useEffect(() => {
    const unsub = UserManager.onAuth((u) => setUser(u));
    return () => unsub && unsub();
  }, []);

  // semesters
  useEffect(() => {
    if (!user) return;
    const unsub = SemesterService.listen(user.uid, setSemesters);
    return () => unsub && unsub();
  }, [user]);

  useEffect(() => {
    setActiveSemester(SemesterService.getActive(semesters));
  }, [semesters]);

  // subjects for active semester
  useEffect(() => {
    if (!user || !activeSemester) return;
    const unsub = SubjectService.listen(user.uid, activeSemester.id, setSubjects);
    return () => unsub && unsub();
  }, [user, activeSemester]);

  // labs per subject
  useEffect(() => {
    if (!user || !activeSemester) return;
    const unsubs = subjects.map((s) =>
      LabService.listen(user.uid, activeSemester.id, s.id, (labs) => {
        setLabsBySubject((prev) => ({ ...prev, [s.id]: labs }));
      })
    );
    return () => unsubs.forEach((u) => u && u());
  }, [user, activeSemester, subjects]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div style={{position:"fixed",top:8,left:8,background:"#F9C908",padding:"4px 8px",borderRadius:8}}>App OK</div>
        <div className="bg-white rounded-[20px] shadow-lg p-8 w-full max-w-lg text-center">
          <img src="/logo.svg" alt="logo" className="mx-auto mb-4 h-28" />
          <h2 className="text-3xl font-semibold mb-2 font-title">StudyTrack</h2>
          <p className="text-gray-700 text-lg mb-5">Відстеження прогресу навчання</p>
          <button
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 border border-gray-200 text-white"
            style={{ backgroundColor: "var(--brand-primary)" }}
            onClick={UserManager.login}
          >
            Увійти через Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-28 w-28 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: "var(--brand-primary)" }}>
              <img src="/logo.svg" alt="logo" className="h-20" />
            </div>
            <div>
              <div className="text-4xl font-bold font-title">StudyTrack</div>
              <div className="text-lg text-gray-600">Відстеження прогресу навчання</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-700">{user.email}</span>
            <button
              className="px-4 py-2 rounded-xl border"
              onClick={UserManager.logout}
              style={{ borderColor: "var(--brand-primary)", color: "var(--brand-primary)" }}
            >
              Вийти
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <Sidebar
          onOpenDashboard={() => { setTab("dashboard"); setOpenSubject(null); }}
          onOpenSemesters={() => { setTab("semesters"); setOpenSubject(null); }}
          onOpenSubjects={() => { setTab("subjects"); setOpenSubject(null); }}
          onOpenGrades={() => { setTab("grades"); setOpenSubject(null); }}
        />

        {/* Main panel */}
        <div className="space-y-6">
          {tab === "dashboard" && (
            <Dashboard
              activeSemesterNumber={activeSemester?.number}
              activeSemester={activeSemester}
              subjects={subjects}
              labsBySubject={labsBySubject}
            />
          )}

          {tab === "semesters" && (
            <SemesterManagerUI
              uid={user.uid}
              semesters={semesters}
              setSemesters={setSemesters}
              activeSemester={activeSemester}
              setActiveSemester={setActiveSemester}
            />
          )}

          {tab === "subjects" && !openSubject && (
            <SubjectList
              uid={user.uid}
              activeSemester={activeSemester}
              onOpenSubject={setOpenSubject}
            />
          )}

          {tab === "subjects" && openSubject && (
            <SubjectDetail
              uid={user.uid}
              semesterId={activeSemester.id}
              subject={openSubject}
              onBack={() => setOpenSubject(null)}
            />
          )}

          {tab === "grades" && (
            <Grades uid={user.uid} activeSemester={activeSemester} subjects={subjects} labsBySubject={labsBySubject} />
          )}
        </div>
      </div>
    </div>
  );
}
