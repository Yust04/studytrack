import { useEffect, useState } from "react";
import { LabService } from "../../business/services/LabService";
import { GradeCalculator } from "../../business/services/GradeCalculator";
import { STATUS } from "../../models/LabWork";
import LabModal from "./LabModal";
import Button from "./ui/Button";
import Modal from "./ui/Modal";

export default function SubjectDetail({ uid, semesterId, subject, onBack }) {
  const [labs, setLabs] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ topic: "", maxScore: "" });
  const [modal, setModal] = useState({ open: false, lab: null });
  const [edit, setEdit] = useState({ open: false, lab: null, form: { topic: "", maxScore: "" } });

  useEffect(() => {
    const unsub = LabService.listen(uid, semesterId, subject.id, setLabs);
    return () => unsub && unsub();
  }, [uid, semesterId, subject.id]);

  const add = async () => {
    if (!createForm.maxScore) return alert("Вкажіть максимальний бал");
    await LabService.add(
      uid,
      semesterId,
      subject.id,
      labs,
      { topic: createForm.topic, maxScore: Number(createForm.maxScore) }
    );
    setCreateForm({ topic: "", maxScore: "" });
    setOpenCreate(false);
  };

  const changeStatus = async (lab, status) => {
    if (status === STATUS.DEFENDED) {
      setModal({ open: true, lab });
    } else {
      await LabService.patch(uid, semesterId, subject.id, lab.id, { status });
    }
  };

  const remove = async (labId) => {
    if (confirm("Видалити роботу?")) {
      await LabService.remove(uid, semesterId, subject.id, labId);
    }
  };

  const totals = GradeCalculator.subjectTotals(labs);

  const STATUS_LABELS = {
    [STATUS.NOT_STARTED]: "Не розпочато",
    [STATUS.IN_PROGRESS]: "У процесі",
    [STATUS.DONE]: "Виконано",
    [STATUS.DEFENDED]: "Захищено",
  };

  const statusDot = (st) => (
    <span
      className="inline-block w-2.5 h-2.5 rounded-full flex-none"
      style={{
        backgroundColor:
          st === STATUS.NOT_STARTED ? '#9CA3AF' :
          st === STATUS.IN_PROGRESS ? '#F59E0B' :
          st === STATUS.DONE ? '#22C55E' : '#166534'
      }}
      title={STATUS_LABELS[st] || ''}
    />
  );

  return (
    <div className="card overflow-x-hidden">
      <div className="flex items-center justify-between">
        <Button onClick={onBack}>Назад до списку предметів</Button>
        <div className="flex items-center gap-2">
          <div className="badge">Підсумок: {totals.obtained}/{totals.maxTotal} ({totals.percent}%)</div>
          <Button variant="primary" onClick={() => setOpenCreate(true)}>+ Додати роботу</Button>
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-3">{subject.title}</h3>

      <div className="mt-3 space-y-3 overflow-x-hidden">
        {labs.map(l => (
          <div key={l.id} className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {statusDot(l.status)}
              <b className="shrink-0">Робота №{l.number}</b>
              <span className="truncate" title={l.topic || "без теми"}>— {l.topic || "без теми"}</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4 shrink-0">
              <select className="select" value={l.status} onChange={e => changeStatus(l, e.target.value)}>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <Button onClick={() => setEdit({ open: true, lab: l, form: { topic: l.topic || "", maxScore: String(l.maxScore || "") } })}>Редагувати</Button>
              <Button variant="danger" onClick={() => remove(l.id)}>Видалити</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Ввід балів для статусу "Захищено" */}
      <LabModal
        open={modal.open}
        onClose={() => setModal({ open: false, lab: null })}
        uid={uid}
        semesterId={semesterId}
        subjectId={subject.id}
        lab={modal.lab}
        maxScore={modal.lab?.maxScore}
      />

      {/* Створити роботу */}
      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Створення лабораторної"
        footer={
          <>
            <Button onClick={() => setOpenCreate(false)}>Скасувати</Button>
            <Button variant="primary" onClick={add}>Створити</Button>
          </>
        }
      >
        <div className="space-y-3">
          <input className="input" placeholder="Тема (необов'язково)" value={createForm.topic} onChange={e => setCreateForm({ ...createForm, topic: e.target.value })} />
          <input className="input" placeholder="Макс. бал" value={createForm.maxScore} onChange={e => setCreateForm({ ...createForm, maxScore: e.target.value })} />
        </div>
      </Modal>

      {/* Редагувати роботу */}
      <Modal
        open={edit.open}
        onClose={() => setEdit({ open: false, lab: null, form: edit.form })}
        title="Редагування лабораторної"
        footer={
          <>
            <Button onClick={() => setEdit({ open: false, lab: null, form: { topic: "", maxScore: "" } })}>Скасувати</Button>
            <Button variant="primary" onClick={async () => { await LabService.patch(uid, semesterId, subject.id, edit.lab.id, { topic: edit.form.topic, maxScore: Number(edit.form.maxScore) || 0 }); setEdit({ open: false, lab: null, form: { topic: "", maxScore: "" } }); }}>Зберегти</Button>
          </>
        }
      >
        <div className="space-y-3">
          <input className="input" placeholder="Тема" value={edit.form.topic} onChange={e => setEdit({ ...edit, form: { ...edit.form, topic: e.target.value } })} />
          <input className="input" placeholder="Макс. бал" value={edit.form.maxScore} onChange={e => setEdit({ ...edit, form: { ...edit.form, maxScore: e.target.value } })} />
        </div>
      </Modal>
    </div>
  );
}

import { useEffect, useState } from "react";
import { LabService } from "../../business/services/LabService";
import { GradeCalculator } from "../../business/services/GradeCalculator";
import { STATUS } from "../../models/LabWork";
import LabModal from "./LabModal";
import Button from "./ui/Button";
import Modal from "./ui/Modal";

export default function SubjectDetail({ uid, semesterId, subject, onBack }) {
  const [labs, setLabs] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ topic: "", maxScore: "" });
  const [modal, setModal] = useState({ open: false, lab: null });
  const [edit, setEdit] = useState({ open: false, lab: null, form: { topic: "", maxScore: "" } });

  useEffect(() => {
    const unsub = LabService.listen(uid, semesterId, subject.id, setLabs);
    return () => unsub && unsub();
  }, [uid, semesterId, subject.id]);

  const add = async () => {
    if (!createForm.maxScore) return alert("Вкажіть максимальний бал");
    await LabService.add(uid, semesterId, subject.id, labs, { topic: createForm.topic, maxScore: Number(createForm.maxScore) });
    setCreateForm({ topic: "", maxScore: "" });
    setOpenCreate(false);
  };

  const changeStatus = async (lab, status) => {
    if (status === STATUS.DEFENDED) {
      setModal({ open: true, lab });
    } else {
      await LabService.patch(uid, semesterId, subject.id, lab.id, { status });
    }
  };

  const remove = async (labId) => {
    if (confirm("Видалити роботу?")) await LabService.remove(uid, semesterId, subject.id, labId);
  };

  const totals = GradeCalculator.subjectTotals(labs);

  const STATUS_LABELS = {
    [STATUS.NOT_STARTED]: "Не розпочато",
    [STATUS.IN_PROGRESS]: "У процесі",
    [STATUS.DONE]: "Виконано",
    [STATUS.DEFENDED]: "Захищено",
  };

  const statusDot = (st) => (
    <span
      className="inline-block w-2.5 h-2.5 rounded-full flex-none"
      style={{
        backgroundColor:
          st === STATUS.NOT_STARTED ? '#9CA3AF' :
          st === STATUS.IN_PROGRESS ? '#F59E0B' :
          st === STATUS.DONE ? '#22C55E' : '#166534'
      }}
      title={STATUS_LABELS[st] || ''}
    />
  );

  return (
    <div className="card overflow-x-hidden">
      <div className="flex items-center justify-between">
        <Button onClick={onBack}>Назад до списку предметів</Button>
        <div className="flex items-center gap-2">
          <div className="badge">Підсумок: {totals.obtained}/{totals.maxTotal} ({totals.percent}%)</div>
          <Button variant="primary" onClick={() => setOpenCreate(true)}>+ Додати роботу</Button>
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-3">{subject.title}</h3>

      <div className="mt-3 space-y-3 overflow-x-hidden">
        {labs.map(l => (
          <div key={l.id} className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
              {statusDot(l.status)}
              <b className="shrink-0">Робота №{l.number}</b>
              <span className="truncate" title={l.topic || "без теми"}>— {l.topic || "без теми"}</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4 shrink-0">
              <select className="select" value={l.status} onChange={e => changeStatus(l, e.target.value)}>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <Button onClick={() => setEdit({ open: true, lab: l, form: { topic: l.topic || "", maxScore: String(l.maxScore || "") } })}>Редагувати</Button>
              <Button variant="danger" onClick={() => remove(l.id)}>Видалити</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Ввід балів для статусу "Захищено" */}
      <LabModal
        open={modal.open}
        onClose={() => setModal({ open: false, lab: null })}
        uid={uid}
        semesterId={semesterId}
        subjectId={subject.id}
        lab={modal.lab}
        maxScore={modal.lab?.maxScore}
      />

      {/* Створити роботу */}
      <Modal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        title="Створення лабораторної"
        footer={
          <>
            <Button onClick={() => setOpenCreate(false)}>Скасувати</Button>
            <Button variant="primary" onClick={add}>Створити</Button>
          </>
        }
      >
        <div className="space-y-3">
          <input className="input" placeholder="Тема (необов'язково)" value={createForm.topic} onChange={e => setCreateForm({ ...createForm, topic: e.target.value })} />
          <input className="input" placeholder="Макс. бал" value={createForm.maxScore} onChange={e => setCreateForm({ ...createForm, maxScore: e.target.value })} />
        </div>
      </Modal>

      {/* Редагувати роботу */}
      <Modal
        open={edit.open}
        onClose={() => setEdit({ open: false, lab: null, form: edit.form })}
        title="Редагування лабораторної"
        footer={
          <>
            <Button onClick={() => setEdit({ open: false, lab: null, form: { topic: "", maxScore: "" } })}>Скасувати</Button>
            <Button variant="primary" onClick={async () => { await LabService.patch(uid, semesterId, subject.id, edit.lab.id, { topic: edit.form.topic, maxScore: Number(edit.form.maxScore) || 0 }); setEdit({ open: false, lab: null, form: { topic: "", maxScore: "" } }); }}>Зберегти</Button>
          </>
        }
      >
        <div className="space-y-3">
          <input className="input" placeholder="Тема" value={edit.form.topic} onChange={e => setEdit({ ...edit, form: { ...edit.form, topic: e.target.value } })} />
          <input className="input" placeholder="Макс. бал" value={edit.form.maxScore} onChange={e => setEdit({ ...edit, form: { ...edit.form, maxScore: e.target.value } })} />
        </div>
      </Modal>
    </div>
  );
}

