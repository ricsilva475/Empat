import React, { useState } from "react";
import { BookOpen, Target, ListChecks, CalendarDays, MessageCircleQuestion, ChevronDown, Sparkles, Rocket, Crown, MessageCircle, GitBranch, Shield, Flame, Heart, ClipboardList } from "lucide-react";
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

      {/* Cronograma de Implementação (Projeto Piloto) */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          <CalendarDays className="w-4 h-4 text-cyan-600" /> Cronograma de Aplicação Recomendado (Projeto Piloto)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-500 block">Semana 1</span>
            <span className="font-semibold text-slate-800">Avaliação Inicial</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-500 block">Semanas 2–4</span>
            <span className="font-semibold text-slate-800">1º Ex. Aquisição</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-500 block">Semanas 5–7</span>
            <span className="font-semibold text-slate-800">2º Ex. Progressão</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-500 block">Semana 8</span>
            <span className="font-semibold text-slate-800">Avaliação Final</span>
          </div>
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
                {/*<h2 className="mt-1 font-display text-2xl font-bold tracking-tight">{r.objective}</h2>*/}
              </div>
            </div>
            {!r.isPilot ? 
            <div>
              {/* Objetivo, Como implementar e O que observar */}
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                {/* Coluna esquerda */}
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

                {/* Coluna direita */}
                <div className="p-8">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <ListChecks className="w-4 h-4" style={{ color: r.color }} /> O que observar
                  </div>
                  <ul className="mt-3 space-y-2">
                    {r.what_to_observe.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-800">
                        <span
                          className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: r.color }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Reflexão final + Ligação à vida — largura total */}
              <div className="px-8 py-6 bg-slate-50/40 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <MessageCircleQuestion className="w-4 h-4" style={{ color: r.color }} /> Reflexão final
                </div>
                <p className="mt-3 text-slate-800 leading-relaxed">{r.final_reflection}</p>

                <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Heart className="w-4 h-4" style={{ color: r.color }} /> Ligação à vida
                </div>
                <p className="mt-3 text-slate-800 leading-relaxed">{r.life_bridge}</p>
              </div>
            </div>
            : 
            <div>
              {/* Avaliação inicial */}
              <div className="bg-slate-50/50 p-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center">
                    <Target className="w-5 h-5" style={{ color: r.color }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-slate-900">
                      Avaliação inicial
                    </h3>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                {/* Objetivo + Como implementar */}
                <div className="p-8">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Target className="w-4 h-4" style={{ color: r.color }} /> Objetivo
                  </div>
                  <p className="mt-3 text-slate-800 leading-relaxed">
                    {r.initial_evaluation.objective}
                  </p>

                  <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Sparkles className="w-4 h-4" style={{ color: r.color }} /> Como implementar
                  </div>
                  <p className="mt-3 text-slate-800 leading-relaxed">
                    {r.initial_evaluation.how_to_implement}
                  </p>
                </div>

                {/* O que observar */}
                <div className="p-8">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <ListChecks className="w-4 h-4" style={{ color: r.color }} /> O que observar
                  </div>
                  <ul className="mt-3 space-y-2">
                    {r.initial_evaluation.what_to_observe.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-800">
                        <span
                          className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: r.color }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Exercícios */}
              <div className="border-t border-slate-200">
                <div className="bg-slate-50/50 p-8 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center">
                      <Flame className="w-5 h-5" style={{ color: r.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-slate-900">
                        Exercícios
                      </h3>
                    </div>
                  </div>
                </div>

                {r.exercises.map((e, i) => (
                  <div key={i} className="border-b border-slate-100 last:border-b-0">
                    {/* Título do exercício */}
                    <div className="px-8 py-6 bg-white">
                      <div
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: r.color }}
                      >
                        {e.step}
                      </div>
                      <h4 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                        {e.title}
                      </h4>
                    </div>

                    {/* Conteúdo do exercício */}
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                      {/* Objetivo + Como implementar */}
                      <div className="p-8">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                          <Target className="w-4 h-4" style={{ color: r.color }} /> Objetivo
                        </div>
                        <p className="mt-3 text-slate-800 leading-relaxed">
                          {e.objective}
                        </p>

                        <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                          <Sparkles className="w-4 h-4" style={{ color: r.color }} /> Como implementar
                        </div>
                        <p className="mt-3 text-slate-800 leading-relaxed">
                          {e.how_to_implement}
                        </p>
                      </div>

                      {/* O que observar */}
                      <div className="p-8">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                          <ListChecks className="w-4 h-4" style={{ color: r.color }} /> O que observar
                        </div>
                        <ul className="mt-3 space-y-2">
                          {e.what_to_observe.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-slate-800">
                              <span
                                className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ background: r.color }}
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Reflexão final — largura total */}
                    <div className="px-8 py-6 bg-slate-50/40 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <MessageCircleQuestion className="w-4 h-4" style={{ color: r.color }} /> Reflexão final
                      </div>
                      <p className="mt-3 text-slate-800 leading-relaxed">
                        {e.final_reflection}
                      </p>

                      {/* Ligação à vida — largura total */}
                      <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <Heart className="w-4 h-4" style={{ color: r.color }} /> Ligação à vida
                      </div>
                      <p className="mt-3 text-slate-800 leading-relaxed">
                        {e.life_bridge}
                      </p>

                      {/* Nota */}
                      {e.nota && 
                        <>
                          <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                            <ClipboardList className="w-4 h-4" style={{ color: r.color }} /> Nota
                          </div>
                          <p className="mt-3 text-slate-800 leading-relaxed">
                            {e.nota}
                          </p>
                        </>
                      }
                      
                    </div>
                  </div>
                ))}
              </div>
            </div>
            }
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
