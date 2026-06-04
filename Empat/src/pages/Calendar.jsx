
import React, { useEffect, useState } from "react";
import { SOFT_SKILLS, SKILL_MAP, SPORTS } from "../js/constants";
import { Plus, Trash2, CalendarDays } from "lucide-react";
import { Classes } from "../js/classes";

export default function CalendarPage() {
  const [sessions, setSessions] = useState([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", sport: "futebol", focus_skill: "comunicacao", team: "", notes: "" });

  useEffect(() => {
      
      async function ClassesData() {
        try {
          const data = await Classes.getAllData();
          console.log("Sessões carregadas:", data);
          setSessions(data);
        } catch (e) {
          console.error(e);
        }
      }
      ClassesData();
    }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
    await Classes.insert({
            ...form,
            date: new Date(form.date).toISOString(),
    })
      console.log("Aula criada:", form);
      setShow(false); 
      setForm({ title: "", date: "", sport: "futebol", focus_skill: "comunicacao", team: "", notes: "" });
      window.location.reload();
    } catch (e) { console.log("Erro: ", e); }
  };

  const grouped = sessions.reduce((acc, s) => {
  
  const day = (s.time || "").slice(0, 10);

  acc[day] = acc[day] || [];
  acc[day].push(s);

  return acc;

    }, {});

  return (
    <div className="space-y-6" data-testid="calendar-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tighter">Calendário de treinos</h1>
          <p className="text-slate-500 mt-1">Planeia sessões com foco de soft skill.</p>
        </div>
        <button onClick={()=>setShow(v=>!v)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold btn-hover-orange" data-testid="add-session-btn">
          <Plus className="w-4 h-4"/> Nova sessão
        </button>
      </div>

      {show && (
        <form onSubmit={submit} className="rounded-2xl bg-white border border-slate-200 p-6 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Título</label>
            <input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200" data-testid="session-title"/>
          </div>
          <div>
            <label className="text-sm font-medium">Data e hora</label>
            <input type="datetime-local" required value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200" data-testid="session-date"/>
          </div>
          <div>
            <label className="text-sm font-medium">Equipa</label>
            <input value={form.team} onChange={e=>setForm({...form,team:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"/>
          </div>
          <div>
            <label className="text-sm font-medium">Desporto</label>
            <select value={form.sport} onChange={e=>setForm({...form,sport:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white">
              {SPORTS.filter(s=>s!== "todos").map(s=><option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Foco (soft skill)</label>
            <select value={form.focus_skill} onChange={e=>setForm({...form,focus_skill:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white">
              {SOFT_SKILLS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Notas</label>
            <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"/>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3">
            <button type="button" onClick={()=>setShow(false)} className="px-5 py-2.5 rounded-full bg-slate-100 btn-hover-yellow">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 rounded-full bg-cyan-600 text-white font-semibold btn-hover-green" data-testid="session-save">Guardar</button>
          </div>
        </form>
      )}

      {sessions.length === 0 ? (
        <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-12 text-center">
          <CalendarDays className="w-10 h-10 text-slate-400 mx-auto"/>
          <p className="mt-3 text-slate-500">Sem sessões agendadas.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{new Date(date).toLocaleDateString("pt-PT", {weekday: "long",day: "2-digit"})}</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {items.map(s => {
                  const sk = SKILL_MAP[s.focus_skill];
                  return (
                    <div key={s.id} className="rounded-2xl bg-white border border-slate-200 p-5 flex gap-4" data-testid={`session-${s.id}`}>
                      <div className="w-1.5 rounded-full" style={{background: sk?.color}}/>
                      <div className="flex-1">
                        <div className="text-xs text-slate-500">{new Date(s.time).toLocaleTimeString("pt-PT", {hour: "2-digit",minute: "2-digit"})} · {s.team || "—"}</div>
                        <h3 className="font-display font-bold">{s.title}</h3>
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span className={`px-2 py-0.5 rounded-full font-bold ${sk?.soft}`}>{sk?.name}</span>
                          <span className="text-slate-500 capitalize">{s.sport}</span>
                        </div>
                      </div>
                      <button onClick={()=>del(s.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}