import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, User, Pencil, Check, Users, Eye } from "lucide-react";
import { toast } from "react-toastify";
import "../css/App.css";
import { Atletas } from "../js/athletes";
import { Avaliacoes } from "../js/avaliacoes";
import { Grupos } from "../js/groups";
import { SKILL_MAP } from "../js/constants";

// ============================================================
// CACHE
// ============================================================

// No topo do Athletes.jsx, junto às CACHE_KEYS
const GROUPS_CACHE_KEYS = {
  GROUPS: "cache_groups_v2",
  ATHLETES: "cache_groups_athletes_v2",
  ATHLETE_GROUPS: "cache_groups_athlete_groups_v2",
  TIMESTAMP: "cache_groups_timestamp_v2",
};

// Função helper
const invalidateGroupsCache = () => {
  Object.values(GROUPS_CACHE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};

const CACHE_KEYS = {
  ATHLETES: "cache_athletes_list_v2",
  ATHLETES_NUM: "cache_athletes_num_v2",
  GRUPOS: "cache_grupos_list_v2",
  GRUPOS_POR_ATLETA: "cache_grupos_por_atleta_v2",
  TIMESTAMP: "cache_athletes_timestamp_v2",
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// ============================================================
// COMPONENT
// ============================================================

export default function Athletes() {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: 12,
    position: "",
    notes: "",
    group_ids: [],
  });

  const [atletasNum, setAtletasNum] = useState(0);
  const [editingAthlete, setEditingAthlete] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [gruposPorAtleta, setGruposPorAtleta] = useState({});
  const [loading, setLoading] = useState(true);

  const [changeGroupModal, setChangeGroupModal] = useState({
    open: false,
    groupId: null,
    currentGroupName: "",
    newGroupName: "",
  });

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    athleteId: null,
    athleteName: "",
  });

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
      const cachedAthletes = localStorage.getItem(CACHE_KEYS.ATHLETES);
      const cachedAtletasNum = localStorage.getItem(CACHE_KEYS.ATHLETES_NUM);
      const cachedGrupos = localStorage.getItem(CACHE_KEYS.GRUPOS);
      const cachedGruposPorAtleta = localStorage.getItem(
        CACHE_KEYS.GRUPOS_POR_ATLETA
      );

      if (
        cachedAthletes &&
        cachedAtletasNum &&
        cachedGrupos &&
        cachedGruposPorAtleta
      ) {
        setList(JSON.parse(cachedAthletes));
        setAtletasNum(JSON.parse(cachedAtletasNum));
        setGrupos(JSON.parse(cachedGrupos));
        setGruposPorAtleta(JSON.parse(cachedGruposPorAtleta));
        return true;
      }
      return false;
    } catch (e) {
      console.error("Erro ao carregar cache:", e);
      return false;
    }
  }, []);

  const saveToCache = useCallback(
    (athletesData, atletasNumData, gruposData, gruposPorAtletaData) => {
      try {
        localStorage.setItem(CACHE_KEYS.ATHLETES, JSON.stringify(athletesData));
        localStorage.setItem(
          CACHE_KEYS.ATHLETES_NUM,
          JSON.stringify(atletasNumData)
        );
        localStorage.setItem(CACHE_KEYS.GRUPOS, JSON.stringify(gruposData));
        localStorage.setItem(
          CACHE_KEYS.GRUPOS_POR_ATLETA,
          JSON.stringify(gruposPorAtletaData)
        );
        localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
      } catch (e) {
        console.error("Erro ao guardar cache:", e);
      }
    },
    []
  );

  // ==========================================================
  // CARREGAR ATLETAS
  // ==========================================================

  const loadAtletas = useCallback(async () => {
    try {
      const data = await Atletas.getAllData();
      const numAtletas = await Atletas.getAtletasCount();
      const gruposPorAtleta = {};

      await Promise.all(
        data.map(async (atleta) => {
          try {
            const grupoData = await Atletas.getGroupsByAthlete(atleta.id);
            gruposPorAtleta[atleta.id] = grupoData || [];
          } catch (error) {
            console.error(
              `Erro ao carregar turma do atleta ${atleta.id}:`,
              error
            );
            gruposPorAtleta[atleta.id] = [];
          }
        })
      );

      return { data, gruposPorAtleta, numAtletas };
    } catch (e) {
      console.error("Erro ao carregar atletas:", e);
      return null;
    }
  }, []);

  // ==========================================================
  // CARREGAR AVALIAÇÕES
  // ==========================================================

  const loadAvaliacoes = useCallback(async (athletesList) => {
    try {
      const data = await Avaliacoes.getAllData();

      const updatedList = athletesList.map((athlete) => {
        const athleteEvaluations = data.filter(
          (av) => String(av.athlete_id) === String(athlete.id)
        );

        const skills = athleteEvaluations.reduce((acc, av) => {
          for (const skill of Object.keys(SKILL_MAP)) {
            acc[skill] = Math.max(acc[skill] || 0, av[skill] || 0);
          }
          return acc;
        }, {});

        return { ...athlete, skills };
      });

      return updatedList;
    } catch (e) {
      console.error("Erro ao carregar avaliações:", e);
      return athletesList;
    }
  }, []);

  // ==========================================================
  // CARREGAR TURMAS
  // ==========================================================

  const loadGrupos = useCallback(async () => {
    try {
      const data = await Grupos.getAllData();
      return data || [];
    } catch (e) {
      console.error("Erro ao carregar turmas:", e);
      return [];
    }
  }, []);

  // ==========================================================
  // REFRESH COMPLETO
  // ==========================================================

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);

      // Turmas
      const gruposData = await loadGrupos();
      setGrupos(gruposData);

      // Atletas
      const athletesResult = await loadAtletas();

      if (!athletesResult) {
        setList([]);
        setAtletasNum(0);
        setGruposPorAtleta({});
        return;
      }

      // Avaliações
      const athletesWithSkills = await loadAvaliacoes(athletesResult.data);

      setList(athletesWithSkills);
      setAtletasNum(athletesResult.numAtletas);
      setGruposPorAtleta(athletesResult.gruposPorAtleta);

      // Cache
      saveToCache(
        athletesWithSkills,
        athletesResult.numAtletas,
        gruposData,
        athletesResult.gruposPorAtleta
      );
    } catch (e) {
      console.error("Erro no refresh:", e);
      toast.error("Erro ao carregar os atletas.");
    } finally {
      setLoading(false);
    }
  }, [loadAtletas, loadAvaliacoes, loadGrupos, saveToCache]);

  // ==========================================================
  // CARREGAMENTO INICIAL
  // ==========================================================

  useEffect(() => {
    async function loadAll() {
      if (isCacheValid()) {
        const loaded = loadFromCache();
        if (loaded) {
          setLoading(false);
          return;
        }
      }
      await refreshData();
    }
    loadAll();
  }, [isCacheValid, loadFromCache, refreshData]);

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setForm({
      name: "",
      age: 12,
      position: "",
      notes: "",
      group_ids: [],
    });
    setEditingAthlete(null);
    setShowForm(false);
  };

  // ==========================================================
  // NOVO ATLETA
  // ==========================================================

  const startNewAthlete = async () => {
    try {
      const gruposData = await loadGrupos();
      setGrupos(gruposData);

      setForm({
        name: "",
        age: 12,
        position: "",
        notes: "",
        group_ids: [],
      });

      setEditingAthlete(null);
      setShowForm(true);
    } catch (e) {
      console.error("Erro ao carregar turmas:", e);
      toast.error("Não foi possível carregar as turmas.");
    }
  };

  // ==========================================================
  // EDITAR ATLETA
  // ==========================================================

  const startEdit = async (athlete) => {
    try {
      const gruposData = await loadGrupos();
      setGrupos(gruposData);

      const groupData = await Atletas.getGroupsByAthlete(athlete.id);

      const groupIds = (groupData || [])
        .map((group) => (typeof group === "object" ? group?.id : group))
        .filter(Boolean);

      setEditingAthlete(athlete);

      setForm({
        name: athlete.name || "",
        age: athlete.age || 12,
        position: athlete.position || "",
        notes: athlete.notes || "",
        group_ids: groupIds,
      });

      setShowForm(true);
    } catch (e) {
      console.error("Erro ao editar atleta:", e);
      toast.error("Não foi possível carregar os dados do atleta.");
    }
  };

  // ==========================================================
  // SELECIONAR TURMA
  // ==========================================================

  const toggleGroup = (id) => {
    const currentGroupId = form.group_ids?.[0] || null;

    if (String(currentGroupId) === String(id)) {
      setForm((prev) => ({ ...prev, group_ids: [] }));
      return;
    }

    if (currentGroupId && String(currentGroupId) !== String(id)) {
      const newGroup = grupos.find((g) => String(g.id) === String(id));
      const currentGroup = grupos.find(
        (g) => String(g.id) === String(currentGroupId)
      );

      setChangeGroupModal({
        open: true,
        groupId: id,
        currentGroupName: currentGroup?.name || "turma atual",
        newGroupName: newGroup?.name || "nova turma",
      });
      return;
    }

    setForm((prev) => ({ ...prev, group_ids: [id] }));
  };

  const cancelChangeGroup = () => {
    setChangeGroupModal({
      open: false,
      groupId: null,
      currentGroupName: "",
      newGroupName: "",
    });
  };

  const confirmChangeGroup = () => {
    const newGroupId = changeGroupModal.groupId;
    setForm((prev) => ({ ...prev, group_ids: [newGroupId] }));
    cancelChangeGroup();
  };

  // ==========================================================
  // ELIMINAR ATLETA
  // ==========================================================

  const deleteAtleta = (athlete) => {
    setDeleteModal({
      open: true,
      athleteId: athlete.id,
      athleteName: athlete.name,
    });
  };

  const cancelDeleteAthlete = () => {
    setDeleteModal({ open: false, athleteId: null, athleteName: "" });
  };

  const confirmDeleteAthlete = async () => {
    try {
      await Atletas.delete(deleteModal.athleteId);
      await refreshData();
      toast.success("Atleta eliminado com sucesso!");
      cancelDeleteAthlete();
    } catch (e) {
      console.error("Erro ao eliminar atleta:", e);
      toast.error(e?.message || "Erro ao eliminar atleta!");
    }
  };

  // ==========================================================
  // GUARDAR ATLETA
  // ==========================================================

  const submit = async (e) => {
    e.preventDefault();

    // Validações
    if (!form.name.trim()) {
      toast.error("Indica o nome do atleta.");
      return;
    }

    if (!form.age || Number(form.age) < 5 || Number(form.age) > 35) {
      toast.error("Indica uma idade válida entre 5 e 35 anos.");
      return;
    }

    try {
      const data = {
        name: form.name.trim(),
        age: parseInt(form.age, 10),
        position: form.position?.trim() || null,
        notes: form.notes?.trim() || null,
        group_ids: form.group_ids || [],
      };

      if (editingAthlete) {
        await Atletas.update(editingAthlete.id, data);
        toast.success("Atleta atualizado com sucesso!");
      } else {
        await Atletas.insert(data);
        toast.success("Atleta criado com sucesso!");
      }

      await refreshData();
      resetForm();
    } catch (e) {
      console.error("Erro ao guardar atleta:", e);
      toast.error(e?.message || "Erro ao guardar atleta.");
    }
  };

  // ==========================================================
  // HELPERS
  // ==========================================================

  const getAthleteGroups = (athleteId) => {
    return gruposPorAtleta[athleteId] || [];
  };

  const normalizeGroup = (group) => {
    if (!group) return null;
    if (typeof group === "object") return group;
    return grupos.find((g) => String(g.id) === String(group)) || null;
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto" />
          <p className="mt-4 text-slate-600">A carregar atletas...</p>
        </div>
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6" data-testid="athletes-page">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        id="atleta-header"
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tighter">
            Atletas
          </h1>
          <p className="text-slate-500 mt-1">
            {atletasNum} {atletasNum === 1 ? "atleta" : "atletas"} no total
          </p>
        </div>

        {/* MODAL: ALTERAR TURMA */}
        {changeGroupModal.open && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 p-6">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Users className="w-7 h-7" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 text-center">
                Alterar turma?
              </h2>

              <p className="mt-3 text-sm text-slate-600 text-center leading-relaxed">
                Este aluno está atualmente associado à turma{" "}
                <span className="font-semibold text-slate-800">
                  "{changeGroupModal.currentGroupName}"
                </span>
                .
              </p>

              <p className="mt-2 text-sm text-slate-600 text-center leading-relaxed">
                Tem a certeza de que pretende alterar a turma para{" "}
                <span className="font-semibold text-cyan-700">
                  "{changeGroupModal.newGroupName}"
                </span>
                ?
              </p>

              <p className="mt-3 text-xs text-slate-400 text-center">
                Um aluno só pode estar associado a uma turma.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={cancelChangeGroup}
                  className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={confirmChangeGroup}
                  className="flex-1 px-4 py-2.5 rounded-full bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition"
                >
                  Alterar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ELIMINAR ATLETA */}
        {deleteModal.open && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 p-6">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <Trash2 className="w-7 h-7" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 text-center">
                Eliminar atleta?
              </h2>

              <p className="mt-3 text-sm text-slate-600 text-center leading-relaxed">
                Tem a certeza de que pretende eliminar o atleta{" "}
                <span className="font-semibold text-slate-800">
                  "{deleteModal.athleteName}"
                </span>
                ?
              </p>

              <p className="mt-3 text-xs text-slate-400 text-center">
                O atleta deixará de aparecer na lista de atletas.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={cancelDeleteAthlete}
                  className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteAthlete}
                  className="flex-1 px-4 py-2.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {!showForm && (
          <button
            id="btn-new-athlete"
            onClick={startNewAthlete}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition btn-hover-orange"
            data-testid="add-athlete-btn"
          >
            <Plus className="w-4 h-4" />
            Novo atleta
          </button>
        )}
      </div>

      {/* =====================================================
          FORMULÁRIO
      ====================================================== */}

      {showForm && (
        <form
          id="athlete-form"
          onSubmit={submit}
          className="rounded-2xl bg-white border border-slate-200 p-6 grid md:grid-cols-2 gap-4"
          data-testid="athlete-form"
        >
          {/* TÍTULO */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-bold">
                  {editingAthlete ? "Editar atleta" : "Novo atleta"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {editingAthlete
                    ? "Atualiza os dados do atleta."
                    : "Adiciona um novo atleta ao teu grupo."}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                {editingAthlete ? (
                  <Pencil className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
            </div>
          </div>

          {/* NOME */}
          <div>
            <label className="text-sm font-medium text-slate-700">Nome</label>
            <input
              id="athlete-name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Nome do atleta"
              data-testid="athlete-name"
            />
          </div>

          {/* IDADE */}
          <div>
            <label className="text-sm font-medium text-slate-700">Idade</label>
            <input
              id="athlete-age"
              type="number"
              min={5}
              max={35}
              required
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              data-testid="athlete-age"
            />
          </div>

          {/* POSIÇÃO */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Posição
              <span className="text-slate-400 font-normal"> (opcional)</span>
            </label>
            <input
              id="athlete-position"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ex.: Defesa, Guarda-redes..."
              data-testid="athlete-position"
            />
          </div>

          {/* NOTAS */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Notas
              <span className="text-slate-400 font-normal"> (opcional)</span>
            </label>
            <input
              id="athlete-notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Notas sobre o atleta"
              data-testid="athlete-notes"
            />
          </div>

          {/* =================================================
              TURMA
          ================================================== */}

          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-1">
              <div>
                <div className="flex items-center gap-2 font-semibold text-slate-800 text-sm">
                  <Users className="w-4 h-4 text-cyan-600" />
                  Turma do atleta
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  O desporto do atleta é definido pela turma.
                </p>
              </div>
              <div className="text-xs text-slate-500">
                {form.group_ids.length > 0
                  ? "1 turma selecionada"
                  : "Nenhuma turma selecionada"}
                {" · "}
                {grupos.length} disponíveis
              </div>
            </div>

            {grupos.length === 0 ? (
              <div className="text-sm text-slate-500 py-8 text-center bg-white rounded-xl border border-dashed border-slate-300">
                <Users className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p>Ainda não existem turmas.</p>
                <p className="text-xs mt-1">
                  Cria primeiro uma turma em Turmas.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-auto pr-1">
                {grupos.map((grupo) => {
                  const checked = form.group_ids.includes(grupo.id);

                  return (
                    <label
                      key={grupo.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        checked
                          ? "bg-cyan-50 border-cyan-300 shadow-sm"
                          : "bg-white border-slate-200 hover:border-cyan-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleGroup(grupo.id)}
                        className="w-5 h-5 accent-cyan-600 cursor-pointer shrink-0"
                      />

                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {grupo.name?.[0]?.toUpperCase() || "T"}
                      </div>

                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="text-sm font-semibold truncate">
                          {grupo.name}
                        </div>
                        <div className="text-xs text-slate-500 capitalize truncate">
                          {grupo.sport || "Desporto não definido"}
                        </div>
                      </div>

                      {checked && (
                        <Check className="w-4 h-4 text-cyan-600 shrink-0" />
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* BOTÕES */}
          <div className="md:col-span-2 flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 rounded-full bg-slate-100 font-semibold hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold btn-hover-green transition"
              data-testid="athlete-save"
            >
              {editingAthlete ? "Atualizar" : "Guardar"}
            </button>
          </div>
        </form>
      )}

      {/* =====================================================
          LISTA VAZIA
      ====================================================== */}

      {list.length === 0 && !showForm ? (
        <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-12 text-center">
          <User className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="mt-3 text-slate-500">Ainda não existem atletas.</p>
          <button
            onClick={startNewAthlete}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar atleta
          </button>
        </div>
      ) : (
        /* ===================================================
           CARDS DOS ATLETAS
        ==================================================== */

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((athlete) => {
            const athleteGroups = getAthleteGroups(athlete.id);
            const normalizedGroups = athleteGroups
              .map(normalizeGroup)
              .filter(Boolean);
            const group = normalizedGroups[0];

            return (
              <div
                key={athlete.id}
                className="rounded-2xl bg-white border border-slate-200 p-5 hover:-translate-y-0.5 hover:shadow-md transition-all"
                data-testid={`athlete-card-${athlete.id}`}
              >
                {/* HEADER CARD */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {athlete.name?.[0]?.toUpperCase() || "A"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold truncate">
                        {athlete.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {athlete.age} anos
                        {athlete.position && <> · {athlete.position}</>}
                      </p>
                    </div>
                  </div>

                  {/* AÇÕES */}
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/menu/atletas/${athlete.id}`}
                      className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
                      title="Ver atleta"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => startEdit(athlete)}
                      className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
                      title="Editar atleta"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAtleta(athlete)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar atleta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* TURMA */}
                <div className="mt-4">
                  {group ? (
                    <div className="flex items-center gap-3 rounded-xl bg-cyan-50 border border-cyan-100 px-3 py-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-cyan-600 font-bold text-xs shadow-sm">
                        {group.name?.[0]?.toUpperCase() || "T"}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-cyan-900 truncate">
                          {group.name}
                        </div>
                        <div className="text-xs text-cyan-700 capitalize">
                          {group.sport || "Desporto não definido"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5 text-sm text-slate-500">
                      <Users className="w-4 h-4" />
                      Sem turma atribuída
                    </div>
                  )}
                </div>

                {/* NOTAS */}
                {athlete.notes && (
                  <p className="mt-3 text-sm text-slate-500 line-clamp-2">
                    {athlete.notes}
                  </p>
                )}

                {/* SOFT SKILLS */}
                {athlete.skills &&
                  Object.keys(athlete.skills).length > 0 && (
                    <div className="mt-4">
                      <div className="text-xs font-semibold text-slate-500 mb-2">
                        Soft skills
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(athlete.skills)
                          .filter(([, value]) => value > 0)
                          .slice(0, 5)
                          .map(([skill, value]) => {
                            const skillInfo = SKILL_MAP[skill];
                            return (
                              <span
                                key={skill}
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  skillInfo?.soft ||
                                  "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {skillInfo?.name || skill}{" "}
                                {Number(value).toFixed(1)}
                              </span>
                            );
                          })}
                      </div>
                    </div>
                  )}

                {/* FOOTER */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {group ? "Turma atribuída" : "Sem turma"}
                  </span>
                  <Link
                    to={`/menu/atletas/${athlete.id}`}
                    className="text-xs font-semibold text-cyan-600 hover:text-cyan-700"
                  >
                    Ver perfil →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}