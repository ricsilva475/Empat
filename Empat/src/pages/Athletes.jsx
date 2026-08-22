
import React, { useEffect, useState, useCallback } from "react";
import { SPORTS, SKILL_MAP } from "../js/constants";
import { Link } from "react-router-dom";
import { Plus, Trash2, User, Pencil, Check } from "lucide-react";
import { toast } from "react-toastify";
import '../css/App.css';
import { confirmToast } from "../components/DeleteToast";

import { Atletas } from "../js/athletes";
import { Avaliacoes } from "../js/avaliacoes";
import { Grupos} from "../js/groups";

export default function Athletes() {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", age: 12, sport: "futebol", team: "", position: "", notes: "", group_ids: []});
  const [atletasNum, setAtletasNum] = useState("");
  const [editingAthlete, setEditingAthlete] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [gruposPorAtleta, setGruposPorAtleta] = useState({});
  //const [numGrupos, setNumGrupos] = useState([0]);
  
  const loadAtletas = useCallback(async () => {
    try {
      const data = await Atletas.getAllData();
      const numAtletas = await Atletas.getAtletasCount();

      const gruposPorAtleta = {};

      await Promise.all(
        data.map(async (atleta) => {
          const grupoData = await Atletas.getGroupsByAthlete(atleta.id);

          gruposPorAtleta[atleta.id] = grupoData || [];
        })
      );
      console.log(gruposPorAtleta);
      setAtletasNum(numAtletas);
      setList(data);
      setGruposPorAtleta(gruposPorAtleta);


    } catch (e) {
      console.error(e);
    }
  }, []);

  const selectGroup = (id) => {
    setForm(prev => ({
      ...prev,
      group_id: prev.group_id === id ? null : id
    }));
  };

  const loadAvaliacoes = useCallback(async () => {
    try {
      const data = await Avaliacoes.getAllData();
      setList(l =>
        l.map(a => ({
          ...a,
          skills: data
            .filter(av => av.athlete_id === a.id)
            .reduce((acc, av) => {
              for (const skill of Object.keys(SKILL_MAP)) {
                acc[skill] = Math.max(acc[skill] || 0, av[skill] || 0);
              }
              return acc;
            }, {})
        }))
      );
    } catch (e) {
      console.error(e);
    }
  }, []);

  /*const loadGrupo = useCallback(async (atletas) => {
    try {
      const counts = {};

      await Promise.all(
        atletas.map(async (atleta) => {
          const groupIds = await Atletas.getGroupsByAthlete(atleta.id);
          counts[atleta.id] = groupIds.length;
        })
      );

      setNumGrupos(counts);
    } catch (e) {
      console.error(e);
    }
  }, []);*/

  useEffect(() => {

    async function loadAll() {
      await loadAtletas();
      await loadAvaliacoes();
      await loadGrupos();
    }
    loadAll();

  }, [loadAtletas, loadAvaliacoes]);

  const startEdit = async (athlete) => {

    const groupIds = await Atletas.getGroupsByAthlete(athlete.id);

    setEditingAthlete(athlete);

    setForm({
      name: athlete.name,
      age: athlete.age,
      sport: athlete.sport,
      team: athlete.team,
      position: athlete.position,
      notes: athlete.notes,
      group_ids: groupIds.map(grupo => grupo.id)
    });

    setShowForm(true);
  };

  const toggleGroup = (id) => {
    setForm(prev => ({
      ...prev,
      group_ids: prev.group_ids.includes(id) ? [] : [id]
    }));
  };

  const loadGrupos = useCallback(async () => {
      const data = await Grupos.getAllData();
      setGrupos(data);
  }, []);

  const deleteAtleta = async (id) => {
    try {
      confirmToast("Eliminar atleta?", async () => {
      await Atletas.delete(id);

      // Atualiza a lista
      setList(list.filter(a => a.id !== id));
      toast.success("Atleta eliminado com sucesso!");
    });
    
  } catch (e) {
      console.error(e);
      toast.error("Erro ao eliminar atleta!");
    }
  };

  const submit = async (e) => {
  e.preventDefault();

  try {

    if (editingAthlete) {

      await Atletas.update(editingAthlete.id, {
        ...form,
        age: parseInt(form.age),
      });

      toast.success("Atleta atualizado com sucesso!");

    } else {

      await Atletas.insert({
        ...form,
        age: parseInt(form.age),
      });

      toast.success("Atleta criado com sucesso!");
    }
    setForm({
      name: "",
      age: 12,
      sport: "futebol",
      team: "",
      position: "",
      notes: "",
      group_ids: []
    });

    setEditingAthlete(null);
    setShowForm(false);

     await loadAtletas();

  } catch (e) {
    console.error(e);
    toast.error("Erro ao guardar atleta");
  }
};

  const startNewGroup = () => {
      setForm({
        name: "",
        age: 12,
        sport: "futebol",
        team: "",
        position: "",
        notes: "",
        group_ids: []
      });

      setEditingAthlete(null);
      setShowForm(true);
    };
  return (
    <div className="space-y-6" data-testid="athletes-page">
      <div id="atleta-header" className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tighter">Atletas</h1>
          <p className="text-slate-500 mt-1">{atletasNum} no total</p>
        </div>
        <button id="btn-new-athlete" onClick={startNewGroup} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition btn-hover-orange" data-testid="add-athlete-btn">
          <Plus className="w-4 h-4" /> Novo atleta
        </button>
      </div>

      {showForm && (
        <form id="athlete-form" onSubmit={submit} className="rounded-2xl bg-white border border-slate-200 p-6 grid md:grid-cols-2 gap-4" data-testid="athlete-form">
          <div>
            <label className="text-sm font-medium text-slate-700">Nome</label>
            <input id="athlete-name" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200" data-testid="athlete-name"/>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Idade</label>
            <input id="athlete-age" type="number" min={5} max={35} required value={form.age} onChange={e=>setForm({...form,age:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200" data-testid="athlete-age"/>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Desporto</label>
            <select id="athlete-sport" value={form.sport} onChange={e=>setForm({...form,sport:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white" data-testid="athlete-sport">
              {SPORTS.filter(s=>s!== "todos").map(s=><option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Equipa</label>
            <input id="athlete-team" value={form.team} onChange={e=>setForm({...form,team:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200" placeholder="Sub-12 A" data-testid="athlete-team"/>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Posição (opcional)</label>
            <input id="athlete-position" value={form.position} onChange={e=>setForm({...form,position:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200" data-testid="athlete-position"/>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Notas</label>
            <textarea id="athlete-notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={2} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200" data-testid="athlete-notes"/>
          </div>
          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-slate-800 text-sm">
                Turmas do atleta
              </div>

              <div className="text-xs text-slate-500">
                {form.group_ids.length > 0 ? "1 selecionada" : "Nenhuma selecionada"} ·{" "}
                {grupos.filter(grupo => grupo.sport === form.sport).length} disponíveis
              </div>
            </div>

            {grupos.length === 0 ? (
              <div className="text-sm text-slate-500 py-6 text-center">
                Ainda não existem turmas.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-auto pr-1">
                {grupos
                .filter(grupo => grupo.sport === form.sport)
                .map(grupo => {
                  const checked = form.group_ids.includes(grupo.id);

                  return (
                    <label
                      key={grupo.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        checked
                          ? "bg-cyan-50 border-cyan-300"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleGroup(grupo.id)}
                        className="w-4 h-4 accent-cyan-600"
                      />

                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                        {grupo.name[0]}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold truncate">
                          {grupo.name}
                        </div>

                        <div className="text-xs text-slate-500 capitalize truncate">
                          {grupo.sport}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
          <div className="md:col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={()=>setShowForm(false)} className="px-5 py-2.5 rounded-full bg-slate-100 font-semibold btn-hover-yellow">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold btn-hover-green" data-testid="athlete-save">{editingAthlete ? "Atualizar" : "Guardar"}</button>
          </div>
        </form>
      )}

      {list.length === 0 ? (
        <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-12 text-center">
          <User className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="mt-4 text-slate-600">Ainda não tens atletas registados.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(a => (
            <div key={a.id} className="rounded-2xl bg-white border border-slate-200 p-5 hover:-translate-y-0.5 transition" data-testid={`athlete-card-${a.id}`}>
              <div className="flex items-start justify-between">
                <Link to={`/menu/atletas/${a.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">{a.name[0]?.toUpperCase()}</div>
                  <div className="min-w-0">
                    <div className="font-display font-bold truncate">{a.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{a.sport} · {a.age} anos · {gruposPorAtleta[a.id]?.[0]?.name || "Sem equipa"}
                  </div>
                  </div>
                </Link>
                <button onClick={() => startEdit(a)} className="p-2 text-slate-400 hover:text-cyan-600" data-testid={`edit-athlete-${a.id}`}><Pencil className="w-4 h-4" /></button>
                <button onClick={() => deleteAtleta(a.id)} className="p-2 text-slate-400 hover:text-red-500" data-testid={`delete-athlete-${a.id}`}><Trash2 className="w-4 h-4"/></button>
              </div>
              <Link to={`/menu/atletas/${a.id}`} className="block mt-4 text-center text-sm font-semibold text-cyan-600 hover:text-cyan-700">Ver perfil →</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
