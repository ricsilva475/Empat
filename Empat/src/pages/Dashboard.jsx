
import React, { useEffect, useState } from "react";
import { SOFT_SKILLS, SKILL_MAP } from "../js/constants";
import { Users, ClipboardList, NotebookPen, CalendarDays, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { useAuth } from "../context/AuthContext";

import {Atletas} from "../js/athletes";
import {Avaliacoes} from "../js/avaliacoes";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [athletes, setAthletes] = useState([]);
  const [atletasNum, setAtletasNum] = useState("");
  const [avaliacoesNum, setAvaliacoesNum] = useState("");

  useEffect(() => {
    async function AtletasData() {
      const count = await Atletas.getAtletasCount();
      const data = await Atletas.getAllData();
      setAtletasNum(count);
      setAthletes(data);
    }
    AtletasData();

    async function AvaliacoesData() {
      const numAvaliacoes = await Avaliacoes.getAvaliacoesCount();
      const athletesIds = await Atletas.getAllData();
      const avaliacoes = await Avaliacoes.getLastAvaliacoes(athletesIds);
      const averageTeamValue = { team_averages: calcTeamAverages(avaliacoes) };
      setStats(averageTeamValue);
      setAvaliacoesNum(numAvaliacoes);
    }
    AvaliacoesData();
  }, []);

  // Função para calcular a média da equipa
  function calcTeamAverages(data) {

  return SOFT_SKILLS.reduce((acc, skill) => {
    const values = data
      .map(row => row[skill.id])
      .filter(v => v !== null && v !== undefined);

    acc[skill.id] = values.length > 0
      ? Math.round((values.reduce((sum, v) => sum + v, 0) / values.length) * 10) / 10
      : 0;

    return acc;
  }, {});
}

  const radarData = stats ? SOFT_SKILLS.map(s => ({ skill: s.name, value: stats.team_averages[s.id] || 0 })) : [];

  const CARDS = [
    { label: "Atletas", value: atletasNum?.toString() ?? "-", icon: Users, color: "text-cyan-600", bg: "bg-cyan-50" },
    { label: "Avaliações", value: avaliacoesNum?.toString() ?? "-", icon: ClipboardList, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Observações", value: stats?.observations ?? "-", icon: NotebookPen, color: "text-pink-600", bg: "bg-pink-50" },
    { label: "Sessões", value: stats?.sessions ?? "-", icon: CalendarDays, color: "text-lime-600", bg: "bg-lime-50" },
  ];

  return (

    <div className="space-y-8" data-testid="dashboard-page">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tighter">Visão geral</h1>
        <p className="text-slate-500 mt-1">O que está a acontecer com os teus atletas.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CARDS.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="rounded-2xl bg-white border border-slate-200 p-5">
              <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="mt-4 text-3xl font-display font-bold">{c.value}</div>
              <div className="text-sm text-slate-500">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">Média da equipa por soft skill</h2>
              <p className="text-sm text-slate-500">Valores atuais (0–5) baseados nas últimas avaliações.</p>
            </div>
          </div>
          <div className="mt-4 h-80">
            <ResponsiveContainer>
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "#475569", fontSize: 13, fontFamily: "Figtree" }} />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Radar name="Equipa" dataKey="value" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {SOFT_SKILLS.map(s => (
              <div key={s.id} className="text-center">
                <div className="text-xs text-slate-500">{s.name}</div>
                <div className="text-lg font-display font-bold" style={{color: s.color}}>{stats?.team_averages?.[s.id] ?? 0}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <h2 className="font-display text-xl font-bold">Atletas recentes</h2>
          {athletes.length === 0 && (
            <div className="mt-6 text-sm text-slate-500">
              Ainda não tens aletas. <Link to="/menu/atletas" className="text-cyan-600 font-semibold">Adiciona o primeiro</Link>.
            </div>
          )}
          <ul className="mt-4 space-y-3">
            {athletes.slice(0, 6).map(a => (
              <li key={a.id}>
                <Link to={`/menu/atletas/${a.id}`} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center text-white font-bold">{a.name[0].toUpperCase()}</div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{a.name}</div>
                    <div className="text-xs text-slate-500 capitalize">{a.sport} · {a.age} anos</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-3xl p-8 bg-gradient-to-br from-cyan-500 via-pink-500 to-orange-500 text-white">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> IA
            </div>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-bold tracking-tight">Planeia o próximo treino em 30 segundos</h2>
            <p className="mt-2 text-white/90">Escolhe desporto + soft skill e a IA sugere um plano completo de sessão.</p>
          </div>
          <Link to="/app/planos" className="px-5 py-3 rounded-full bg-white text-slate-900 font-semibold hover:bg-slate-100 transition" data-testid="dashboard-ai-cta">
            Abrir Plano com IA →
          </Link>
        </div>
      </div>
    </div>
  );
}