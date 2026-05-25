
import React, { useEffect, useState } from "react";
import { SPORTS, SKILL_MAP } from "../js/constants";
import { Link } from "react-router-dom";
import { Plus, Trash2, User } from "lucide-react";
import { toast } from "sooner";
import { insertAtletas } from "../js/athletes";

export default function Athletes() {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", age: 12, sport: "futebol", team: "", position: "", notes: "" });

  const submit = async (e) => {
  e.preventDefault()
  try {
    await insertAtletas.insert({
      ...form,
      age: parseInt(form.age),
    })
    console.warn("Atleta criado com sucesso!")
    setShowForm(false)
    setForm({ name: "", age: 12, sport: "futebol", team: "", position: "", notes: "" })
    load()
  } catch (e) {
    console.error(e)
  }
}

  return (
    <div className="space-y-6" data-testid="athletes-page">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tighter">Atletas</h1>
          <p className="text-slate-500 mt-1">{list.length} no total</p>
        </div>
        <button onClick={() => setShowForm(v=>!v)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition" data-testid="add-athlete-btn">
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
            <input id="athlete-age" type="number" min={5} max={25} required value={form.age} onChange={e=>setForm({...form,age:e.target.value})} className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200" data-testid="athlete-age"/>
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
          <div className="md:col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={()=>setShowForm(false)} className="px-5 py-2.5 rounded-full bg-slate-100 font-semibold">Cancelar</button>
            <button type="submit" className="px-5 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold" data-testid="athlete-save">Guardar</button>
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
                <Link to={`/app/atletas/${a.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg">{a.name[0]}</div>
                  <div className="min-w-0">
                    <div className="font-display font-bold truncate">{a.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{a.sport} · {a.age} anos · {a.team || "Sem equipa"}</div>
                  </div>
                </Link>
                <button onClick={() => del(a.id)} className="p-2 text-slate-400 hover:text-red-500" data-testid={`delete-athlete-${a.id}`}><Trash2 className="w-4 h-4"/></button>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-1.5">
                {Object.entries(a.skills || {}).map(([k,v]) => (
                  <div key={k} className="text-center">
                    <div className="h-1.5 rounded-full mb-1" style={{background: SKILL_MAP[k]?.color || "#94A3B8", opacity: Math.max(0.2, v/5)}} />
                    <div className="text-[10px] text-slate-500 truncate">{SKILL_MAP[k]?.name}</div>
                  </div>
                ))}
              </div>
              <Link to={`/app/atletas/${a.id}`} className="block mt-4 text-center text-sm font-semibold text-cyan-600 hover:text-cyan-700">Ver perfil →</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
