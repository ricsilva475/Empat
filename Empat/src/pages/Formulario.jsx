
import React, { useEffect, useState } from "react";
import { SOFT_SKILLS, SKILL_MAP } from "../js/constants";
import { toast } from "sooner";
import { AtletasData } from "../js/athletes";
import { insertAvaliacao } from "../js/avaliacoes";
import { Questions } from "../js/forms";

const QUESTIONS = {
  empatia: [
    "Demonstra preocupação quando um colega está triste ou frustrado",
    "Consegue ver uma situação do ponto de vista do outro",
    "Apoia o colega em momentos de erro",
    "Ajusta o seu comportamento ao estado emocional do grupo",
  ],
  comunicacao: [
    "Fala com clareza e é compreendido(a) pelos colegas",
    "Escuta ativamente e faz perguntas quando não percebe",
    "Pede e partilha a bola / a vez com a equipa",
    "Comunica de forma positiva mesmo sob pressão",
  ],
  resiliencia: [
    "Continua a tentar após falhar",
    "Gere a frustração sem desistir ou abandonar",
    "Aceita feedback negativo sem se desmotivar",
    "Recupera rapidamente após derrotas",
  ],
  lideranca: [
    "Organiza ou orienta os colegas em exercícios",
    "Toma decisões em momentos importantes",
    "Assume responsabilidade pelos resultados da equipa",
    "Influencia positivamente o ambiente do grupo",
  ],
};

export default function Assessments() {
  const [athletes, setAthletes] = useState([]);
  const [athleteId, setAthleteId] = useState("");
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function getAtletas() {
      try {
        const data = await AtletasData.getAll();
        setAthletes(data);
        //setAthleteId(data.length ? data[0].id : "");
      } catch (e) {
        console.warn("Erro ao carregar atletas. Tenta novamente.");
      }
    }
    getAtletas();

  }, []);

  const setAns = (skill, idx, val) => setAnswers(p => ({ ...p, [`${skill}-${idx}`]: val }));

  const computeScores = () => {
    const scores = {};
    for (const skill of Object.keys(QUESTIONS)) {
      const vals = QUESTIONS[skill].map((_, i) => answers[`${skill}-${i}`]).filter(Boolean);
      scores[skill] = vals.length ? Math.round((vals.reduce((a,b)=>a+b,0) / vals.length) * 10) / 10 : 0;
    }
    return scores;
  };

  const submit = async () => {
    if (!athleteId) { toast.error("Seleciona um atleta"); return; }
    const scores = computeScores();
    setSaving(true);
    try {
      await insertAvaliacao({ athlete_id: athleteId, empatia: scores.empatia, comunicacao: scores.comunicacao, resiliencia: scores.resiliencia, lideranca: scores.lideranca, notes });
      console.warn("Avaliação guardada com sucesso!");
      setAnswers({}); setNotes("");
    } catch (e) { console.error("Erro ao guardar avaliação:", e); }
    finally { setSaving(false); }
  };

  const scores = computeScores();

  return (
    <div className="space-y-6" data-testid="assessments-page">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tighter">Avaliar soft skills</h1>
        <p className="text-slate-500 mt-1">Responde com base em comportamento observado (1 = muito raro, 5 = muito consistente).</p>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-5">
        <select value={athleteId} onChange={e=>setAthleteId(e.target.value)} className="mt-1.5 w-full md:w-96 px-4 py-2.5 rounded-xl border border-slate-200 bg-white" data-testid="assessment-athlete-select">
          <option value="">— Escolhe um atleta —</option>
          {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>

      {SOFT_SKILLS.map(s => (
        <div key={s.id} className="rounded-2xl bg-white border border-slate-200 p-6" data-testid={`skill-section-${s.id}`}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold" style={{color: s.color}}>{s.name}</h2>
            <div className="text-sm text-slate-500">Média: <span className="font-bold text-slate-900">{scores[s.id]}</span>/5</div>
          </div>
          <div className="mt-4 space-y-4">
            {QUESTIONS[s.id].map((q, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 text-slate-700 text-sm">{q}</div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(v => {
                    const active = answers[`${s.id}-${i}`] === v;
                    return (
                      <button key={v} onClick={()=>setAns(s.id, i, v)}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${active ? "text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                        style={active ? {background: s.color} : {}}
                        data-testid={`answer-${s.id}-${i}-${v}`}>{v}</button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-2xl bg-white border border-slate-200 p-5">
        <label className="text-sm font-medium text-slate-700">Notas (opcional)</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200" data-testid="assessment-notes"/>
      </div>

      <div className="flex justify-end">
        <button onClick={submit} disabled={saving || !athleteId}
          className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold" data-testid="assessment-save">
          {saving ? "A guardar..." : "Guardar avaliação"}
        </button>
      </div>
    </div>
  );
}
