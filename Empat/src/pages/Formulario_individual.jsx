import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Atletas } from "../js/athletes";
import { Avaliacoes } from "../js/avaliacoes";
import { INDIVIDUAL_SKILLS, SOFT_SKILLS } from "../js/constants";
import { LIKERT_SCALE } from "../js/constants";
import '../css/App.css';

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
  const [searchParams] = useSearchParams();
  const athleteIdFromUrl = searchParams.get("athlete");

  const [athletes, setAthletes] = useState([]);
  const [athleteId, setAthleteId] = useState("");
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [showScale, setShowScale] = useState(false);
  const [skillId, setSkillId] = useState("");

  const filteredSkills = skillId
  ? INDIVIDUAL_SKILLS.filter(skill => skill.id === skillId)
  : INDIVIDUAL_SKILLS;

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

  useEffect(() => {
  if (athleteIdFromUrl && athletes.length > 0) {
    const atletaExiste = athletes.some(
      athlete => String(athlete.id) === String(athleteIdFromUrl)
    );

    if (atletaExiste) {
      setAthleteId(athleteIdFromUrl);
    }
  }
}, [athleteIdFromUrl, athletes]);

  const setAns = (skillId, phase, val) =>
    setAnswers((p) => ({ ...p, [`${skillId}-${phase}`]: val }));

  const submit = async () => {
    if (!athleteId) return;
    setSaving(true);
    try {
      const scores = {};
      INDIVIDUAL_SKILLS.forEach((s) => {
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
        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">
              Lista de Atletas
            </label>

            <select
              value={athleteId}
              onChange={(e) => setAthleteId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
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


          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">
              Soft Skills
            </label>

            <select
              value={skillId}
              onChange={(e) => setSkillId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
              data-testid="assessment-skill-select"
            >
              <option value="">— Escolhe uma Soft Skill —</option>

              {SOFT_SKILLS.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}

            </select>
          </div>

        </div>
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

      

      {filteredSkills.map((s, idx) => {
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

    <div className="flex gap-3 justify-around md:justify-end">
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
    <div className="rounded-2xl bg-white border border-slate-200 p-5" data-testid="likert-scale-section">
      <button
        onClick={() => setShowScale((v) => !v)}
        className="w-full flex items-center justify-between text-left"
        data-testid="likert-scale-toggle"
      >
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight">
            Escala Likert — Guia de Referência
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Critérios para atribuir os valores 1, 3 e 5 em cada soft skill.
          </p>
        </div>
        <span className="text-slate-700 text-sm font-semibold">
          {showScale ? "Ocultar ▲" : "Mostrar ▼"}
        </span>
      </button>

        {showScale && (
          <div className="mt-5 space-y-5">
            {LIKERT_SCALE.map((skill) => (
              <div key={skill.id} className="border border-slate-200 rounded-xl p-4">
                <h3 className="font-semibold text-slate-800 mb-3">{skill.name}</h3>
                <div className="space-y-2">
                  {skill.levels.map((lvl) => (
                    <div key={lvl.value} className="flex gap-3 text-sm">
                      <span className="shrink-0 font-semibold text-slate-700">
                        {lvl.value} ({lvl.label}):
                      </span>
                      <span className="text-slate-600">{lvl.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
