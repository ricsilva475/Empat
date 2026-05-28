import { supabase } from '../context/AuthContext';

// Função para obter o utilizador autenticado
const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Função para inserir uma nova avaliação
export const insertAvaliacao = async (userData) => {
    const user = await getUser();
    if (!user) throw new Error("Utilizador não autenticado")
   
  const { error } = await supabase
      .from('avaliacoes')
      .insert({
        athlete_id: userData.athlete_id,
        user_id: user.id,
        empatia: userData.empatia,
        comunicacao: userData.comunicacao,
        resiliencia: userData.resiliencia,
        lideranca: userData.lideranca,
        notes: userData.notes,
      })

    if (error) throw error
};

// Função para obter todas as avaliações do atleta
export const Avaliacoes = {
  async getAll() {

    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado")
    
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('*')
      .eq('user_id', user.id)

    if (error) throw error
   
    return data
  },
}

// Função para obter o número total de avaliações
export const AvaliacoesNum = { 
  async get() {
  const { count, error } = await supabase
    .from('avaliacoes')
    .select('*', { count: 'exact', head: true })

  if (error) throw error
  
  return count ?? 0
  }
}

// Função para obter a última avaliação de um atleta específico
export const LastAvaliacaoByAtleta = {
    async get(athlete_id) {

    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado")

    const { data, error } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('user_id', user.id)
        .eq('athlete_id', athlete_id)
        .order('created_at', { ascending: false })
        .limit(1)

        if (error) throw error

        //console.log("Última avaliação para atleta", athlete_id, ":", data);
        return data?.[0] || null

  },
}

// Função para obter as últimas avaliações 
export const LastAvaliacoes = {
  async get(athletes) {
    
    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado");

    const athleteIds = athletes.map(a => a.id);

    const { data, error } = await supabase
      .from('avaliacoes')
      .select('*')
      .eq('user_id', user.id)
      .in('athlete_id', athleteIds)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data;
  }
}
