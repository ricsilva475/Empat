import React, { useEffect, useState, useCallback } from "react";
import { SOFT_SKILLS, SKILL_MAP, SPORTS } from "../js/constants";
import {
  Plus,
  Trash2,
  Users,
  X,
  Pencil,
  Check,
  Eye,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Atletas } from "../js/athletes";
import { Grupos } from "../js/groups";
import { toast } from "react-toastify";

// ============================================================
// CACHE
// ============================================================

const CACHE_KEYS = {
  GROUPS: "cache_groups_v2",
  ATHLETES: "cache_groups_athletes_v2",
  ATHLETE_GROUPS: "cache_groups_athlete_groups_v2",
  TIMESTAMP: "cache_groups_timestamp_v2",
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// ============================================================
// COMPONENT
// ============================================================

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    groupId: null,
    groupName: "",
  });

  const [form, setForm] = useState({
    name: "",
    sport: "",
    focus_skill: "",
    description: "",
    athlete_ids: [],
  });

  const [athleteGroups, setAthleteGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pesquisa de atletas
  const [athleteSearch, setAthleteSearch] = useState("");

  // ==========================================================
  // CACHE
  // ==========================================================

  const isCacheValid = useCallback(() => {
    const timestamp = localStorage.getItem(CACHE_KEYS.TIMESTAMP);
    if (!timestamp) return false;
    const elapsed = Date.now() - parseInt(timestamp, 10);
    return elapsed < CACHE_DURATION;
  }, []);

  const loadFromCache = useCallback(() => {
    try {
      const cachedGroups = localStorage.getItem(CACHE_KEYS.GROUPS);
      const cachedAthletes = localStorage.getItem(CACHE_KEYS.ATHLETES);
      const cachedAthleteGroups = localStorage.getItem(
        CACHE_KEYS.ATHLETE_GROUPS
      );

      if (cachedGroups && cachedAthletes && cachedAthleteGroups) {
        setGroups(JSON.parse(cachedGroups));
        setAthletes(JSON.parse(cachedAthletes));
        setAthleteGroups(JSON.parse(cachedAthleteGroups));
        return true;
      }
      return false;
    } catch (e) {
      console.error("Erro ao carregar cache:", e);
      return false;
    }
  }, []);

  const saveToCache = useCallback(
    (groupsData, athletesData, athleteGroupsData) => {
      try {
        localStorage.setItem(CACHE_KEYS.GROUPS, JSON.stringify(groupsData));
        localStorage.setItem(CACHE_KEYS.ATHLETES, JSON.stringify(athletesData));
        localStorage.setItem(
          CACHE_KEYS.ATHLETE_GROUPS,
          JSON.stringify(athleteGroupsData)
        );
        localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
      } catch (e) {
        console.error("Erro ao guardar cache:", e);
      }
    },
    []
  );

  // ==========================================================
  // CARREGAR DADOS (FORÇA REFRESH)
  // ==========================================================

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);

      // Atletas (todos, independentemente do desporto)
      const athletesData = await Atletas.getAllData();

      // Relação atleta <-> turma
      const athleteGroupsData = await Grupos.getAthletesWithGroups();

      // Turmas
      const groupsData = await Grupos.getAllData();

      const groupsWithAthletes = await Promise.all(
        groupsData.map(async (group) => {
          const athleteIds = await Grupos.getAthletesByGroup(group.id);

          const groupAthletes = athletesData
            .filter((athlete) =>
              athleteIds.some((id) => String(id) === String(athlete.id))
            )
            .sort((a, b) =>
              (a.name || "").localeCompare(b.name || "", "pt", {
                sensitivity: "base",
              })
            );

          return {
            ...group,
            atletasCount: groupAthletes.length,
            groupAthletes,
          };
        })
      );

      setAthletes(athletesData);
      setAthleteGroups(athleteGroupsData);
      setGroups(groupsWithAthletes);

      // Cache
      saveToCache(groupsWithAthletes, athletesData, athleteGroupsData);
    } catch (e) {
      console.error("Erro ao carregar dados das turmas:", e);
      toast.error("Erro ao carregar atletas e turmas.");
    } finally {
      setLoading(false);
    }
  }, [saveToCache]);

  // ==========================================================
  // CARREGAMENTO INICIAL (CACHE OU SERVIDOR)
  // ==========================================================

  const loadAllData = useCallback(async () => {
    if (isCacheValid()) {
      const loaded = loadFromCache();
      if (loaded) {
        setLoading(false);
        return;
      }
    }
    await refreshData();
  }, [isCacheValid, loadFromCache, refreshData]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ==========================================================
  // RESET
  // ==========================================================

  const resetForm = () => {
    setForm({
      name: "",
      sport: "",
      focus_skill: "",
      description: "",
      athlete_ids: [],
    });
    setAthleteSearch("");
    setEditingGroup(null);
    setShowForm(false);
  };

  // ==========================================================
  // NOVA TURMA
  // ==========================================================

  const startNewGroup = () => {
    setForm({
      name: "",
      sport: "",
      focus_skill: "",
      description: "",
      athlete_ids: [],
    });
    setAthleteSearch("");
    setEditingGroup(null);
    setShowForm(true);
  };

  // ==========================================================
  // SELECIONAR / REMOVER ATLETA
  // ==========================================================

  const toggleAthlete = (id) => {
    setForm((previous) => ({
      ...previous,
      athlete_ids: previous.athlete_ids.some(
        (athleteId) => String(athleteId) === String(id)
      )
        ? previous.athlete_ids.filter(
            (athleteId) => String(athleteId) !== String(id)
          )
        : [...previous.athlete_ids, id],
    }));
  };

  // ==========================================================
  // EDITAR TURMA
  // ==========================================================

  const startEdit = async (group) => {
    try {
      const athleteIds = await Grupos.getAthletesByGroup(group.id);

      setEditingGroup(group);

      setForm({
        name: group.name || "",
        sport: group.sport || "",
        focus_skill: group.focus_skill || "",
        description: group.description || group.notes || "",
        athlete_ids: athleteIds || [],
      });

      setAthleteSearch("");
      setShowForm(true);
    } catch (e) {
      console.error("Erro ao carregar atletas da turma:", e);
      toast.error("Erro ao carregar os atletas da turma.");
    }
  };

  // ==========================================================
  // GUARDAR TURMA
  // ==========================================================

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Indica o nome da turma.");
      return;
    }

    try {
      if (editingGroup) {
        await Grupos.update(editingGroup.id, form);
        toast.success("Turma atualizada com sucesso!");
      } else {
        await Grupos.insert(form);
        toast.success("Turma criada com sucesso!");
      }

      await refreshData();
      resetForm();
    } catch (e) {
      console.error("ERRO AO GUARDAR TURMA:", e);

      if (e?.message) {
        toast.error(e.message);
      } else {
        toast.error("Erro ao guardar a turma.");
      }
    }
  };

  // ==========================================================
  // ELIMINAR TURMA
  // ==========================================================

  const deleteGroup = (group) => {
    setDeleteModal({
      open: true,
      groupId: group.id,
      groupName: group.name,
    });
  };

  const cancelDeleteGroup = () => {
    setDeleteModal({
      open: false,
      groupId: null,
      groupName: "",
    });
  };

  const confirmDeleteGroup = async () => {
    try {
      // Verificação local (defesa extra, além do backend)
      const atletasNoGrupo = athleteGroups.filter(
        (ag) => String(ag.group_id) === String(deleteModal.groupId)
      );

      if (atletasNoGrupo.length > 0) {
        toast.error(
          "Não é possível eliminar a turma porque existem atletas associados."
        );
        cancelDeleteGroup();
        return;
      }

      await Grupos.delete(deleteModal.groupId);

      toast.success("Turma eliminada com sucesso!");

      cancelDeleteGroup();
      await refreshData();
    } catch (e) {
      console.error("Erro ao eliminar turma:", e);
      toast.error(e?.message || "Erro ao eliminar turma.");
    }
  };

  // ==========================================================
  // ATLETAS DISPONÍVEIS
  // ==========================================================

  const availableAthletes = athletes.filter((athlete) => {
    const athleteGroupsForAthlete = athleteGroups.filter(
      (ag) => String(ag.athlete_id) === String(athlete.id)
    );

    // Sem turma → disponível
    if (athleteGroupsForAthlete.length === 0) {
      return true;
    }

    // A editar e já pertence a esta turma → disponível
    if (editingGroup) {
      const belongsToCurrentGroup = athleteGroupsForAthlete.some(
        (ag) => String(ag.group_id) === String(editingGroup.id)
      );
      if (belongsToCurrentGroup) {
        return true;
      }
    }

    // Pertence a outra turma → indisponível
    return false;
  });

  // ==========================================================
  // PESQUISA DE ATLETAS
  // ==========================================================

  const normalizedSearch = athleteSearch.toLowerCase().trim();

  const filteredAthletes = availableAthletes.filter((athlete) => {
    if (!normalizedSearch) return true;

    const name = athlete.name?.toLowerCase() || "";
    const age =
      athlete.age !== null && athlete.age !== undefined
        ? String(athlete.age)
        : "";

    return name.includes(normalizedSearch) || age.includes(normalizedSearch);
  });

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto" />
          <p className="mt-4 text-slate-600">A carregar turmas e atletas...</p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6" data-testid="groups-page">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tighter">
            Turmas de atletas
          </h1>
          <p className="text-slate-500 mt-1">
            Organiza turmas e associa os atletas existentes.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={startNewGroup}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 btn-hover-orange transition"
            data-testid="add-group-btn"
          >
            <Plus className="w-4 h-4" />
            Nova turma
          </button>
        )}
      </div>

      {/* =====================================================
          MODAL: ELIMINAR TURMA
      ====================================================== */}

      {deleteModal.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 p-6">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <Trash2 className="w-7 h-7" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 text-center">
              Eliminar turma?
            </h2>

            <p className="mt-3 text-sm text-slate-600 text-center leading-relaxed">
              Tem a certeza de que pretende eliminar a turma{" "}
              <span className="font-semibold text-slate-800">
                "{deleteModal.groupName}"
              </span>
              ?
            </p>

            <p className="mt-3 text-xs text-slate-400 text-center">
              Os atletas associados a esta turma deixarão de estar associados à
              mesma.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={cancelDeleteGroup}
                className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={confirmDeleteGroup}
                className="flex-1 px-4 py-2.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          FORMULÁRIO
      ====================================================== */}

      {showForm && (
        <form
          onSubmit={submit}
          className="rounded-2xl bg-white border border-slate-200 p-6 space-y-5"
          data-testid="group-form"
        >
          {/* HEADER DO FORM */}
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">
              {editingGroup ? "Editar turma" : "Nova turma"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="p-2 rounded-lg hover:bg-slate-100"
              data-testid="group-cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* =================================================
              DADOS DA TURMA
          ================================================== */}

          <div className="grid md:grid-cols-3 gap-4">
            {/* NOME */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Nome da turma
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Sub-12 A · Turma 5ºB"
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                data-testid="group-name"
              />
            </div>

            {/* DESPORTO */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Desporto
              </label>
              <select
                value={form.sport}
                onChange={(e) => setForm({ ...form, sport: e.target.value })}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
                data-testid="group-sport"
              >
                <option value="">— Selecionar desporto —</option>
                {SPORTS.filter((s) => s !== "todos").map((sport) => (
                  <option key={sport} value={sport} className="capitalize">
                    {sport}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1.5">
                O desporto é definido pela turma.
              </p>
            </div>

            {/* SOFT SKILL */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Soft skill foco
              </label>
              <select
                value={form.focus_skill}
                onChange={(e) =>
                  setForm({ ...form, focus_skill: e.target.value })
                }
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
                data-testid="group-focus"
              >
                <option value="">— nenhuma —</option>
                {SOFT_SKILLS.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DESCRIÇÃO */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Descrição{" "}
              <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Descrição ou objetivo desta turma..."
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              data-testid="group-description"
            />
          </div>

          {/* =================================================
              ATLETAS
          ================================================== */}

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            {/* CABEÇALHO */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div>
                <div className="font-semibold text-slate-800 text-sm">
                  Adicionar atletas à turma
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Escolha os atletas que pretende adicionar a esta turma.
                </div>
              </div>
              <div className="text-xs text-slate-500">
                <span className="font-semibold text-cyan-700">
                  {form.athlete_ids.length}
                </span>{" "}
                selecionado(s) ·{" "}
                <span className="font-semibold text-slate-700">
                  {availableAthletes.length}
                </span>{" "}
                disponível(eis)
              </div>
            </div>

            {/* PESQUISA */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={athleteSearch}
                  onChange={(e) => setAthleteSearch(e.target.value)}
                  placeholder="Pesquisar atleta pelo nome..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  data-testid="group-athlete-search"
                />
                {athleteSearch && (
                  <button
                    type="button"
                    onClick={() => setAthleteSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label="Limpar pesquisa"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {athleteSearch && (
                <p className="text-xs text-slate-400 mt-1.5">
                  {filteredAthletes.length} resultado(s)
                </p>
              )}
            </div>

            {/* LISTA */}
            {athletes.length === 0 ? (
              <div className="text-sm text-slate-500 py-8 text-center">
                Ainda não existem atletas registados.
              </div>
            ) : availableAthletes.length === 0 ? (
              <div className="rounded-xl bg-white border border-dashed border-slate-300 p-8 text-center">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="mt-3 text-sm text-slate-600 font-medium">
                  Não existem atletas disponíveis.
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Os atletas que já pertencem a outra turma não podem ser
                  adicionados aqui.
                </p>
              </div>
            ) : filteredAthletes.length === 0 ? (
              <div className="rounded-xl bg-white border border-dashed border-slate-300 p-8 text-center">
                <Search className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="mt-3 text-sm text-slate-600 font-medium">
                  Nenhum atleta encontrado.
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Tenta pesquisar por outro nome.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-auto pr-1">
                {filteredAthletes.map((athlete) => {
                  const checked = form.athlete_ids.some(
                    (id) => String(id) === String(athlete.id)
                  );

                  return (
                    <label
                      key={athlete.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        checked
                          ? "bg-cyan-50 border-cyan-300 shadow-sm"
                          : "bg-white border-slate-200 hover:border-cyan-200 hover:shadow-sm"
                      }`}
                      data-testid={`group-athlete-${athlete.id}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAthlete(athlete.id)}
                        className="w-5 h-5 accent-cyan-600 cursor-pointer flex-shrink-0"
                      />

                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {athlete.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold truncate text-slate-800">
                          {athlete.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {athlete.age ?? "—"} anos
                        </div>
                      </div>

                      {checked && (
                        <Check className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                      )}

                      <Link
                        to={`/menu/atletas/${athlete.id}`}
                        state={{
                          from: "/menu/turmas",
                          groupId: editingGroup?.id,
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 text-slate-400 hover:text-cyan-600 transition"
                        title="Ver atleta"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* BOTÕES */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-full bg-slate-100 font-semibold hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold transition"
              data-testid="group-save"
            >
              {editingGroup ? "Guardar" : "Criar turma"}
            </button>
          </div>
        </form>
      )}

      {/* =====================================================
          LISTA DE TURMAS
      ====================================================== */}

      {groups.length === 0 && !showForm ? (
        <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-12 text-center">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="mt-3 text-slate-600">Ainda não criaste nenhuma turma.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => {
            const skill = group.focus_skill
              ? SKILL_MAP[group.focus_skill]
              : null;

            const groupAthletes = group.groupAthletes || [];

            return (
              <div
                key={group.id}
                className="rounded-2xl bg-white border border-slate-200 p-5 hover:-translate-y-0.5 hover:shadow-md transition"
                data-testid={`group-card-${group.id}`}
              >
                {/* HEADER */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold truncate">
                      {group.name}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                      {group.sport && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                          {group.sport}
                        </span>
                      )}
                      {skill && (
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold ${skill.soft}`}
                        >
                          {skill.name}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-semibold">
                        {group.atletasCount} atletas
                      </span>
                    </div>
                  </div>

                  {/* AÇÕES */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(group)}
                      className="p-2 text-slate-400 hover:text-cyan-600 transition"
                      data-testid={`edit-group-${group.id}`}
                      title="Editar turma"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteGroup(group)}
                      className="p-2 text-slate-400 hover:text-red-500 transition"
                      data-testid={`delete-group-${group.id}`}
                      title="Eliminar turma"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* DESCRIÇÃO */}
                {(group.description || group.notes) && (
                  <p className="mt-3 text-sm text-slate-600 line-clamp-2">
                    {group.description || group.notes}
                  </p>
                )}

                {/* ATLETAS */}
                {groupAthletes.length > 0 ? (
                  <div className="mt-4 flex items-center">
                    <div className="flex -space-x-2">
                      {groupAthletes.slice(0, 5).map((athlete) => (
                        <div
                          key={athlete.id}
                          title={athlete.name}
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 border-2 border-white flex items-center justify-center text-white font-bold text-xs"
                        >
                          {athlete.name?.charAt(0)?.toUpperCase()}
                        </div>
                      ))}
                    </div>
                    {groupAthletes.length > 5 && (
                      <div className="ml-2 text-xs font-semibold text-slate-600">
                        +{groupAthletes.length - 5}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-slate-400 italic">
                    Sem atletas associados
                  </p>
                )}

                {/* LINK — CORRIGIDO: group.id em vez de g.id */}
                <Link
                  to={`/menu/turmas/${group.id}`}
                  className="block mt-4 text-center text-sm font-semibold text-cyan-600 hover:text-cyan-700"
                >
                  Ver Turma →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}