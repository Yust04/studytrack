import { useEffect, useState } from "react";
import { SemesterService } from "../../business/services/SemesterService";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

export default function SemesterManagerUI({ uid, semesters, setSemesters, activeSemester, setActiveSemester }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ number: "", title: "", startDate: "", endDate: "" });
  const [edit, setEdit] = useState({ open:false, id:null, form:{ number:"", title:"", startDate:"", endDate:"" } });

  useEffect(() => {
    const unsub = SemesterService.listen(uid, setSemesters);
    return () => unsub && unsub();
  }, [uid, setSemesters]);

  useEffect(() => {
    setActiveSemester(SemesterService.getActive(semesters));
  }, [semesters, setActiveSemester]);

  const create = async () => {
    if (!form.number) return alert("Вкажіть номер семестру");
    await SemesterService.add(uid, { number: form.number, title: form.title, startDate: form.startDate, endDate: form.endDate });
    setForm({ number: "", title: "", startDate: "", endDate: "" });
    setOpen(false);
  };

  const makeActive = async (id) => {
    await SemesterService.setActive(uid, semesters, id);
  };

  const remove = async (id) => {
    if (confirm("Видалити семестр?")) await SemesterService.remove(uid, id);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Семестри</h3>
        <Button variant="primary" onClick={() => setOpen(true)}>+ Додати семестр</Button>
      </div>

      <div className="mt-3 space-y-2">
        {semesters.map(s=>(
          <div key={s.id} className="flex items-center justify-between">
            <div>
              <b>Семестр {s.number}</b> {s.title && <span className="badge ml-2">{s.title}</span>} {s.active && <span className="badge ml-2 bg-brand-accent text-black">Активний</span>}
            </div>
            <div className="flex gap-2">
              {!s.active && <Button variant="subtle" onClick={()=>makeActive(s.id)}>Зробити активним</Button>}
              <Button onClick={()=>setEdit({ open:true, id:s.id, form:{ number:s.number||"", title:s.title||"", startDate:s.startDate||"", endDate:s.endDate||"" } })}>Редагувати</Button>
              <Button variant="danger" onClick={()=>remove(s.id)}>Видалити</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={()=>setOpen(false)}
        title="Створення семестру"
        footer={
          <>
            <Button onClick={()=>setOpen(false)}>Скасувати</Button>
            <Button variant="primary" onClick={create}>Створити</Button>
          </>
        }
      >
        <div className="space-y-3">
          <input className="input" placeholder="Номер (напр., 5)" value={form.number} onChange={e=>setForm({...form, number:e.target.value})}/>
          <input className="input" placeholder="Назва (необов'язково)" value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
          <input className="input" type="date" placeholder="Початок семестру" value={form.startDate} onChange={e=>setForm({...form, startDate:e.target.value})}/>
          <input className="input" type="date" placeholder="Кінець семестру" value={form.endDate} onChange={e=>setForm({...form, endDate:e.target.value})}/>
        </div>
      </Modal>

      <Modal
        open={edit.open}
        onClose={()=>setEdit({ open:false, id:null, form: edit.form })}
        title="Редагування семестру"
        footer={
          <>
            <Button onClick={()=>setEdit({ open:false, id:null, form:{ number:"", title:"", startDate:"", endDate:"" } })}>Скасувати</Button>
            <Button variant="primary" onClick={async ()=>{ await SemesterService.patch(uid, edit.id, edit.form); setEdit({ open:false, id:null, form:{ number:"", title:"", startDate:"", endDate:"" } }); }}>Зберегти</Button>
          </>
        }
      >
        <div className="space-y-3">
          <input className="input" placeholder="Номер" value={edit.form.number} onChange={e=>setEdit({...edit, form:{...edit.form, number:e.target.value}})}/>
          <input className="input" placeholder="Назва" value={edit.form.title} onChange={e=>setEdit({...edit, form:{...edit.form, title:e.target.value}})}/>
          <input className="input" type="date" placeholder="Початок" value={edit.form.startDate} onChange={e=>setEdit({...edit, form:{...edit.form, startDate:e.target.value}})}/>
          <input className="input" type="date" placeholder="Кінець" value={edit.form.endDate} onChange={e=>setEdit({...edit, form:{...edit.form, endDate:e.target.value}})}/>
        </div>
      </Modal>
    </div>
  );
}
