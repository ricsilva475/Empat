
import React, { useEffect, useState } from "react";
import { SOFT_SKILLS, SKILL_MAP } from "../constants";
import { Plus, Trash2, Target } from "lucide-react";
import { toast } from "sooner";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [form, setForm] = useState({ athlete_id: "", skill: "comunicacao", description: "", target_level: 4, deadline: "" });
  const [show, setShow] = useState(false);

  const load = () => Promise.all([
    api.get("/goals").then(r=>setGoals(r.data)),
    api.get("/athletes").then(r=>setAthletes(r.data)),
  ])
  useEffect(()=>{ load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/goals", { ...form, target_level: parseInt(form.target_level) });
      toast.success("Meta criada");
      setShow(false); setForm({ athlete_id: "", skill: "comunicacao", description: "", target_level: 4, deadline: "" });
      load();
    } catch (e) { toast.error(formatApiError(e)); }
  };

  const del = async (id) => {
    await api.delete(`/goals/${id}`);
    load();
  };

  return (
    <div className="space-y-6" data-testid="goals-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tighter">Metas</h1>
          <p className="text-slate-500 mt-1">Objetivos com prazo para cada atleta.</p>
        </div>
        <button onClick={()=>setShow(v=>!v)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold" data-testid="add-goal-btn">
          <Plus className="w-4 h-4"/> Nova meta
        </button>
      </div>

      {show && (
        <form onSubmit={submit} className="rounded-2xl bg-white border border-slate-200 p-6 grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Atleta</label>
            <select required value={form.athlete_id} onChange={e=>setForm({...form,athlete_id:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white" data-testid="goal-athlete">
              <option value="">— escolhe —</option>
              {athletes.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Soft skill</label>
            <select value={form.skill} onChange={e=>setForm({...form,skill:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white">
              {SOFT_SKILLS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Descrição</label>
            <input required value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200" data-testid="goal-desc"/>
          </div>
          <div>
            <label className="text-sm font-medium">Nível alvo (1-5)</label>
            <input type="number" min={1} max={5} value={form.target_level} onChange={e=>setForm({...form,target_level:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"/>
          </div>
          <div>
            <label className="text-sm font-medium">Prazo</label>
            <input type="date" required value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200" data-testid="goal-deadline"/>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3">
            <button type="button" onClick={()=>setShow(false)} className="px-5 py-2.5 rounded-full bg-slate-100">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 rounded-full bg-cyan-600 text-white font-semibold" data-testid="goal-save">Guardar</button>
          </div>
        </form>
      )}

      {goals.length === 0 ? (
        <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-12 text-center">
          <Target className="w-10 h-10 text-slate-400 mx-auto"/>
          <p className="mt-3 text-slate-500">Sem metas definidas.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {goals.map(g => {
            const sk = SKILL_MAP[g.skill];
            const ath = athletes.find(a=>a.id===g.athlete_id);
            return (
              <div key={g.id} className="rounded-2xl bg-white border border-slate-200 p-5 flex gap-4">
                <div className="w-1.5 rounded-full" style={{background: sk?.color}}/>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`font-bold px-2 py-0.5 rounded-full ${sk?.soft}`}>{sk?.name}</span>
                    <span className="text-slate-500">· {ath?.name || "—"}</span>
                  </div>
                  <p className="mt-2 font-semibold text-slate-900">{g.description}</p>
                  <div className="mt-2 text-xs text-slate-500">Nível alvo: {g.target_level}/5 · Prazo: {g.deadline}</div>
                </div>
                <button onClick={()=>del(g.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
