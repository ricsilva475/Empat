import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { SOFT_SKILLS } from "../js/constants";
import { ArrowLeft, Users, Sparkles, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

import { Grupos } from "../js/groups";
import { Avaliacoes } from "../js/avaliacoes";

export default function GroupDetail() {
  const { id } = useParams();
  const location = useLocation();

  const [data, setData] = useState(null);
  const [atletas, setAtletas] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [medias30Dias, setMedias30Dias] = useState({});
  const [loadingAi, setLoadingAi] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [numeroRegistos, setNumeroRegistos] = useState(10);

  useEffect(() => {
    const load = async () => {
      try {
        const groupData = await Grupos.getGroupDetails(id);
        const atletasData = await Grupos.getAthletesDetailsByGroup(id);

        // IMPORTANTE:
        // aqui precisas de uma função em Avaliacoes
        // que vá buscar as avaliações coletivas da turma.
        //const avaliacoesData = await Avaliacoes.getAvaliacoesByGrupo(id);

        setData(groupData);
        setAtletas(atletasData);
        //setAvaliacoes(avaliacoesData);

        /*setMedias30Dias(
          calcularMedias30Dias(avaliacoesData)
        );*/

      } catch (error) {
        console.error("Erro ao carregar detalhes da turma:", error);
      }
    };

    load();
  }, [id]);

  const calcularMedias30Dias = (avaliacoes) => {
    const agora = new Date();

    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(
      agora.getDate() - 30
    );

    const medias = {};

    SOFT_SKILLS.forEach(skill => {
      const avaliacoesValidas = avaliacoes.filter(avaliacao => {
        const dataAvaliacao = new Date(
          avaliacao.created_at
        );

        return (
          dataAvaliacao >= trintaDiasAtras &&
          dataAvaliacao <= agora &&
          avaliacao[skill.id] > 0
        );
      });

      if (avaliacoesValidas.length === 0) {
        medias[skill.id] = 0;
      } else {
        const soma = avaliacoesValidas.reduce(
          (total, avaliacao) =>
            total + Number(avaliacao[skill.id]),
          0
        );

        medias[skill.id] = Number(
          (soma / avaliacoesValidas.length).toFixed(1)
        );
      }
    });

    return medias;
  };

  const runFeedback = async () => {
    setLoadingAi(true);

    try {
      // Aqui podes depois ligar à tua IA
      // para gerar feedback da turma.

    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAi(false);
    }
  };

  if (!data) {
    return (
      <div className="text-slate-500">
        A carregar...
      </div>
    );
  }

  const avaliacoesFiltradas =
    (avaliacoes || []).slice(-numeroRegistos);

  const chartData = avaliacoesFiltradas.map(a => ({
    date: new Date(a.created_at).toLocaleDateString(
      "pt-PT",
      {
        day: "2-digit",
        month: "short"
      }
    ),

    ...Object.fromEntries(
      SOFT_SKILLS.map(skill => [
        skill.id,
        a[skill.id] > 0 ? a[skill.id] : null
      ])
    )
  }));

  return (
    <div className="space-y-6">

      {/* VOLTAR */}

      <Link
        to={location.state?.from || "/menu/turmas"}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>


      {/* HEADER DA TURMA */}

      <div className="rounded-2xl bg-white border border-slate-200 p-6 flex xl:flex-row flex-col gap-5">

        <div className="flex items-start gap-5">

          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center text-white font-bold text-3xl">
            {data.name?.[0]?.toUpperCase()}
          </div>

          <div className="flex-1">

            <h1 className="font-display text-3xl font-bold tracking-tighter">
              {data.name}
            </h1>

            <div className="text-slate-500 capitalize mt-1">
              {data.sport}
              {" · "}
              {atletas.length} atletas
            </div>

            {data.focus_skill && (
              <div className="text-sm text-slate-500 mt-2">
                Foco:{" "}
                <span className="font-semibold text-slate-700">
                  {data.focus_skill}
                </span>
              </div>
            )}

          </div>
        </div>


        <div className="flex sm:flex-row flex-col items-center justify-center xl:items-center xl:justify-end gap-3 xl:flex-1">

          <Link
            to={`/menu/avaliacoes_coletivas?group=${id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Fazer Avaliação
          </Link>

          <button
            onClick={runFeedback}
            disabled={loadingAi}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-500 text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-60"
          >
            {loadingAi ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}

            Feedback IA
          </button>

        </div>

      </div>


      {/* MÉDIAS */}

      <h2 className="font-display text-xl font-bold">
        Média dos últimos 30 dias
      </h2>

      <div className="grid md:grid-cols-4 gap-4">

        {SOFT_SKILLS.map(skill => {

          const media =
            medias30Dias[skill.id] ?? 0;

          return (
            <div
              key={skill.id}
              className="rounded-2xl bg-white border border-slate-200 p-5"
            >

              <div
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: skill.color }}
              >
                {skill.name}
              </div>

              <div className="mt-2 text-3xl font-display font-bold">
                {media}
                <span className="text-base text-slate-400">
                  /5
                </span>
              </div>

              <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">

                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(media / 5) * 100}%`,
                    background: skill.color
                  }}
                />

              </div>

            </div>
          );
        })}

      </div>


      {/* FEEDBACK IA */}

      {feedback && (
        <div className="rounded-2xl border-2 border-cyan-200 bg-cyan-50 p-6">

          <div className="flex items-center gap-2 text-cyan-700 font-bold text-sm uppercase tracking-wider mb-3">

            <Sparkles className="w-4 h-4" />

            Feedback IA

          </div>

          <h3 className="font-display text-xl font-bold">
            {feedback.headline}
          </h3>

          <div className="mt-4 grid md:grid-cols-3 gap-4">

            <div>
              <div className="text-xs font-bold text-lime-700 uppercase">
                Pontos fortes
              </div>

              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {(feedback.strengths || []).map(
                  (s, i) => (
                    <li key={i}>• {s}</li>
                  )
                )}
              </ul>
            </div>

            <div>
              <div className="text-xs font-bold text-orange-700 uppercase">
                A melhorar
              </div>

              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {(feedback.improvement_areas || []).map(
                  (s, i) => (
                    <li key={i}>• {s}</li>
                  )
                )}
              </ul>
            </div>

            <div>
              <div className="text-xs font-bold text-cyan-700 uppercase">
                Próximos passos
              </div>

              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                {(feedback.recommended_next_steps || []).map(
                  (s, i) => (
                    <li key={i}>• {s}</li>
                  )
                )}
              </ul>
            </div>

          </div>

        </div>
      )}


      {/* EVOLUÇÃO */}

      <div className="rounded-2xl bg-white border border-slate-200 p-6">

        <div className="flex gap-2">

          <h2 className="font-display text-xl font-bold">
            Evolução ao longo do tempo
          </h2>

          {avaliacoes.length > 10 && (
            <select
              value={numeroRegistos}
              onChange={(e) =>
                setNumeroRegistos(
                  Number(e.target.value)
                )
              }
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
            >
              <option value={10}>
                Últimos 10
              </option>

              {avaliacoes.length > 30 && (
                <option value={30}>
                  Últimos 30
                </option>
              )}

              <option value={avaliacoes.length}>
                Todos
              </option>
            </select>
          )}

        </div>


        {chartData.length === 0 ? (

          <p className="text-slate-500 mt-4 text-sm">
            Sem avaliações ainda. Vai a{" "}
            <Link
              to={`/menu/avaliacao_coletiva?group=${id}`}
              className="text-cyan-600 font-semibold"
            >
              Avaliações
            </Link>
            .
          </p>

        ) : (

          <div className="h-72 mt-4">

            <ResponsiveContainer>

              <LineChart data={chartData}>

                <CartesianGrid
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="date" />

                <YAxis domain={[0, 5]} />

                <Tooltip />

                <Legend />

                {SOFT_SKILLS.map(skill => (
                  <Line
                    key={skill.id}
                    type="monotone"
                    dataKey={skill.id}
                    name={skill.name}
                    stroke={skill.color}
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                ))}

              </LineChart>

            </ResponsiveContainer>

          </div>

        )}

      </div>


      {/* ATLETAS DA TURMA */}

      <div className="rounded-2xl bg-white border border-slate-200 p-6">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="font-display text-xl font-bold">
              Atletas da turma
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {atletas.length} atletas
            </p>
          </div>

        </div>


        {atletas.length === 0 ? (

          <p className="text-slate-500 mt-4 text-sm">
            Esta turma ainda não tem atletas.
          </p>

        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">

            {atletas.map(atleta => (

              <Link
                key={atleta.id}
                to={`/menu/atletas/${atleta.id}`}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition"
              >

                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-pink-400 flex items-center justify-center text-white font-bold">
                  {atleta.name?.[0]?.toUpperCase()}
                </div>

                <div>

                  <div className="font-semibold text-slate-800">
                    {atleta.name}
                  </div>

                  <div className="text-xs text-slate-500">
                    {atleta.sport}
                    {atleta.position
                      ? ` · ${atleta.position}`
                      : ""}
                  </div>

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>


      {/* OBSERVAÇÕES */}

      {data.notes && (
        <div className="rounded-2xl bg-white border border-slate-200 p-6">

          <h2 className="font-display text-xl font-bold">
            Observações
          </h2>

          <p className="mt-4 text-slate-700">
            {data.notes}
          </p>

        </div>
      )}

    </div>
  );
}