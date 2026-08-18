import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Atletas } from "../js/athletes";
import { Goals } from "../js/goals";
import { Plus, Trash2, Target, Hourglass } from "lucide-react";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tighter">
            Metas
          </h1>

          <p className="text-slate-500 mt-1">
            Define objetivos para cada atleta.
          </p>
        </div>

        <button
          onClick={() => setShow(!show)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:opacity-90 transition-all"
          data-testid="goal-add-button"
        >
          <Plus className="w-4 h-4" />
          Nova meta
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-5">
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

      {show && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          <div>
            <label className="text-sm font-medium">
              Exemplos de metas
            </label>

            <select
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
              data-testid="goal-template-select"
            >
              <option value="">
                — Escolher um exemplo —
              </option>

              {goalTemplates.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              Descrição da meta
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
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
              placeholder="Ex.: melhorar a comunicação com a equipa"
              data-testid="goal-description"
            />
          </div>

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
                })
              }
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
              data-testid="goal-deadline-type"
            >
              <option value="year">
                Até ao final do ano
              </option>

              <option value="custom">
                Escolher uma data
              </option>

              <option value="none">
                Sem prazo
              </option>
            </select>
          </div>

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
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
              data-testid="goal-custom-date"
            />
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShow(false)}
              className="px-5 py-2.5 rounded-full bg-slate-100 font-semibold"
            >
              Cancelar
            </button>

            <button
              onClick={addGoal}
              disabled={saving}
              className="px-5 py-2.5 rounded-full bg-cyan-600 text-white font-semibold hover:opacity-90 disabled:opacity-50"
              data-testid="goal-save"
            >
              {saving ? "A guardar..." : "Guardar"}
            </button>
          </div>
        </div>
      )}

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
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">
                    {athleteGoals.length}
                  </div>

                  <div className="text-sm text-slate-500">
                    Total
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">
                    {completedGoals}
                  </div>

                  <div className="text-sm text-slate-500">
                    Concluídas
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">
                    {pendingGoals}
                  </div>

                  <div className="text-sm text-slate-500">
                    Pendentes
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-bold">
                    {expiredGoals}
                  </div>

                  <div className="text-sm text-slate-500">
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
                      className={`rounded-2xl border p-5 flex items-center justify-between transition-all ${
                        goal.completed
                          ? "bg-cyan-50 border-cyan-200"
                          : "bg-white border-slate-200 hover:border-cyan-200 hover:shadow-md"
                      }`}
                      data-testid={`goal-item-${goal.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={goal.completed}
                          onChange={() => toggleGoal(goal.id)}
                          className="w-6 h-6 accent-cyan-600 cursor-pointer"
                          data-testid={`goal-checkbox-${goal.id}`}
                        />

                        <div>
                          <p
                            className={`font-medium ${
                              goal.completed
                                ? "line-through text-slate-400"
                                : "text-slate-800"
                            }`}
                          >
                            {goal.description}
                          </p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityClass(
                                goal.priority
                              )}`}
                            >
                              {priorityText(goal.priority)}
                            </span>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${deadlineClass(
                                goal.deadline
                              )}`}
                            >
                              <Hourglass className="w-3 h-3 inline mr-1 text-slate-400" />
                              {deadlineText(goal.deadline)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeGoal(goal.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        data-testid={`goal-delete-${goal.id}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
              </div>
            </>
          )}

          {athleteGoals.length === 0 && !loading && (
            <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-12 text-center">
              <Target className="w-10 h-10 text-slate-400 mx-auto" />

              <p className="mt-3 text-slate-500">
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