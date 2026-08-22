
import React, {useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { SOFT_SKILLS } from "../js/constants";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Atletas } from "../js/athletes";
import { Avaliacoes } from "../js/avaliacoes";

export default function AthleteDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [medias30Dias, setMedias30Dias] = useState({});  
  const [feedback, setFeedback] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [grupos, setGrupos] = useState(null);
  const location = useLocation();
  const [numeroRegistos, setNumeroRegistos] = useState(10);

  useEffect(() => {
    const load = async () => {
      const athleteData = await Atletas.getAtletaDetails(id);
      const avaliacoes = await Avaliacoes.getAvaliacoesByAtleta(id);
      const grupoData = await Atletas.getGroupsByAthlete(id);
      
      console.warn("Dados do atleta carregados:", avaliacoes);
      console.warn("Dados dos grupos carregados:", grupoData);
      setData(athleteData);
      setAvaliacoes(avaliacoes);
      setGrupos(grupoData);
      setMedias30Dias(calcularMedias30Dias(avaliacoes));
    };
    load();
  }, [id]);

  const runFeedback = async () => {
    console.warn("A correr análise IA para o atleta", id);
    setLoadingAi(true);
  };

  const calcularMedias30Dias = (avaliacoes) => {
    const agora = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(agora.getDate() - 30);

    const skills = [
      "motivacao",
      "tomadecisao",
      "gestaostress",
      "empatia",
      "comunicacao",
      "resiliencia",
      "lideranca"
    ];

    const medias = {};

    skills.forEach(skill => {
      const avaliacoesValidas = avaliacoes.filter(avaliacao => {
        const dataAvaliacao = new Date(avaliacao.created_at);

        return (
          dataAvaliacao >= trintaDiasAtras &&
          dataAvaliacao <= agora &&
          avaliacao[skill] > 0
        );
      });

      if (avaliacoesValidas.length === 0) {
        medias[skill] = 0;
      } else {
        const soma = avaliacoesValidas.reduce(
          (total, avaliacao) => total + avaliacao[skill],
          0
        );

        medias[skill] = Number((soma / avaliacoesValidas.length).toFixed(1));
      }
    });

    return medias;
  };

  if (!data) return <div className="text-slate-500\">A carregar...</div>;

  const avaliacoesFiltradas = (avaliacoes || []).slice(-numeroRegistos);

  const chartData = avaliacoesFiltradas.map(a => ({
    date: new Date(a.created_at).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
    }),
    comunicacao: a.comunicacao > 0 ? a.comunicacao : null,
    empatia: a.empatia > 0 ? a.empatia : null,
    lideranca: a.lideranca > 0 ? a.lideranca : null,
    resiliencia: a.resiliencia > 0 ? a.resiliencia : null,
    motivacao: a.motivacao > 0 ? a.motivacao : null,
    tomadecisao: a.tomadecisao > 0 ? a.tomadecisao : null,
    gestaostress: a.gestaostress > 0 ? a.gestaostress : null,
  }));

  return (
    <div className="space-y-6" data-testid="athlete-detail">
      <Link
        to={location.state?.from || "/menu/atletas"}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4"/> Voltar
      </Link>

      <div className="rounded-2xl bg-white border border-slate-200 p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center text-white font-bold text-3xl">{data.name[0]?.toUpperCase()}</div>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold tracking-tighter">{data.name}</h1>
          <div className="text-slate-500 capitalize mt-1">
            {data.sport} · {data.age} anos
            {data.position ? ` · ${data.position}` : ""}
            {grupos.length > 0 ? ` · ${grupos[0].name}` : " · Sem turma"}
          </div>

          
        </div>
        <Link
          to={`/menu/avaliacao_individual?athlete=${id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          data-testid="athlete-ai-feedback"
        >
          Fazer Avaliação
        </Link>
        <button onClick={runFeedback} disabled={loadingAi} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60 transition" data-testid="athlete-ai-feedback">
          {loadingAi ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
          Feedback IA
        </button>
      </div>
      <h2 className="font-display text-xl font-bold">Média dos últimos 30 dias</h2>
      <div className="grid md:grid-cols-4 gap-4">
        {SOFT_SKILLS.map(s => {
          const media = medias30Dias[s.id] ?? 0;
          return (
            <div key={s.id} className="rounded-2xl bg-white border border-slate-200 p-5">
              <div className="text-xs font-bold uppercase tracking-wider" style={{color: s.color}}>{s.name}</div>
              <div className="mt-2 text-3xl font-display font-bold">{media}<span className="text-base text-slate-400">/5</span></div>
              <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(media/5)*100}%`, background: s.color }} />
              </div>
            </div>
          );
        })}
      </div>
      {feedback && (
        <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-6" data-testid="ai-feedback-result">
          <div className="flex items-center gap-2 text-cyan-700 font-bold text-sm uppercase tracking-wider mb-3"><Sparkles className="w-4 h-4"/> Feedback IA</div>
          <h3 className="font-display text-xl font-bold">{feedback.headline}</h3>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs font-bold text-lime-700 uppercase">Pontos fortes</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">{(feedback.strengths||[]).map((s,i)=><li key={i}>• {s}</li>)}</ul>
            </div>
            <div>
              <div className="text-xs font-bold text-orange-700 uppercase">A melhorar</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">{(feedback.improvement_areas||[]).map((s,i)=><li key={i}>• {s}</li>)}</ul>
            </div>
            <div>
              <div className="text-xs font-bold text-cyan-700 uppercase">Próximos passos</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">{(feedback.recommended_next_steps||[]).map((s,i)=><li key={i}>• {s}</li>)}</ul>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-200 p-6">
        <div className="flex gap-2">
          <h2 className="font-display text-xl font-bold">Evolução ao longo do tempo</h2>
          {avaliacoes.length > 10 && (
            <select
              value={numeroRegistos}
              onChange={(e) => setNumeroRegistos(Number(e.target.value))}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
            >
              <option value={10}>Últimos 10</option>

              {avaliacoes.length > 30 && (
                <option value={30}>Últimos 30</option>
              )}

              <option value={avaliacoes.length}>Todos</option>
            </select>
          )}
        </div>
        
        {chartData.length === 0 ? (
          <p className="text-slate-500 mt-4 text-sm">Sem avaliações ainda. Vai a <Link to="/app/avaliacoes" className="text-cyan-600 font-semibold">Avaliações</Link>.</p>
        ) : (
          <div className="h-72 mt-4">
            <ResponsiveContainer>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3"/>
                <XAxis dataKey="date" tick={{ fontSize: 12 }}/>
                <YAxis domain={[0,5]}/>
                <Tooltip/>
                <Legend/>
                {SOFT_SKILLS.map(s => <Line key={s.id} type="monotone" dataKey={s.id} name={s.name} stroke={s.color} strokeWidth={2.5} dot={{r:3}}/>)}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-6">
        <h2 className="font-display text-xl font-bold">Observações recentes</h2>
        {(!data.observations || data.observations.length === 0) ? (
          <p className="text-slate-500 mt-4 text-sm">Sem observações registadas.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {data.observations.slice(0,5).map(o => (
              <li key={o.id} className="p-4 rounded-xl bg-slate-50">
                <div className="text-xs text-slate-500">{new Date(o.created_at).toLocaleString("pt-PT")}</div>
                <p className="mt-1 text-slate-800">{o.raw_text}</p>
                {o.ai_analysis?.summary && <p className="mt-2 text-sm text-cyan-700 italic">IA: {o.ai_analysis.summary}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
