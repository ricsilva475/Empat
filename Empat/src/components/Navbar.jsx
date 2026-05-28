
import { useState } from "react";
import { Link, NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LOGO_URL } from "../js/constants";
import { LayoutDashboard, Users, ClipboardList, Dumbbell, NotebookPen, Sparkles, Target, CalendarDays, LogOut } from "lucide-react";

const nav = [
  { to: "/menu", end: true, label: "Visão Geral", icon: LayoutDashboard },
  { to: "/menu/atletas", label: "Atletas", icon: Users },
  { to: "/menu/avaliacoes", label: "Avaliações", icon: ClipboardList },
  { to: "/menu/calendario", label: "Calendário", icon: CalendarDays },
/*{ to: "/menu/observacoes", label: "Observações + IA", icon: NotebookPen },
  { to: "/menu/exercicios", label: "Banco de Exercícios", icon: Dumbbell },
  { to: "/menu/planos", label: "Plano com IA", icon: Sparkles },
  { to: "/menu/metas", label: "Metas", icon: Target },
  */
];

export default function Layout() {
  const { user, logout } = useAuth();
  const nav_ = useNavigate();

  //console.warn("Navbar carregada");
  //console.warn("getUserData:", user);

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? "bg-cyan-50 text-cyan-700 border border-cyan-100"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white/70 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3 px-6 py-5 border-b border-slate-100" data-testid="sidebar-logo">
          <img src={LOGO_URL} alt="Empat" className="w-10 h-10 rounded-xl object-contain" />
          <div>
            <div className="font-display font-bold text-lg tracking-tight">Empat.</div>
            <div className="text-xs text-slate-500 -mt-0.5">Soft skills pelo desporto</div>
          </div>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <NavLink key={n.to} to={n.to} end={n.end} className={linkCls} data-testid={`nav-${n.to.split("/").pop() || "overview"}`}>
                <Icon className="w-4 h-4" /> {n.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center text-white font-bold">
              {user?.user_metadata?.full_name?.[0]?.toUpperCase() || "E"}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{user?.user_metadata?.full_name}</div>
              <div className="text-xs text-slate-500 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={async () => { await logout(); nav_( "/"); }}
            data-testid="logout-btn"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 transition mb-3">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </aside>

        <main className="flex-1 p-6">
            <Outlet />
        </main>


      
    </div>
  );
}
