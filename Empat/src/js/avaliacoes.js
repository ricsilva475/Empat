import { supabase } from '../context/AuthContext';

const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const Avaliacoes = {

  async insert(data) {
    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado")
    const { error } = await supabase
      .from('avaliacoes')
      .insert({
        athlete_id: data.athlete_id,
        user_id: user.id,
        empatia: data.empatia,
        comunicacao: data.comunicacao,
        resiliencia: data.resiliencia,
        lideranca: data.lideranca,
        notes: data.notes,
      })

    if (error) throw error
  },

  async getAllData() {

    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado")
    
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('*')
      .eq('user_id', user.id)

    if (error) throw error
   
    return data
  },

  async getLastAvaliacaoByAtleta(athlete_id) {

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

  async getAvaliacoesByAtleta(athlete_id) {

    const user = await getUser();
    if (!user) throw new Error("Utilizador não autenticado")
    const { data, error } = await supabase
        .from('avaliacoes')
        .select('*')
        .eq('user_id', user.id)
        .eq('athlete_id', athlete_id)
        .order('created_at', { ascending: true })
        if (error) throw error

        //console.log("Avaliações para atleta", athlete_id, ":", data);
         return data || [];
  },

  async getLastAvaliacoes(athletes) {

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
  },

  async getAvaliacoesCount() {
    const { count, error } = await supabase
      .from('avaliacoes')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    
    return count ?? 0
  },

}


