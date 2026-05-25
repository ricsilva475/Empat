import { supabase } from '../context/AuthContext';

const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getAvaliacoesNum = async () => {
  const { count, error } = await supabase
    .from('avaliacoes')
    .select('*', { count: 'exact', head: true })

  if (error) throw error

  

  return count ?? 0
}

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

export const getAvaliacoes = {
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

export const getLastAvaliacaoByAtleta = {
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

        console.log("Última avaliação para atleta", athlete_id, ":", data);
        return data?.[0] || null


  },
}
