
import React, { useEffect, useState } from "react";
import { SOFT_SKILLS, SKILL_MAP, SPORTS } from "../js/constants";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sooner";

export default function Observations() {
  const [athletes, setAthletes] = useState([]);
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ athlete_id: "", team: "", sport: "futebol", raw_text: "" });
  const [saving, setSaving] = useState(false);
  const [aiId, setAiId] = useState(null);

  const load = () => Promise.all([
    api.get("/athletes").then(r=>setAthletes(r.data)),
    api.get("/observations").then(r=>setList(r.data)),
  ]);
  useEffect(()=>{ load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.raw_text.trim()) return;
    setSaving(true);
    try {
      await api.post("/observations", { ...form, athlete_id: form.athlete_id || null });
      setForm({ athlete_id: form.athlete_id, team: form.team, sport: form.sport, raw_text: "" });
      toast.success("Observação registada");
      load();
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setSaving(false); }
  };

  const analyze = async (obsId) => {
    setAiId(obsId);
    try {
      await api.post(`/ai/analyze-observation/${obsId}`);
      toast.success("Análise IA gerada");
      load();
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setAiId(null); }
  };

  return (
    <div className="space-y-6" data-testid="observations-page">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tighter">Observações pós-treino</h1>
        <p className="text-slate-500 mt-1">Regista rapidamente o que viste. A IA transforma em padrões.</p>
      </div>

      <form onSubmit={submit} className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4" data-testid="observation-form">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Atleta (opcional)</label>
            <select value={form.athlete_id} onChange={e=>setForm({...form,athlete_id:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white" data-testid="obs-athlete">
              <option value="">— Equipa inteira —</option>
              {athletes.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Equipa / Turma</label>
            <input value={form.team} onChange={e=>setForm({...form,team:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200" data-testid="obs-team"/>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Desporto</label>
            <select value={form.sport} onChange={e=>setForm({...form,sport:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white" data-testid="obs-sport">
              {SPORTS.filter(s=>s!=="todos").map(s=><option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Observações (linguagem natural)</label>
          <textarea required rows={4} value={form.raw_text} onChange={e=>setForm({...form,raw_text:e.target.value})}
            placeholder="Ex: João não passou a bola; Maria liderou; equipa silenciosa nos últimos 5 min..."
            className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200" data-testid="obs-text"/>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="px-6 py-3 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60" data-testid="obs-save">
            {saving ? "A guardar..." : "Registar"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold">Histórico</h2>
        {list.length === 0 && <p className="text-slate-500 text-sm">Sem observações ainda.</p>}
        {list.map(o => {
          const ath = athletes.find(a=>a.id===o.athlete_id);
          return (
            <div key={o.id} className="rounded-2xl bg-white border border-slate-200 p-5" data-testid={`obs-${o.id}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs text-slate-500">{new Date(o.created_at).toLocaleString("pt-PT")} · {ath ? ath.name : (o.team || "Equipa")}</div>
                  <p className="mt-1 text-slate-800">{o.raw_text}</p>
                </div>
                {!o.ai_analysis && (
                  <button onClick={()=>analyze(o.id)} disabled={aiId===o.id}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60"
                    data-testid={`analyze-${o.id}`}>
                    {aiId===o.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
                    Analisar com IA
                  </button>
                )}
              </div>
              {o.ai_analysis && (
                <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-4">
                  {o.ai_analysis.summary && <p className="text-sm font-semibold text-slate-800 mb-3">IA: {o.ai_analysis.summary}</p>}
                  <div className="grid md:grid-cols-2 gap-3">
                    {(o.ai_analysis.patterns||[]).map((p,i)=>{
                      const sk = SKILL_MAP[p.skill];
                      return (
                        <div key={i} className={`p-3 rounded-lg border ${sk?.soft}`}>
                          <div className="text-xs font-bold">{sk?.name}</div>
                          <div className="mt-1 text-sm font-semibold text-slate-900">{p.insight}</div>
                          {p.evidence && <div className="text-xs text-slate-600 mt-1">Evidência: {p.evidence}</div>}
                          {p.suggestion && <div className="text-xs text-slate-700 mt-1"><strong>Sugestão:</strong> {p.suggestion}</div>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
