import React, { useEffect, useState } from "react";
import { SOFT_SKILLS, SKILL_MAP, SPORTS } from "../js/constants";
import { Plus, Trash2, Users, Save, X, Pencil, Check } from "lucide-react";

import { Atletas } from "../js/athletes";
import { Grupos } from "../js/groups";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // group object or null
  const [form, setForm] = useState({ name: "", sport: "", focus_skill: "", description: "", athlete_ids: [] });

  useEffect(() => {
      
      async function AtletasData() {
        try {
          const data = await Atletas.getAllData();
          setAthletes(data);
        } catch (e) {
          console.error(e);
        }
      }
      AtletasData();

      async function GruposData() {
        try {
          const data = await Grupos.getAllData();
          setGroups(data);
        } catch (e) {
          console.error(e);
        }
      }
      GruposData();
  
    }, []);

    
    const edit = (group) => {
    setEditing(group);
    setForm({
      name: group.name || "",
      sport: group.sport || "",
      focus_skill: group.focus_skill || "",
      description: group.description || "",
      athlete_ids: group.athlete_ids || [],
    });
    setShowForm(true);
  };

  const delet = async (id) => {
    try {
      await Grupos.remove(id);
      const data = await Grupos.getAllData();
      setGroups(data);
    } catch (e) {
      console.error(e);
    }
  };

  const resetForm = () => {
    setForm({ name: "", sport: "", focus_skill: "", description: "", athlete_ids: [] });
    setEditing(null);
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

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Indica o nome da turma"); return; }
    try {
      if (editing) {
        await Grupos.update(editing.id, { ...form });
      } else {
        await Grupos.insert({ ...form });
      }
      const data = await Grupos.getAllData();
      setGroups(data);
      resetForm();
    } catch (e) {
      console.error(e);
    }
  };
 
  return (
    <div className="space-y-6" data-testid="groups-page">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tighter">Turmas de atletas</h1>
          <p className="text-slate-500 mt-1">Organiza turmas e equipas para facilitar o acompanhamento.</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 btn-hover-orange transition" data-testid="add-group-btn">
            <Plus className="w-4 h-4" /> Nova turma
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={submit} className="rounded-2xl bg-white border border-slate-200 p-6 space-y-5" data-testid="group-form">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">{editing ? "Editar turma" : "Nova turma"}</h2>
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
              <div className="font-semibold text-slate-800 text-sm">Atletas na turma</div>
              <div className="text-xs text-slate-500">{form.athlete_ids.length} selecionado(s) · {athletes.length} disponíveis</div>
            </div>
            {athletes.length === 0 ? (
              <div className="text-sm text-slate-500 py-6 text-center">Ainda não tens atletas registados.</div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-auto pr-1">
                {athletes.map(a => {
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
                      {checked && <Check className="w-4 h-4 text-cyan-600" />}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 font-semibold btn-hover-yellow transition">Cancelar</button>
            <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold btn-hover-green transition" data-testid="group-save">
              {editing ? "Guardar alterações" : "Criar turma"}
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
            const groupAthletes = athletes.filter(a => (g.athlete_ids || []).includes(a.id));
            return (
              <div key={g.id} className="rounded-2xl bg-white border border-slate-200 p-5 hover:-translate-y-0.5 transition" data-testid={`group-card-${g.id}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-bold truncate">{g.name}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                      {g.sport && <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">{g.sport}</span>}
                      {sk && <span className={`px-2 py-0.5 rounded-full font-bold ${sk.soft}`}>{sk.name}</span>}
                      <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-semibold">{groupAthletes.length} atletas</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => edit(g)} className="p-2 text-slate-400 hover:text-cyan-600" data-testid={`edit-group-${g.id}`}><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => delet(g.id)} className="p-2 text-slate-400 hover:text-red-500" data-testid={`delete-group-${g.id}`}><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                {g.description && <p className="mt-3 text-sm text-slate-600 line-clamp-2">{g.description}</p>}

                {groupAthletes.length > 0 ? (
                  <div className="mt-4">
                    <div className="flex -space-x-2">
                      {groupAthletes.slice(0, 6).map(a => (
                        <div key={a.id} title={a.name} className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 border-2 border-white flex items-center justify-center text-white font-bold text-xs">
                          {a.name[0]}
                        </div>
                      ))}
                      {groupAthletes.length > 6 && (
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-600 font-bold text-xs">
                          +{groupAthletes.length - 6}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-slate-400 italic">Sem atletas associados</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}