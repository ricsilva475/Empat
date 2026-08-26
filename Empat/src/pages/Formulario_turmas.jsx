import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Grupos } from "../js/groups";
import { Avaliacoes } from "../js/avaliacoes";
import { GROUP_SKILLS } from "../js/constants";
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

export default function ColectiveAssessments() {
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [showScale, setShowScale] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showGroupWarning, setShowGroupWarning] = useState(false);

  // Inicializar com todas as skills selecionadas
  useEffect(() => {
    if (GROUP_SKILLS.length > 0 && selectedSkills.length === 0) {
      setSelectedSkills(GROUP_SKILLS.map(skill => skill.id));
    }
  }, []);

  // Função para alternar seleção de uma skill
  const toggleSkill = (skillId) => {
    setSelectedSkills(prev => {
      if (prev.includes(skillId)) {
        // Se for a última skill selecionada, não permite desmarcar
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== skillId);
      } else {
        return [...prev, skillId];
      }
    });
  };

  // Função para alternar entre selecionar todas e Remover todas
  const toggleAllSkills = () => {
    const allSkillIds = GROUP_SKILLS.map(skill => skill.id);
    const areAllSelected = allSkillIds.every(id => selectedSkills.includes(id));
    
    if (areAllSelected) {
      // Se todas estão selecionadas, mantém apenas a primeira
      setSelectedSkills([allSkillIds[0]]);
    } else {
      // Se não estão todas selecionadas, seleciona todas
      setSelectedSkills(allSkillIds);
    }
  };

  // Skills filtradas baseadas na seleção
  const filteredSkills = GROUP_SKILLS.filter(skill => 
    selectedSkills.includes(skill.id)
  );

  // Verificar se todas as skills estão selecionadas
  const areAllSelected = GROUP_SKILLS.every(skill => 
    selectedSkills.includes(skill.id)
  );

  useEffect(() => {
    async function getGroups() {
      try {
        const data = await Grupos.getAllData();
        setGroups(data);
      } catch (e) {
        console.warn("Erro ao carregar turmas. Tenta novamente.");
      }
    }
    getGroups();
  }, []);

  const setAns = (skillId, phase, val) =>
    setAnswers((p) => ({ ...p, [`${skillId}-${phase}`]: val }));

  const handleSubmit = () => {
    if (!groupId) {
      setShowGroupWarning(true);
      // Scroll para o aviso
      const warningElement = document.getElementById('group-warning');
      if (warningElement) {
        warningElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    submit();
  };

  const submit = async () => {
    setSaving(true);
    try {
      const scores = {};
      GROUP_SKILLS.forEach((s) => {
        scores[s.id] =
          calcularMedia(answers[`${s.id}-ini`], answers[`${s.id}-fim`]) ?? 0;
      });
      await Avaliacoes.insert2({ group_id: groupId, ...scores, notes });
      setAnswers({});
      setNotes("");
      setShowGroupWarning(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Opções para o dropdown de valores
  const ratingOptions = [
    { value: "", label: "—" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
  ];

  return (
    <div className="space-y-6" data-testid="assessments-page">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tighter">
          Avaliar soft skills - Turmas
        </h1>
        <p className="text-slate-500 mt-1">
          Regista o valor observado em dois momentos: início e fim (escala de 1 a 5).
        </p>
      </div>

      {/* Aviso de turma não selecionada */}
      {showGroupWarning && (
        <div 
          id="group-warning"
          className="rounded-2xl bg-red-50 border border-red-200 p-4 animate-in fade-in slide-in-from-top-2"
          data-testid="group-warning"
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 text-red-500 text-xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-red-800">Nenhuma turma selecionada</h3>
              <p className="text-sm text-red-700 mt-0.5">
                Por favor, seleciona uma turma da lista antes de guardar a avaliação.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-200 p-5">
        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">
              Lista de Turmas
            </label>

            <select
              value={groupId}
              onChange={(e) => {
                setGroupId(e.target.value);
                setShowGroupWarning(false);
              }}
              className={`
                w-full px-4 py-2.5 rounded-xl border bg-white
                ${showGroupWarning ? 'border-red-500 ring-1 ring-red-200' : 'border-slate-200'}
              `}
              data-testid="assessment-group-select"
            >
              <option value="">— Escolhe uma turma —</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            {showGroupWarning && (
              <p className="text-xs text-red-600 mt-1">
                ⚠️ Seleciona uma turma para continuar
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-medium text-slate-700">
                Filtrar Soft Skills
              </label>
              <button
                onClick={toggleAllSkills}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                data-testid="toggle-all-skills"
              >
                {areAllSelected ? "Remover todas" : "Selecionar todas"}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-xl min-h-[48px]">
              {GROUP_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill.id);
                const isOnlySelected = selectedSkills.length === 1 && isSelected;
                
                return (
                  <button
                    key={skill.id}
                    onClick={() => toggleSkill(skill.id)}
                    className={`
                      px-3 py-1.5 rounded-full text-sm font-medium transition-all
                      ${isSelected 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }
                      ${isOnlySelected ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
                      ${selectedSkills.length === 1 && isSelected ? 'cursor-default' : 'cursor-pointer'}
                    `}
                    data-testid={`skill-filter-${skill.id}`}
                    disabled={selectedSkills.length === 1 && isSelected}
                    title={selectedSkills.length === 1 && isSelected ? 'Única selecionada' : ''}
                  >
                    {skill.name}
                    {isSelected && (
                      <span className="ml-1 text-xs opacity-75">✕</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {selectedSkills.length} de {GROUP_SKILLS.length} selecionadas
            </div>
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

        {filteredSkills.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Nenhuma soft skill selecionada. Seleciona pelo menos uma para avaliar.
          </div>
        ) : (
          filteredSkills.map((s, idx) => {
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
                    <select
                      value={ini}
                      onChange={(e) => setAns(s.id, "ini", e.target.value)}
                      className={`
                        w-16 text-center px-2 py-2 rounded-xl border text-sm bg-white
                        ${isInvalidValue(ini) ? "border-red-500 ring-1 ring-red-200" : "border-slate-200"}
                      `}
                      data-testid={`select-${s.id}-ini`}
                    >
                      {ratingOptions.map(opt => (
                        <option key={`${s.id}-ini-${opt.value}`} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-3 min-[961px]:mt-0">
                    <label className="block min-[961px]:hidden text-xs text-slate-500 mb-1">
                      Fim (1 a 5)
                    </label>
                    <select
                      value={fim}
                      onChange={(e) => setAns(s.id, "fim", e.target.value)}
                      className={`
                        w-16 text-center px-2 py-2 rounded-xl border text-sm bg-white
                        ${isInvalidValue(fim) ? "border-red-500 ring-1 ring-red-200" : "border-slate-200"}
                      `}
                      data-testid={`select-${s.id}-fim`}
                    >
                      {ratingOptions.map(opt => (
                        <option key={`${s.id}-fim-${opt.value}`} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-3 min-[961px]:mt-0 text-center min-[961px]:text-center">
                    Média: {media ?? "—"}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-5">
        <label className="text-sm font-medium text-slate-700 block mb-1.5">
          Notas (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Observações adicionais sobre a turma..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
          data-testid="assessment-notes"
        />
      </div>

      <div className="flex gap-3 justify-center sm:justify-end">
        <Link
          to="/menu"
          className="px-5 py-2.5 rounded-full bg-slate-100 font-semibold hover:bg-slate-200 transition-all"
        >
          Cancelar
        </Link>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`
            px-6 py-3 rounded-full font-semibold transition-all btn-hover-green
            ${!groupId 
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
              : 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-md hover:shadow-lg'
            }
          `}
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