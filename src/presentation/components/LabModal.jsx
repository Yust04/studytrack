import { useState } from "react";
import { LabService } from "../../business/services/LabService";

export default function LabModal({ open, onClose, uid, semesterId, subjectId, lab, maxScore }) {
  const [score, setScore] = useState(lab?.obtainedScore ?? "");

  if (!open) return null;

  const save = async () => {
    const value = Number(score);
    if (isNaN(value) || value < 0 || value > Number(maxScore)) return alert("Невірний бал");
    await LabService.patch(uid, semesterId, subjectId, lab.id, { obtainedScore: value, status: "захищено" });
    onClose();
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <h3>Введи бал (макс. {maxScore})</h3>
        <input className="input" value={score} onChange={e=>setScore(e.target.value)} />
        <div className="row" style={{marginTop:12, justifyContent:"flex-end"}}>
          <button className="btn" onClick={onClose}>Скасувати</button>
          <button className="btn" onClick={save}>Зберегти</button>
        </div>
      </div>
    </div>
  );
}
