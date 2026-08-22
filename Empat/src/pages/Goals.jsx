import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Atletas } from "../js/athletes";
import { Goals } from "../js/goals";
import { Plus, Trash2, Target, Hourglass, Sparkles } from "lucide-react";

export default function GoalsComponent() {
  const [athletes, setAthletes] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState("");
  const [goals, setGoals] = useState([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("todas");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();

  const goalTemplates = [
    "Participar mais nas atividades da equipa",
    "Melhorar a comunicação com os colegas",
    "Demonstrar mais iniciativa",
    "Respeitar os colegas durante os exercícios",
    "Aumentar a participação nos treinos",
    "Desenvolver a liderança",
    "Melhorar o trabalho em equipa",
    "Gerir melhor as emoções",
  ];

  const [form, setForm] = useState({
    description: "",
    priority: "media",
    deadlineType: "year",
    deadline: "",
  });

  // Carregar atletas
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

  // Carregar metas
  useEffect(() => {
    async function loadGoals() {
      try {
        setLoading(true);
        const data = await Goals.getAllData();
        setGoals(data || []);
      } catch (e) {
        console.warn("Erro ao carregar metas. Tenta novamente.");
      } finally {
        setLoading(false);
      }
    }
    loadGoals();
  }, []);

  // Carregar metas quando o atleta muda
  useEffect(() => {
    if (selectedAthlete) {
      async function loadAthleteGoals() {
        try {
          setLoading(true);
          const data = await Goals.getGoalsByAtleta(String(selectedAthlete));
          setGoals(data);
        } catch (e) {
          console.warn("Erro ao carregar metas do atleta.", e);
          setError("Erro ao carregar metas do atleta.");
        } finally {
          setLoading(false);
        }
      }
      loadAthleteGoals();
    } else {
      setGoals([]);
    }
  }, [selectedAthlete]);

  const remainingDays = (deadline) => {
    if (!deadline) {
      return null;
    }

    const today = new Date();
    const end = new Date(deadline);

    return Math.ceil(
      (end - today) / (1000 * 60 * 60 * 24)
    );
  };

  const deadlineClass = (deadline) => {
    if (!deadline) {
      return "bg-slate-100 text-slate-600";
    }

    const days = remainingDays(deadline);

    if (days < 0) {
      return "bg-red-100 text-red-700";
    }

    if (days <= 30) {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  const deadlineText = (deadline) => {
    if (!deadline) {
      return "Sem prazo";
    }

    const days = remainingDays(deadline);

    if (days < 0) {
      return `Expirada há ${Math.abs(days)} dias`;
    }

    return `Faltam ${days} dias`;
  };

  const priorityClass = (priority) => {
    switch (priority) {
      case "alta":
        return "bg-red-100 text-red-700";
      case "baixa":
        return "bg-green-100 text-green-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const priorityText = (priority) => {
    switch (priority) {
      case "alta":
        return "Prioridade: Alta";
      case "baixa":
        return "Prioridade: Baixa";
      default:
        return "Prioridade: Média";
    }
  };

  const addGoal = async () => {
    setError("");

    if (!selectedAthlete) {
      setError("Seleciona um atleta.");
      return;
    }

    if (!form.description.trim()) {
      setError("A descrição da meta é obrigatória.");
      return;
    }

    if (form.deadlineType === "custom" && !form.deadline) {
      setError("Seleciona uma data.");
      return;
    }

    setSaving(true);

    try {
      let deadline = null;
      
      if (form.deadlineType === "year") {
        deadline = `${currentYear}-12-31`;
      } else if (form.deadlineType === "custom" && form.deadline) {
        deadline = form.deadline;
      }

      const newGoal = {
        athlete_id: String(selectedAthlete),
        description: form.description,
        priority: form.priority,
        completed: false,
        deadline: deadline,
      };

      await Goals.insert(newGoal);
      
      const updatedGoals = await Goals.getGoalsByAtleta(String(selectedAthlete));
      setGoals(updatedGoals);

      setForm({
        description: "",
        priority: "media",
        deadlineType: "year",
        deadline: "",
      });

      setShow(false);
    } catch (e) {
      console.error("Erro ao guardar meta:", e);
      
      let errorMessage = "Erro ao guardar a meta. Tenta novamente.";
      
      if (e.message && e.message.includes("row-level security")) {
        errorMessage = "Erro de permissões. Verifica se estás autenticado.";
      } else if (e.message) {
        errorMessage = e.message;
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const toggleGoal = async (id) => {
    try {
      const goal = goals.find(g => g.id === id);
      if (!goal) return;

      await Goals.toggleCompleted(id, !goal.completed);
      
      const updatedGoals = await Goals.getGoalsByAtleta(String(selectedAthlete));
      setGoals(updatedGoals);
    } catch (e) {
      console.error("Erro ao atualizar meta:", e);
      setError("Erro ao atualizar a meta. Tenta novamente.");
    }
  };

  const removeGoal = async (id) => {
    if (!window.confirm("Tem certeza que deseja eliminar esta meta?")) {
      return;
    }

    try {
      await Goals.delete(id);
      
      const updatedGoals = await Goals.getGoalsByAtleta(String(selectedAthlete));
      setGoals(updatedGoals);
    } catch (e) {
      console.error("Erro ao eliminar meta:", e);
      setError("Erro ao eliminar a meta. Tenta novamente.");
    }
  };

  // Filtrar metas por prioridade
  const getFilteredGoals = () => {
    if (priorityFilter === "todas") {
      return goals;
    }
    return goals.filter(goal => goal.priority === priorityFilter);
  };

  const athleteGoals = getFilteredGoals();

  const completedGoals = athleteGoals.filter(
    (g) => g.completed
  ).length;

  const pendingGoals = athleteGoals.filter(
    (g) => !g.completed
  ).length;

  const expiredGoals = athleteGoals.filter(
    (g) =>
      !g.completed &&
      remainingDays(g.deadline) !== null &&
      remainingDays(g.deadline) < 0
  ).length;

  if (loading && selectedAthlete) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando metas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="goals-page">
      <div id="goals-header" className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tighter">
            Metas
          </h1>

          <p className="text-slate-500 mt-1">
            Define objetivos para cada atleta.
          </p>
        </div>

        <button
          id="btn-new-goal"
          onClick={() => setShow(!show)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:opacity-90 transition-all"
          data-testid="goal-add-button"
        >
          <Plus className="w-4 h-4" />
          Nova meta
        </button>
      </div>

      {/* Área combinada: Select de atleta + Formulário */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5">
        <div className="space-y-4">
          {/* Select de atleta */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">
              Lista de atletas
            </label>

            <select
              value={selectedAthlete}
              onChange={(e) => setSelectedAthlete(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
              data-testid="goal-athlete-select"
            >
              <option value="">
                — Escolhe um atleta —
              </option>

              {athletes.map((athlete) => (
                <option key={athlete.id} value={athlete.id}>
                  {athlete.name}
                </option>
              ))}
            </select>
          </div>

          {/* Formulário - visível apenas quando show é true */}
          {show && (
            <div className="border-t border-slate-200 pt-4 mt-2">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-4">
                  {error}
                </div>
              )}

              {/* Grid de 2 colunas para desktop, 1 coluna para mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coluna 1 */}
                <div className="space-y-4">
                  {/* Sugestões de metas - agora como botões */}
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-slate-400" />
                      Sugestões de metas
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {goalTemplates.slice(0, 4).map((goal) => (
                        <button
                          key={goal}
                          onClick={() =>
                            setForm({
                              ...form,
                              description: goal,
                            })
                          }
                          className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all whitespace-nowrap"
                        >
                          {goal.length > 30 ? goal.substring(0, 30) + "..." : goal}
                        </button>
                      ))}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {goalTemplates.slice(4).map((goal) => (
                        <button
                          key={goal}
                          onClick={() =>
                            setForm({
                              ...form,
                              description: goal,
                            })
                          }
                          className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-all whitespace-nowrap"
                        >
                          {goal.length > 30 ? goal.substring(0, 30) + "..." : goal}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">
                      Clica numa sugestão para preencher automaticamente
                    </p>
                  </div>

                  {/* Descrição da meta */}
                  <div>
                    <label className="text-sm font-medium">
                      Descrição da meta <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      value={form.description}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          description: e.target.value,
                        })
                      }
                      className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                      placeholder="Ex.: melhorar a comunicação com a equipa"
                      data-testid="goal-description"
                    />
                  </div>
                </div>

                {/* Coluna 2 */}
                <div className="space-y-4">
                  {/* Prazo e data personalizada juntos */}
                  <div>
                    <label className="text-sm font-medium">
                      Prazo
                    </label>

                    <select
                      value={form.deadlineType}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          deadlineType: e.target.value,
                          deadline: e.target.value !== "custom" ? "" : form.deadline,
                        })
                      }
                      className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                      data-testid="goal-deadline-type"
                    >
                      <option value="year">
                        Até ao final do ano ({currentYear})
                      </option>

                      <option value="custom">
                        Escolher uma data
                      </option>

                      <option value="none">
                        Sem prazo
                      </option>
                    </select>

                    {form.deadlineType === "custom" && (
                      <input
                        type="date"
                        value={form.deadline}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            deadline: e.target.value,
                          })
                        }
                        className="mt-2 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                        data-testid="goal-custom-date"
                      />
                    )}
                  </div>

                  {/* Prioridade */}
                  <div>
                    <label className="text-sm font-medium">
                      Prioridade
                    </label>

                    <select
                      value={form.priority}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          priority: e.target.value,
                        })
                      }
                      className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                      data-testid="goal-priority"
                    >
                      <option value="alta">
                        Alta
                      </option>

                      <option value="media">
                        Média
                      </option>

                      <option value="baixa">
                        Baixa
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Botões de ação - ocupam toda a largura */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setShow(false);
                    setError("");
                    setForm({
                      description: "",
                      priority: "media",
                      deadlineType: "year",
                      deadline: "",
                    });
                  }}
                  className="px-5 py-2.5 rounded-full bg-slate-100 font-semibold hover:bg-slate-200 transition-all order-2 sm:order-1"
                >
                  Cancelar
                </button>

                <button
                  onClick={addGoal}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-full bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                  data-testid="goal-save"
                >
                  {saving ? "A guardar..." : "Guardar meta"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedAthlete && (
        <>
          {/* Filtro de prioridade - sempre visível quando há atleta selecionado */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPriorityFilter("todas")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                priorityFilter === "todas"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setPriorityFilter("alta")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                priorityFilter === "alta"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Alta
            </button>
            <button
              onClick={() => setPriorityFilter("media")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                priorityFilter === "media"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Média
            </button>
            <button
              onClick={() => setPriorityFilter("baixa")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                priorityFilter === "baixa"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Baixa
            </button>
          </div>

          {athleteGoals.length > 0 && (
            <>
              {/* Cards de estatísticas - responsivos */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 text-center">
                  <div className="text-xl md:text-2xl font-bold">
                    {athleteGoals.length}
                  </div>
                  <div className="text-xs md:text-sm text-slate-500">
                    Total
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 text-center">
                  <div className="text-xl md:text-2xl font-bold text-green-600">
                    {completedGoals}
                  </div>
                  <div className="text-xs md:text-sm text-slate-500">
                    Concluídas
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 text-center">
                  <div className="text-xl md:text-2xl font-bold text-yellow-600">
                    {pendingGoals}
                  </div>
                  <div className="text-xs md:text-sm text-slate-500">
                    Pendentes
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-3 md:p-4 text-center">
                  <div className="text-xl md:text-2xl font-bold text-red-600">
                    {expiredGoals}
                  </div>
                  <div className="text-xs md:text-sm text-slate-500">
                    Atrasadas
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[...athleteGoals]
                  .sort((a, b) => {
                    const order = {
                      alta: 1,
                      media: 2,
                      baixa: 3,
                    };

                    return (
                      order[a.priority] - order[b.priority]
                    );
                  })
                  .map((goal) => (
                    <div
                      key={goal.id}
                      className={`rounded-2xl border p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between transition-all ${
                        goal.completed
                          ? "bg-cyan-50 border-cyan-200"
                          : "bg-white border-slate-200 hover:border-cyan-200 hover:shadow-md"
                      }`}
                      data-testid={`goal-item-${goal.id}`}
                    >
                      <div className="flex items-start sm:items-center gap-3 md:gap-4">
                        <input
                          type="checkbox"
                          checked={goal.completed}
                          onChange={() => toggleGoal(goal.id)}
                          className="w-5 h-5 md:w-6 md:h-6 accent-cyan-600 cursor-pointer mt-1 sm:mt-0"
                          data-testid={`goal-checkbox-${goal.id}`}
                        />

                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium text-sm md:text-base ${
                              goal.completed
                                ? "line-through text-slate-400"
                                : "text-slate-800"
                            }`}
                          >
                            {goal.description}
                          </p>

                          <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2">
                            <span
                              className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold ${priorityClass(
                                goal.priority
                              )}`}
                            >
                              {priorityText(goal.priority)}
                            </span>

                            <span
                              className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold ${deadlineClass(
                                goal.deadline
                              )}`}
                            >
                              <Hourglass className="w-2.5 h-2.5 md:w-3 md:h-3 inline mr-1 text-slate-400" />
                              {deadlineText(goal.deadline)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeGoal(goal.id)}
                        className="p-1.5 md:p-2 text-slate-400 hover:text-red-500 transition-colors mt-2 sm:mt-0 self-end sm:self-center"
                        data-testid={`goal-delete-${goal.id}`}
                      >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  ))}
              </div>
            </>
          )}

          {athleteGoals.length === 0 && !loading && (
            <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-8 md:p-12 text-center">
              <Target className="w-8 h-8 md:w-10 md:h-10 text-slate-400 mx-auto" />

              <p className="mt-3 text-sm md:text-base text-slate-500">
                {priorityFilter === "todas" 
                  ? "Este atleta ainda não tem metas definidas."
                  : `Não há metas com prioridade "${priorityFilter}".`}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}