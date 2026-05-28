import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Save, KeyRound, Loader2, ClipboardList, Users as UsersIcon, NotebookPen, CalendarDays } from "lucide-react";

export default function Profile() {
  const { user, setUser } = useAuth();

  return (
    <div className="space-y-6" data-testid="profile-page">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tighter">O meu perfil</h1>
        <p className="text-slate-500 mt-1">Gere a tua informação pessoal e a segurança da conta.</p>
      </div>

      {/* Card de identidade */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 flex items-center gap-5 flex-wrap">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 via-pink-500 to-orange-500 flex items-center justify-center text-white font-display font-bold text-3xl shadow-md">
          {""}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-2xl font-bold">{user.user_metadata?.full_name}</h2>
          <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
            <Mail className="w-4 h-4" /> {user.email}
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 font-semibold capitalize">{user.role || "coach"}</span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">Membro desde 2026</span>
          </div>
        </div>
      </div>

     

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Informações pessoais */}
        <form onSubmit={""} className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4" data-testid="profile-form">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-slate-700" />
            <h3 className="font-display text-xl font-bold">Informações pessoais</h3>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Nome completo</label>
            <input value={user.user_metadata?.full_name} onChange={e=>setForm({...form, name: e.target.value})}
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              data-testid="profile-name" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input value={user.email} disabled
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              data-testid="profile-email" />
            <p className="text-xs text-slate-400 mt-1">O email não pode ser alterado.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Desporto principal</label>
              <input value={""} onChange={e=>setForm({...form, sport: e.target.value})}
                placeholder="Ex: futebol"
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
                data-testid="profile-sport" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Organização / Clube</label>
              <input value={""} onChange={e=>setForm({...form, organization: e.target.value})}
                placeholder="Ex: Escola Básica X"
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
                data-testid="profile-org" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Telefone (opcional)</label>
            <input value={""} onChange={e=>setForm({...form, phone: e.target.value})}
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
              data-testid="profile-phone" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Sobre mim</label>
            <textarea value={""} onChange={e=>setForm({...form, bio: e.target.value})} rows={3}
              placeholder="Treinador há 5 anos, foco em desenvolvimento de jovens..."
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
              data-testid="profile-bio" />
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={""}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold transition"
              data-testid="profile-save">
              {"" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar alterações
            </button>
          </div>
        </form>

        {/* Alterar password */}
        <form onSubmit={""} className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 self-start" data-testid="password-form">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-slate-700" />
            <h3 className="font-display text-xl font-bold">Segurança</h3>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Password atual</label>
            <input type="password" required value={""}
              onChange={e=>setPwd({...pwd, current_password: e.target.value})}
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
              data-testid="password-current" />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Nova password</label>
            <input type="password" required minLength={6} value={""}
              onChange={e=>setPwd({...pwd, new_password: e.target.value})}
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
              data-testid="password-new" />
            <p className="text-xs text-slate-400 mt-1">Mínimo 6 caracteres.</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Confirmar nova password</label>
            <input type="password" required value={""}
              onChange={e=>setPwd({...pwd, confirm: e.target.value})}
              className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-slate-200"
              data-testid="password-confirm" />
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={""}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white font-semibold transition"
              data-testid="password-save">
              {"" ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              Alterar password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
