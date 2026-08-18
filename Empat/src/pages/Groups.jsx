import React, { useEffect, useState } from "react";
import { SOFT_SKILLS, SKILL_MAP, SPORTS } from "../js/constants";
import { Plus, Trash2, Users, Save, X, Pencil, Check, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Atletas } from "../js/athletes";
import { Grupos } from "../js/groups";

import { toast } from "react-toastify";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null); // group object or null
  const [form, setForm] = useState({ name: "", sport: "", focus_skill: "", description: "", athlete_ids: [] });
  const [athleteGroups, setAthleteGroups] = useState([]);


  useEffect(() => {
  async function loadData() {
    try {
      const athletesData = await Atletas.getAllData();
      setAthletes(athletesData);

      const athleteGroupsData = await Grupos.getAthletesWithGroups();
      setAthleteGroups(athleteGroupsData);

      const groupsData = await Grupos.getAllData();

      const groupsWithCount = await Promise.all(
        groupsData.map(async (group) => {

          const athleteIds = await Grupos.getAthletesByGroup(group.id);

          const groupAthletes = athletesData
            .filter(a => athleteIds.includes(a.id))
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

          return {
            ...group,
            atletasCount: groupAthletes.length,
            groupAthletes
          };
        })
      );

      setGroups(groupsWithCount);

    } catch(e) {
      console.error(e);
    }
  }

  loadData();
}, []);

  const resetForm = () => {
    setForm({ name: "", sport: "", focus_skill: "", description: "", athlete_ids: [] });
    setEditingGroup(null);
    setShowForm(false);
  };

  const toggleAthlete = (id) => {
    setForm(p => ({
      ...p,
      athlete_ids: p.athlete_ids.includes(id)
        ? p.athlete_ids.filter(x => x !== id)
        : [...p.athlete_ids, id],
    }));
  };

  const startEdit = async (group) => {
    setEditingGroup(group);

    const athleteIds = await Grupos.getAthletesByGroup(group.id);

    setForm({
      name: group.name,
      sport: group.sport,
      focus_skill: group.focus_skill,
      description: group.notes || "",
      athlete_ids: athleteIds,

    });

    setShowForm(true);
  };
  

  const deleteGrupo = async (id) => {
  try {
    await Grupos.delete(id);

    //const data = await Grupos.getAllData();
    const updatedAthleteGroups = await Grupos.getAthletesWithGroups();
    setAthleteGroups(updatedAthleteGroups);
    loadGroups();
    toast.success("Grupo eliminado com sucesso!");

  } catch (e) {
    console.error(e);
    toast.error("Erro ao eliminar grupo!");
  }
};
const loadGroups = async () => {
  const data = await Grupos.getAllData();

   const groupsWithCount = await Promise.all(
    data.map(async (group) => {
      const athleteIds = await Grupos.getAthletesByGroup(group.id);

      const groupAthletes = athletes
        .filter(a => athleteIds.includes(a.id))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return {
        ...group,
        atletasCount: groupAthletes.length,
        groupAthletes
      };
    })
  );

  setGroups(groupsWithCount);
};

  const submit = async (e) => {
      e.preventDefault();

      if (!form.name.trim()) {
        toast.error("Indica o nome da turma");
        return;
      }

      try {
        if (editingGroup) {
          await Grupos.update(editingGroup.id, form);
          toast.success("Grupo editado com sucesso!");
        } else {
          await Grupos.insert(form);
          toast.success("Grupo criado com sucesso!");
        }

        //const data = await Grupos.getAllData();

        const updatedAthleteGroups = await Grupos.getAthletesWithGroups();
        setAthleteGroups(updatedAthleteGroups);
        loadGroups();

        resetForm();

      } catch (e) {
        console.error("ERRO AO GUARDAR GRUPO:", e);
        toast.error("Erro ao guardar grupo");
      }
  };

  const availableAthletes = athletes.filter((athlete) => {

    // Só atletas do desporto selecionado
    if (athlete.sport !== form.sport) {
      return false;
    }

    // Procurar se este atleta pertence a alguma turma ativa
    const athleteGroup = athleteGroups.find(
      ag => String(ag.athlete_id) === String(athlete.id)
    );

    // Não pertence a nenhuma turma
    if (!athleteGroup) {
      return true;
    }

    // Se estamos a editar, permitir os atletas
    // que já pertencem à própria turma
    if (
      editingGroup &&
      String(athleteGroup.group_id) === String(editingGroup.id)
    ) {
      return true;
    }

    // Pertence a outra turma → esconder
    return false;
  });

  const startNewGroup = () => {
    setForm({
      name: "",
      sport: "",
      focus_skill: "",
      description: "",
      athlete_ids: []
    });

    setEditingGroup(null);
    setShowForm(true);
  };

 
  return (
    <div className="space-y-6" data-testid="groups-page">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tighter">Turmas de atletas</h1>
          <p className="text-slate-500 mt-1">Organiza turmas e equipas para facilitar o acompanhamento.</p>
        </div>
        {!showForm && (
          <button onClick={startNewGroup} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 btn-hover-orange transition" data-testid="add-group-btn">
            <Plus className="w-4 h-4" /> Nova turma
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={submit} className="rounded-2xl bg-white border border-slate-200 p-6 space-y-5" data-testid="group-form">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">{editingGroup ? "Editar turma" : "Nova turma"}</h2>
            <button type="button" onClick={resetForm} className="p-2 rounded-lg hover:bg-slate-100" data-testid="group-cancel">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-slate-700">Nome da turma</label>
              <input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})}
                placeholder="Sub-12 A · Turma 5ºB"
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                data-testid="group-name" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Desporto</label>
              <select value={form.sport} onChange={e=>setForm({...form, sport: e.target.value})}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white" data-testid="group-sport">
                <option value="">— qualquer —</option>
                {SPORTS.filter(s => s !== "todos").map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Soft skill foco</label>
              <select value={form.focus_skill} onChange={e=>setForm({...form, focus_skill: e.target.value})}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white" data-testid="group-focus">
                <option value="">— nenhuma —</option>
                {SOFT_SKILLS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Descrição (opcional)</label>
            <textarea rows={2} value={form.description} onChange={e=>setForm({...form, description: e.target.value})}
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
              data-testid="group-description" />
          </div>

          {/* Lista de atletas com checkboxes — estilo Avaliações */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-slate-800 text-sm">Adicionar atletas à turma:</div>
              <div className="text-xs text-slate-500">{form.athlete_ids.length} selecionado(s) · {athletes.length} disponíveis</div>
            </div>
            {!form.sport ? (
                <div className="text-sm text-slate-500 py-6 text-center">
                  Seleciona primeiro o desporto da turma para veres os atletas disponíveis.
                </div>
              ) : availableAthletes.length === 0 ? (
                <div className="text-sm text-slate-500 py-6 text-center">
                  Não existem atletas disponíveis para este desporto.
                </div>
              ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-auto pr-1">
                {availableAthletes.map(a => {
                  const checked = form.athlete_ids.includes(a.id);
                  return (
                    <label key={a.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        checked ? "bg-cyan-50 border-cyan-300" : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                      data-testid={`group-athlete-${a.id}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleAthlete(a.id)} className="w-4 h-4 accent-cyan-600" />
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                        {a.name[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold truncate">{a.name}</div>
                        <div className="text-xs text-slate-500 capitalize truncate">{a.sport} · {a.age} anos</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/menu/atletas/${a.id}`}
                          state={{
                            from: "/menu/turmas",
                            groupId: editingGroup?.id
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 font-semibold btn-hover-yellow transition">Cancelar</button>
            <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold btn-hover-green transition" data-testid="group-save">
              {editingGroup ? "Guardar alterações" : "Criar turma"}
            </button>
          </div>
        </form>
      )}

      {groups.length === 0 && !showForm ? (
        <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-12 text-center">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="mt-3 text-slate-600">Ainda não criaste nenhuma turma.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(g => {
            const sk = g.focus_skill ? SKILL_MAP[g.focus_skill] : null;
            const groupAthletes = g.groupAthletes || [];
            return (
              <div key={g.id} className="rounded-2xl bg-white border border-slate-200 p-5 hover:-translate-y-0.5 transition" data-testid={`group-card-${g.id}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold truncate">{g.name}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                      {g.sport && <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">{g.sport}</span>}
                      {sk && <span className={`px-2 py-0.5 rounded-full font-bold ${sk.soft}`}>{sk.name}</span>}
                      <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-semibold">{g.atletasCount} atletas</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => startEdit(g)} className="p-2 text-slate-400 hover:text-cyan-600" data-testid={`edit-group-${g.id}`}><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteGrupo(g.id)} className="p-2 text-slate-400 hover:text-red-500" data-testid={`delete-group-${g.id}`}><Trash2 className="w-4 h-4" /></button>
                    
                    
      
                  </div>
                </div>

                {g.description && <p className="mt-3 text-sm text-slate-600 line-clamp-2">{g.description}</p>}

                {groupAthletes.length > 0 ? (
                  <div className="mt-4 flex items-center">
                    
                    <div className="flex -space-x-2">
                      {groupAthletes.slice(0, 5).map(a => (
                        <div
                          key={a.id}
                          title={a.name}
                          className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 border-2 border-white flex items-center justify-center text-white font-bold text-xs"
                        >
                          {a.name[0]?.toUpperCase()}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}