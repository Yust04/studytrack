import { useEffect, useState } from "react";
import { SubjectService } from "../../business/services/SubjectService";
import Button from "./ui/Button";
import Modal from "./ui/Modal";

export default function SubjectList({ uid, activeSemester, onOpenSubject }) {
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", teacher: "", controlType: "", iconUrl: "" });
  const [file, setFile] = useState(null);
  const [edit, setEdit] = useState({ open:false, id:null, form:{ title:"", teacher:"", controlType:"", iconUrl:"" }, file:null });
  const [saving, setSaving] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const canUpload = (f) => {
    if (!f) return false;
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!allowed.includes(f.type)) {
      alert("Підтримуються PNG, JPG/JPEG або WEBP (до 5 МБ)");
      return false;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert("Файл завеликий. Максимум 5 МБ");
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!activeSemester) return;
    const unsub = SubjectService.listen(uid, activeSemester.id, setSubjects);
    return () => unsub && unsub();
  }, [uid, activeSemester]);

  const add = async () => {
    if (!form.title) return alert("Вкажіть назву предмету");
    setSaving(true);
    try {
      const docRef = await SubjectService.add(uid, activeSemester.id, form);
      if (file && docRef && docRef.id) {
        try {
          if (canUpload(file)) {
            const { storage } = await import("../../firebase");
            const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
            const path = `users/${uid}/subjects/${docRef.id}/icon`;
            const sref = ref(storage, path);
            const snap = await uploadBytes(sref, file, { contentType: file.type || undefined });
            const url = await getDownloadURL(snap.ref);
            await SubjectService.patch(uid, activeSemester.id, docRef.id, { iconUrl: url });
            // optimistic UI
            setSubjects((prev)=>prev.map(s=> s.id===docRef.id ? { ...s, iconUrl: url } : s));
          }
        } catch (e) {
          console.error("Upload icon failed", e);
          alert(`Не вдалося завантажити іконку: ${e?.code || e?.name || ''} ${e?.message || ''}`);
        }
      }
      setForm({ title: "", teacher: "", controlType: "", iconUrl: "" });
      setFile(null);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (confirm("Видалити предмет?")) await SubjectService.remove(uid, activeSemester.id, id);
  };

  if (!activeSemester) return <div className="card">Оберіть активний семестр</div>;

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Предмети (семестр {activeSemester.number})</h3>
        <Button variant="primary" onClick={() => setOpen(true)}>+ Додати предмет</Button>
      </div>

      <div className="mt-3 space-y-2">
        {subjects.map(s => (
          <div key={s.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                {s.iconUrl ? <img src={s.iconUrl} alt="icon" className="w-full h-full object-cover" /> : <div className="w-8 h-8 bg-gray-300 rounded" />}
              </div>
              <div><b>{s.title}</b> <span className="badge">{s.controlType || "—"}</span></div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => onOpenSubject(s)}>Відкрити</Button>
              <Button onClick={() => setEdit({ open:true, id:s.id, form:{ title:s.title||"", teacher:s.teacher||"", controlType:s.controlType||"", iconUrl:s.iconUrl||"" }, file:null })}>Редагувати</Button>
              <Button variant="danger" onClick={() => remove(s.id)}>Видалити</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Створення предмету"
        footer={
          <>
            <Button onClick={() => setOpen(false)} disabled={saving}>Скасувати</Button>
            <Button variant="primary" onClick={add} disabled={saving}>{saving ? "Збереження..." : "Створити"}</Button>
          </>
        }
      >
        <div className="space-y-3">
          <input className="input" placeholder="Назва" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <input className="input" placeholder="Викладач (необов'язково)" value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })} />
          <input className="input" placeholder="Тип контролю (екзамен/залік)" value={form.controlType} onChange={e => setForm({ ...form, controlType: e.target.value })} />
          <input className="input" type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setFile(e.target.files?.[0] || null)} />
          {file && (
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
              </div>
              <div className="text-sm text-gray-600">Попередній перегляд іконки</div>
            </div>
          )}
        </div>
      </Modal>

      {/* Edit subject */}
      <Modal
        open={edit.open}
        onClose={() => setEdit({ open:false, id:null, form:edit.form, file:null })}
        title="Редагування предмету"
        footer={
          <>
            <Button onClick={()=>setEdit({ open:false, id:null, form:{ title:"", teacher:"", controlType:"", iconUrl:"" }, file:null })} disabled={savingEdit}>Скасувати</Button>
            <Button variant="primary" onClick={async ()=>{
              setSavingEdit(true);
              try {
                await SubjectService.patch(uid, activeSemester.id, edit.id, edit.form);
                if (edit.file) {
                  try {
                    if (canUpload(edit.file)) {
                      const { storage } = await import("../../firebase");
                      const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
                      const path = `users/${uid}/subjects/${edit.id}/icon`;
                      const sref = ref(storage, path);
                      const snap = await uploadBytes(sref, edit.file, { contentType: edit.file.type || undefined });
                      const url = await getDownloadURL(snap.ref);
                      await SubjectService.patch(uid, activeSemester.id, edit.id, { iconUrl: url });
                      // optimistic UI
                      setSubjects((prev)=>prev.map(s=> s.id===edit.id ? { ...s, iconUrl: url } : s));
                    }
                  } catch(e){ console.error(e); alert(`Не вдалося оновити іконку: ${e?.code || e?.name || ''} ${e?.message || ''}`); }
                }
                setEdit({ open:false, id:null, form:{ title:"", teacher:"", controlType:"", iconUrl:"" }, file:null });
              } finally {
                setSavingEdit(false);
              }
            }} disabled={savingEdit}>{savingEdit ? "Збереження..." : "Зберегти"}</Button>
          </>
        }
      >
        <div className="space-y-3">
          <input className="input" placeholder="Назва" value={edit.form.title} onChange={e=>setEdit({...edit, form:{...edit.form, title:e.target.value}})} />
          <input className="input" placeholder="Викладач" value={edit.form.teacher} onChange={e=>setEdit({...edit, form:{...edit.form, teacher:e.target.value}})} />
          <input className="input" placeholder="Тип контролю" value={edit.form.controlType} onChange={e=>setEdit({...edit, form:{...edit.form, controlType:e.target.value}})} />
          <input className="input" type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setEdit({...edit, file: e.target.files?.[0] || null})} />
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
              {edit.file ? (
                <img src={URL.createObjectURL(edit.file)} alt="preview" className="w-full h-full object-cover" />
              ) : (
                edit.form.iconUrl ? <img src={edit.form.iconUrl} alt="icon" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <div className="text-sm text-gray-600">Попередній перегляд іконки</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

