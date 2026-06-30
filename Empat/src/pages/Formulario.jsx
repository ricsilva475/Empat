import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Atletas } from "../js/athletes";
import { Avaliacoes } from "../js/avaliacoes";
import '../css/App.css';

const SKILLS = [
  {
    id: "motivacao",
    name: "Motivação",
    behavior: "Demonstra energia, empenho e iniciativa própria.",
  },
  {
    id: "comunicacao",
    name: "Comunicação",
    behavior: "Dá indicações claras, ouve e usa linguagem corporal positiva.",
  },
  {
    id: "lideranca",
    name: "Liderança",
    behavior: "Orienta os outros, assume responsabilidade e puxa pelo grupo.",
  },
  {
    id: "resiliencia",
    name: "Resiliência",
    behavior: "Mantém o esforço após o erro e a desvantagem.",
  },
  {
    id: "empatia",
    name: "Empatia",
    behavior: "Apoia colegas e respeita adversários/árbitros.",
  },
  {
    id: "toma_decisao",
    name: "Tomada de Decisão",
    behavior: "Escolhe a melhor opção sob pressão de forma rápida e segura.",
  },
  {
    id: "gestao_stress",
    name: "Gestão de Stress",
    behavior: "Mantém a calma e não bloqueia sob pressão.",
  },
];

function setValue(v) {
  const n = parseFloat(v);
  return !isNaN(n) && n >= 1 && n <= 5 ? n : null;
}

function calcularMedia(ini, fim) {
  const a = setValue(ini);
  const b = setValue(fim);
  if (a !== null && b !== null) return Math.round(((a + b) / 2) * 10) / 10;
  if (a !== null) return a;
  if (b !== null) return b;
  return null;
}

function isInvalidValue(v) {
  const n = parseFloat(v);
  return v !== "" && (isNaN(n) || n < 1 || n > 5);
}

export default function Assessments() {
  const [athletes, setAthletes] = useState([]);
  const [athleteId, setAthleteId] = useState("");
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function getAtletas() {
      try {
        const data = await Atletas.getAllData();
        setAthletes(data);
      } catch (e) {
        console.warn("Erro ao carregar atletas. Tenta novamente.");
      }
    }
    getAtletas();
  }, []);

  const setAns = (skillId, phase, val) =>
    setAnswers((p) => ({ ...p, [`${skillId}-${phase}`]: val }));

  const submit = async () => {
    if (!athleteId) return;
    setSaving(true);
    try {
      const scores = {};
      SKILLS.forEach((s) => {
        scores[s.id] =
          calcularMedia(answers[`${s.id}-ini`], answers[`${s.id}-fim`]) ?? 0;
      });
      await Avaliacoes.insert({ athlete_id: athleteId, ...scores, notes });
      setAnswers({});
      setNotes("");
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="assessments-page">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tighter">
          Avaliar soft skills
        </h1>
        <p className="text-slate-500 mt-1">
          Regista o valor observado em dois momentos: início e fim (escala de 1 a 5).
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-5">
        <label className="text-sm font-medium text-slate-700 block mb-1.5">
          Lista de Atletas
        </label>
        <select
          value={athleteId}
          onChange={(e) => setAthleteId(e.target.value)}
          className="w-full md:w-96 px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
          data-testid="assessment-athlete-select"
        >
          <option value="">— Escolhe um atleta —</option>
          {athletes.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
        <div className="hidden min-[961px]:grid grid-cols-[160px_1fr_110px_110px_100px] gap-0 border-b border-slate-200 bg-slate-50 px-6 py-3">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Soft Skill
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Comportamento Observável
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">
            Início (1 a 5)
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">
            Fim (1 a 5)
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">
            Média
          </div>
        </div>

        {SKILLS.map((s, idx) => {
          const ini = answers[`${s.id}-ini`] ?? "";
          const fim = answers[`${s.id}-fim`] ?? "";
          const media = calcularMedia(ini, fim);

          return (
            <div
  key={s.id}
  className="
    border-b border-slate-100
    p-4
    min-[961px]:grid
    min-[961px]:grid-cols-[160px_1fr_110px_110px_100px]
    min-[961px]:items-center
"
>
              <div className="font-semibold">
                {s.name}
              </div>

             <div className="text-sm text-slate-600 mt-2 min-[961px]:mt-0">
                {s.behavior}
              </div>
              <div className="form-card">
              <div className="mt-4 min-[961px]:mt-0">
                <label className="block min-[961px]:hidden text-xs text-slate-500 mb-1">
                  Início (1 a 5)
                </label>
                <input type="text" inputMode="decimal" placeholder="—" value={ini} onChange={(e) => setAns(s.id, "ini", e.target.value)} className={`
  w-16 text-center px-2 py-2 rounded-xl border text-sm bg-white
  ${isInvalidValue(ini) ? "border-red-500 ring-1 ring-red-200" : "border-slate-200"}
`} data-testid={`input-${s.id}-ini`}/>
              </div>

              <div className="mt-3 min-[961px]:mt-0">
                <label className="block min-[961px]:hidden text-xs text-slate-500 mb-1">
                  Fim (1 a 5)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="—"
                  value={fim}
                  onChange={(e) => setAns(s.id, "fim", e.target.value)}
                  className={`
                    w-16 text-center px-2 py-2 rounded-xl border text-sm bg-white
                    ${isInvalidValue(fim) ? "border-red-500 ring-1 ring-red-200" : "border-slate-200"}
                  `}
                  data-testid={`input-${s.id}-fim`}
                />
              </div>

              <div className="mt-3 min-[961px]:mt-0 text-center min-[961px]:text-center">
                Média: {media ?? "—"}
              </div>
            </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-5">
        <label className="text-sm font-medium text-slate-700 block mb-1.5">
          Notas (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Observações adicionais sobre o atleta..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          data-testid="assessment-notes"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Link
          to="/menu"
          className="inline-block px-5 py-3 rounded-full bg-slate-100 font-semibold btn-hover-yellow"
        >
          Cancelar
        </Link>
        <button
          onClick={submit}
          disabled={saving || !athleteId}
          className="px-6 py-3 rounded-full bg-slate-900 text-white font-semibold btn-hover-green"
          data-testid="assessment-save"
        >
          {saving ? "A guardar..." : "Guardar avaliação"}
        </button>
      </div>
    </div>
  );
}
