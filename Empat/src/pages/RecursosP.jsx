import React, { useState } from "react";
import { BookOpen, Target, ListChecks, MessageCircleQuestion, ChevronDown, Sparkles, Rocket, Crown, MessageCircle, GitBranch, Shield, Flame, Heart } from "lucide-react";
import { RESOURCES } from "../js/constants";


export default function Resources() {
  const [openId, setOpenId] = useState("lideranca");

  return (
    <div className="space-y-6" data-testid="resources-page">
      <div className="rounded-3xl p-8 bg-gradient-to-br from-cyan-500 via-pink-500 to-orange-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" /> Recursos Pedagógicos
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-4xl font-bold tracking-tighter">
            Guia estruturado para desenvolver soft skills
          </h1>
          <p className="mt-3 text-white/90 ">
            7 exercícios pedagógicos com objetivo, implementação, o que observar e reflexão final — pensados para treinadores e professores aplicarem em qualquer sessão.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {RESOURCES.map((r) => {
          const Icon = r.icon;
          const active = openId === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setOpenId(r.id)}
              className={`text-left p-4 rounded-2xl border-2 transition ${active ? "border-slate-900 bg-white shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"}`}
              data-testid={`resource-tab-${r.id}`}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: r.color }}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="mt-3 font-display font-bold text-sm leading-tight">{r.title}</div>
            </button>
          );
        })}
      </div>

      {RESOURCES.filter((r) => r.id === openId).map((r) => {
        const Icon = r.icon;
        return (
          <div key={r.id} className="rounded-3xl bg-white border border-slate-200 overflow-hidden" data-testid={`resource-detail-${r.id}`}>
            <div className="p-8 border-b border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white" style={{ background: r.color }}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${r.soft}`}>{r.title}</div>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">{r.objective}</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="p-8">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Target className="w-4 h-4" style={{ color: r.color }} /> Objetivo
                </div>
                <p className="mt-3 text-slate-800 leading-relaxed">{r.objective}</p>

                <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Sparkles className="w-4 h-4" style={{ color: r.color }} /> Como implementar
                </div>
                <p className="mt-3 text-slate-800 leading-relaxed">{r.how_to_implement}</p>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <ListChecks className="w-4 h-4" style={{ color: r.color }} /> O que observar
                </div>
                <ul className="mt-3 space-y-2">
                  {r.what_to_observe.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-800">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: r.color }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <MessageCircleQuestion className="w-4 h-4" style={{ color: r.color }} /> Reflexão final
                </div>
                <p className="mt-3 text-slate-800 leading-relaxed">{r.final_reflection}</p>
              </div>
            </div>
          </div>
        );
      })}

      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 text-sm text-slate-600">
        <strong className="text-slate-900">Dica:</strong> Todos os exercícios seguem o mesmo ciclo pedagógico — <em>Objetivo → Implementação → Observação → Reflexão</em> —
        e devem terminar com uma <strong>ponte com a vida real</strong> (escola, casa, amigos), maximizando a transferência das aprendizagens.
      </div>
    </div>
  );
}
