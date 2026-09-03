
import React, { useState } from "react";
import { SOFT_SKILLS, SKILL_MAP, SPORTS } from "../js/constants";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sooner";

export default function Planner() {
  const [form, setForm] = useState({ sport: "futebol", skill: "comunicacao", age_range: "10-14", context: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const run = async () => {
    setLoading(true); setResult(null);
    try {
      const { data } = await api.post("/ai/suggest-exercises", form);
      setResult(data);
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setLoading(false); }
  };

  const sk = SKILL_MAP[form.skill];

  return (
    <div className="space-y-6" data-testid="planner-page">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tighter">Plano de treino com IA</h1>
        <p className="text-slate-500 mt-1">Escolhe desporto + soft skill. A IA sugere um plano adaptado.</p>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Desporto</label>
            <select value={form.sport} onChange={e=>setForm({...form,sport:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white" data-testid="plan-sport">
              {SPORTS.filter(s=>s!=="todos").map(s=><option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Soft skill alvo</label>
            <select value={form.skill} onChange={e=>setForm({...form,skill:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white" data-testid="plan-skill">
              {SOFT_SKILLS.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Idades</label>
            <input value={form.age_range} onChange={e=>setForm({...form,age_range:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200" data-testid="plan-age"/>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Contexto (opcional)</label>
            <input value={form.context} onChange={e=>setForm({...form,context:e.target.value})} placeholder="Ex: após derrota" className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200" data-testid="plan-context"/>
          </div>
        </div>
        <div className="mt-5">
          <button onClick={run} disabled={loading} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60" data-testid="plan-generate">
            {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
            Gerar plano
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-5" data-testid="plan-result">
          <div className="rounded-2xl border-2 p-6" style={{borderColor: sk.color, background: `${sk.color}0D`}}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{color: sk.color}}>
              <Sparkles className="w-4 h-4"/> Plano IA · {sk.name}
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">{result.plan.plan_title}</h2>
            <div className="mt-5 grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="text-xs font-bold uppercase text-slate-500">Aquecimento</div>
                <p className="mt-1 text-sm text-slate-800">{result.plan.warmup}</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="text-xs font-bold uppercase text-slate-500">Atividade principal</div>
                <p className="mt-1 text-sm text-slate-800">{result.plan.main_activity}</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <div className="text-xs font-bold uppercase text-slate-500">Retorno à calma</div>
                <p className="mt-1 text-sm text-slate-800">{result.plan.cooldown}</p>
              </div>
            </div>
            {result.plan.observation_cues?.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200">
                <div className="text-xs font-bold uppercase text-slate-500">O que observar durante o treino</div>
                <ul className="mt-2 space-y-1 text-sm text-slate-800">
                  {result.plan.observation_cues.map((c,i)=><li key={i}>• {c}</li>)}
                </ul>
              </div>
            )}
          </div>

          {result.catalog_matches?.length > 0 && (
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <h3 className="font-display text-lg font-bold">Exercícios relacionados do banco</h3>
              <div className="mt-3 grid md:grid-cols-2 gap-3">
                {result.catalog_matches.map(e => (
                  <div key={e.id} className="p-3 rounded-xl border border-slate-200">
                    <div className="font-semibold">{e.title}</div>
                    <div className="text-xs text-slate-500 capitalize">{e.sport} · {e.duration_min} min</div>
                    <p className="mt-1 text-sm text-slate-600">{e.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
