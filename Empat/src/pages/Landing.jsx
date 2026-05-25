
import React from "react";
import { Link } from "react-router-dom";
import { LOGO_URL, SOFT_SKILLS, HERO_IMG, FEATURE_AI, FEATURE_EX } from "../js/constants";
import { Sparkles, ClipboardList, Dumbbell, NotebookPen, Target, CalendarDays, ArrowRight, Brain, Eye, BarChart3, Heart, MessageCircle, Shield, Crown } from "lucide-react";

const skillIcons = { empatia: Heart, comunicacao: MessageCircle, resiliencia: Shield, lideranca: Crown };

export default function Landing() {
  return (
    <div className= "bg-slate-50 relative overflow-hidden">
      <div className="blob bg-cyan-300 w-[500px] h-[500px] -top-40 -left-40\" />
      <div className="blob bg-pink-300 w-[400px] h-[400px] top-20 -right-20\" />
      <div className="blob bg-lime-300 w-[350px] h-[350px] top-[900px] -left-20\" />

      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3" data-testid="nav-logo">
            <img src={LOGO_URL} alt="Empat" className="w-10 h-10 object-contain rounded-xl" />
            <span className="font-display font-bold text-xl tracking-tight">Empat.</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#ia" className="hover:text-slate-900">Como a IA funciona</a>
            <a href="#skills" className="hover:text-slate-900">Soft skills</a>
            <a href="#exemplo" className="hover:text-slate-900">Exemplo</a>
            <a href="#features" className="hover:text-slate-900">Funcionalidades</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900" data-testid="nav-login">Entrar</Link>
            <Link to="/register" className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition" data-testid="nav-register">Começar grátis</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 reveal">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> IA ao lado do treinador
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tighter text-slate-900 leading-[1.05]">
              Soft skills nos mais jovens,<br/>
              <span className="gradient-text">desenvolvidas pelo desporto.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
              <strong>Empat.</strong> é a plataforma para treinadores e professores avaliarem, planearem e acompanharem
              o crescimento de <span className="font-semibold">empatia, comunicação, resiliência e liderança</span> nos seus atletas —
              a partir de <em>comportamento real</em>, não de questionários teóricos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#" className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold inline-flex items-center gap-2 transition hover:-translate-y-0.5" data-testid="hero-cta-register">
                Experimentar grátis <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#exemplo" className="px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-900 font-semibold hover:bg-slate-100 transition" data-testid="hero-cta-demo">
                Ver exemplo prático
              </a>
            </div>
            <div className="mt-8 flex items-center gap-5 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {SOFT_SKILLS.map((s) => (
                  <div key={s.id} className="w-8 h-8 rounded-full border-2 border-white" style={{background: s.color}} />
                ))}
              </div>
              4 soft skills acompanhadas em tempo real
            </div>
          </div>

          <div className="lg:col-span-5 relative reveal reveal-delay-2">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl">
              <img src={HERO_IMG} alt="Crianças a jogar futebol" className="w-full aspect-[4/5] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 backdrop-blur p-4 shadow-xl">
                <div className="text-xs font-bold uppercase tracking-widest text-cyan-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Análise IA do treino
                </div>
                <div className="mt-2 text-sm text-slate-800 font-medium leading-snug">
                  &ldquo;A equipa melhorou na cooperação, mas ainda apresenta baixa comunicação em momentos de pressão.&rdquo;
                </div>
                <div className="mt-3 flex gap-1.5">
                  {SOFT_SKILLS.map((s, i) => (
                    <div key={s.id} className="flex-1 h-1.5 rounded-full" style={{background: s.color, opacity: [0.9, 0.5, 0.7, 0.8][i]}}/>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALOR — porquê soft skills */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-slate-900 text-white p-10 md:p-14 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] text-cyan-300 font-bold">Porquê soft skills</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold tracking-tight">
              São a base da vida adulta. E o desporto é o ginásio perfeito para as treinar.
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed max-w-2xl">
              Empatia, comunicação, resiliência e liderança ditam o sucesso pessoal, académico e profissional.
              No treino, as crianças enfrentam emoções, decisões e interações <span className="text-white font-semibold">reais</span> —
              o contexto ideal para crescer.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              {k: "85%", v: "das decisões profissionais dependem de soft skills"},
              {k: "x3", v: "mais retenção em equipas com boa comunicação"},
              {k: "72%", v: "dos jovens melhoram resiliência com desporto"},
              {k: "4", v: "soft skills no core da Empat"},
            ].map((s,i)=>(
              <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="text-2xl font-display font-bold text-cyan-300">{s.k}</div>
                <div className="text-xs text-slate-400 mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO A IA FUNCIONA */}
      <section id="ia" className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-14">
          <div className="text-xs uppercase tracking-[0.2em] text-orange-500 font-bold">O diferencial</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-display font-bold tracking-tighter">
            A IA <span className="gradient-text">ajuda o treinador</span>, não o substitui.
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transforma observações simples em informação útil e acionável — antes, durante e depois do treino.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Brain, tag: "Antes", color: "bg-cyan-50 text-cyan-700 border-cyan-200", title: "Sugere", desc: "Objetivos de soft skill e exercícios adaptados ao desporto e contexto.", ex: "Para esta aula de futebol, sugerimos trabalhar comunicação através de um jogo 4x4 com regras específicas." },
            { icon: Eye, tag: "Depois", color: "bg-pink-50 text-pink-700 border-pink-200", title: "Interpreta", desc: "Observações curtas (\"não passou a bola\", \"ajudou colega\") viram padrões.", ex: "Tendência para decisões individuais sob pressão. Bom comportamento de apoio à equipa." },
            { icon: BarChart3, tag: "Evolução", color: "bg-lime-50 text-lime-700 border-lime-200", title: "Gera feedback", desc: "Feedback por aluno, padrões de equipa e evolução ao longo do tempo.", ex: "A equipa melhorou na cooperação, mas ainda apresenta baixa comunicação em momentos de pressão." },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="rounded-3xl bg-white border border-slate-200 p-7 hover:-translate-y-1 transition shadow-sm">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${c.color}`}>
                  <Icon className="w-3.5 h-3.5" /> {c.tag}
                </div>
                <h3 className="mt-5 text-2xl font-display font-bold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-slate-600">{c.desc}</p>
                <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 italic">
                  &ldquo;{c.ex}&rdquo;
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMPORTAMENTO REAL */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-pink-500 font-bold">Abordagem única</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-display font-bold tracking-tighter">
              Baseamo-nos no que os alunos <em>fazem</em>,<br/>não no que dizem que fazem.
            </h2>
            <p className="mt-4 text-slate-600 text-lg leading-relaxed max-w-xl">
              O problema dos questionários tradicionais? Respostas enviesadas, autoavaliação e situações hipotéticas.
              Na Empat, é o treino que fala.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "Decisões reais em jogos e treinos",
                "Interações reais com colegas",
                "Emoções reais sob pressão",
                "O treinador observa — a IA organiza em padrões",
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs font-bold">✓</div>
                  <span className="text-slate-700">{t}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-cyan-50 to-pink-50 border border-cyan-100">
              <p className="font-display text-lg font-semibold text-slate-900">
                &ldquo;Sem comportamento real, não há dados reais. E sem dados reais, não há desenvolvimento consistente.&rdquo;
              </p>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
            <img src={FEATURE_AI} alt="Treinador com equipa de miúdos" className="w-full aspect-[5/4] object-cover" />
          </div>
        </div>
      </section>

      {/* EXEMPLO CONCRETO */}
      <section id="exemplo" className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.2em] text-lime-600 font-bold">Exemplo prático</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-display font-bold tracking-tighter">
            Aula de futebol — Objetivo: <span className="text-orange-500">Comunicação</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: "1", when: "Antes do treino", icon: Brain, body: "O treinador abre a Empat. Escolhe 'Futebol' + 'Comunicação'. A app sugere: jogo 4x4, regra: só passa após comunicação verbal.", color: "border-cyan-200 bg-cyan-50" },
            { step: "2", when: "Durante", icon: Eye, body: "O treinador não usa o telemóvel. Observa: quem fala, quem não fala, quem organiza a equipa.", color: "border-pink-200 bg-pink-50" },
            { step: "3", when: "Após (2–3 min)", icon: NotebookPen, body: "Regista rapidamente: 'João → pouca comunicação', 'Maria → liderou', 'Equipa → inconsistente'.", color: "border-orange-200 bg-orange-50" },
            { step: "4", when: "IA gera", icon: Sparkles, body: "Feedback individual para o João e a Maria, padrões da equipa e evolução ao longo das semanas.", color: "border-lime-200 bg-lime-50" },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className={`rounded-3xl p-6 border-2 ${c.color} relative overflow-hidden hover:-translate-y-1 transition`}>
                <div className="absolute -right-3 -top-3 text-[100px] font-display font-black text-white/70">{c.step}</div>
                <Icon className="w-6 h-6 text-slate-800 relative" />
                <div className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-600 relative">{c.when}</div>
                <p className="mt-2 text-slate-800 relative leading-snug">{c.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4 SOFT SKILLS */}
      <section id="skills" className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter">As 4 soft skills do core Empat</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SOFT_SKILLS.map((s) => {
            const Icon = skillIcons[s.id];
            return (
              <div key={s.id} className="rounded-3xl bg-white border border-slate-200 p-6 hover:-translate-y-1 transition shadow-sm">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4" style={{background: s.color}}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold">{s.name}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {s.id === "empatia" && "Capacidade de compreender e apoiar o colega."}
                  {s.id === "comunicacao" && "Expressar-se com clareza e escutar ativamente."}
                  {s.id === "resiliencia" && "Persistir, gerir erros e reerguer-se."}
                  {s.id === "lideranca" && "Orientar, decidir e responsabilizar-se."}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES BENTO */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter">Tudo o que precisas num só sítio</h2>
        </div>
        <div className="grid md:grid-cols-6 gap-5">
          <div className="md:col-span-4 rounded-3xl border border-slate-200 bg-white p-8 hover:-translate-y-1 transition">
            <Dumbbell className="w-7 h-7 text-orange-500" />
            <h3 className="mt-4 font-display text-2xl font-bold">Banco de exercícios</h3>
            <p className="mt-2 text-slate-600 max-w-xl">Biblioteca filtrável por desporto e soft skill. Cada atividade tem objetivo claro e sugestões de observação.</p>
            <div className="mt-6 rounded-2xl overflow-hidden">
              <img src={FEATURE_EX} alt="Banco de exercícios" className="w-full h-56 object-cover" />
            </div>
          </div>
          <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-slate-900 text-white p-8 hover:-translate-y-1 transition">
            <ClipboardList className="w-7 h-7 text-cyan-300" />
            <h3 className="mt-4 font-display text-xl font-bold">Questionários estruturados</h3>
            <p className="mt-2 text-slate-300 text-sm">Avaliações rápidas por soft skill, com histórico por atleta.</p>
          </div>
          <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 hover:-translate-y-1 transition">
            <NotebookPen className="w-7 h-7 text-pink-500" />
            <h3 className="mt-4 font-display text-xl font-bold">Observações pós-treino</h3>
            <p className="mt-2 text-slate-600 text-sm">Regista notas curtas e deixa a IA encontrar padrões.</p>
          </div>
          <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 hover:-translate-y-1 transition">
            <Target className="w-7 h-7 text-lime-500" />
            <h3 className="mt-4 font-display text-xl font-bold">Metas personalizadas</h3>
            <p className="mt-2 text-slate-600 text-sm">Objetivos com prazo e indicadores de sucesso por atleta.</p>
          </div>
          <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 hover:-translate-y-1 transition">
            <CalendarDays className="w-7 h-7 text-cyan-500" />
            <h3 className="mt-4 font-display text-xl font-bold">Calendário de treinos</h3>
            <p className="mt-2 text-slate-600 text-sm">Organiza sessões com foco de soft skill integrado.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-cyan-500 via-pink-500 to-orange-500 p-[1.5px]">
          <div className="rounded-3xl bg-white p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter">
              Pronto para <span className="gradient-text">treinar pessoas</span>, não só atletas?
            </h2>
            <p className="mt-4 text-slate-600 max-w-xl mx-auto leading-relaxed">
              Regista-te em 1 minuto. Começa já a avaliar as soft skills dos teus atletas com o apoio da IA.
            </p>
            <a href="/" className="mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold transition" data-testid="footer-cta-register">
              Começar agora <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-200 py-10 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Empat" className="w-7 h-7" />
            <span className="font-display font-bold text-slate-900">Empat.</span>
          </div>
          <div>© {new Date().getFullYear()} Empat. Soft skills pelo desporto.</div>
        </div>
      </footer>
    </div>
  );
}