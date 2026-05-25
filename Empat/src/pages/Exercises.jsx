
import React, { useEffect, useState } from "react";
import { SOFT_SKILLS, SKILL_MAP, SPORTS } from "../constants";
import { Clock, Target } from "lucide-react";

export default function Exercises() {
  const [list, setList] = useState([]);
  const [skill, setSkill] = useState("");
  const [sport, setSport] = useState("");

  const load = () => {
    const p = new URLSearchParams();
    if (skill) p.set("skill", skill);
    if (sport) p.set("sport", sport);
    api.get(`/exercises?${p.toString()}`).then(r => setList(r.data));
  };
  useEffect(() => { load(); }, [skill, sport]);

  return (
    <div className="space-y-6" data-testid="exercises-page">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tighter">Banco de exercícios</h1>
        <p className="text-slate-500 mt-1">Filtra por soft skill ou desporto.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={()=>setSkill("")} className={`px-4 py-2 rounded-full text-sm font-semibold ${!skill ? "bg-slate-900 text-white" : "bg-white border border-slate-200"}`} data-testid="filter-skill-all">Todas</button>
        {SOFT_SKILLS.map(s => (
          <button key={s.id} onClick={()=>setSkill(s.id)} className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${skill===s.id ? "text-white" : "bg-white border-slate-200"}`} style={skill===s.id ? {background: s.color, borderColor: s.color} : {}} data-testid={`filter-skill-${s.id}`}>{s.name}</button>
        ))}
        <select value={sport} onChange={e=>setSport(e.target.value)} className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-semibold" data-testid="filter-sport">
          <option value="">Todos desportos</option>
          {SPORTS.map(s=><option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-12 text-center text-slate-500">Nenhum exercício encontrado.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(e => {
            const sk = SKILL_MAP[e.skill];
            return (
              <div key={e.id} className="rounded-2xl bg-white border border-slate-200 p-5 hover:-translate-y-0.5 transition" data-testid={`exercise-${e.id}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sk?.soft}`}>{sk?.name}</span>
                  <span className="text-xs text-slate-500 capitalize">{e.sport}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-bold leading-tight">{e.title}</h3>
                <p className="mt-2 text-sm text-slate-600 line-clamp-3">{e.description}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {e.duration_min} min</span>
                  <span className="inline-flex items-center gap-1"><Target className="w-3.5 h-3.5"/> {e.age_range}</span>
                </div>
                <ul className="mt-3 space-y-1">
                  {(e.objectives||[]).map((o,i)=><li key={i} className="text-xs text-slate-600">• {o}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
