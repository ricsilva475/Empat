import { supabase } from '../context/AuthContext';

const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const Goals = {

  async insert(data) {
    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado");
    
    // Garantir que athlete_id é string (UUID)
    const athleteId = data.athlete_id ? String(data.athlete_id) : null;
    
    // Processar a data corretamente
    let deadline = null;
    if (data.deadline) {
      // Se for um número (ano), converter para data de fim do ano
      if (typeof data.deadline === 'number') {
        deadline = `${data.deadline}-12-31`;
      } else {
        deadline = data.deadline;
      }
    }
    
    const { error } = await supabase
      .from('goals')
      .insert({
        athlete_id: athleteId,
        user_id: user.id,
        description: data.description,
        priority: data.priority,
        deadline: deadline,
        completed: data.completed || false,
        eliminated: false,
      });

    if (error) throw error;
  },

  async getAllData() {
    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado");
    
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('eliminated', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
   
    return data || [];
  },

  async getGoalsByAtleta(athlete_id) {
    const user = await getUser();
    
    if (!user) throw new Error("Utilizador não autenticado");
    
    const athleteId = athlete_id ? String(athlete_id) : null;
    
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('athlete_id', athleteId)
      .eq('eliminated', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data || [];
  },

  async getPendingGoalsByAtleta(athlete_id) {
    const user = await getUser();
    
    if (!user) throw new Error("Utilizador não autenticado");
    
    const athleteId = athlete_id ? String(athlete_id) : null;
    
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('athlete_id', athleteId)
      .eq('completed', false)
      .eq('eliminated', false);

    if (error) throw error;
    
    return data || [];
  },

  async getCompletedGoalsByAtleta(athlete_id) {
    const user = await getUser();
    
    if (!user) throw new Error("Utilizador não autenticado");
    
    const athleteId = athlete_id ? String(athlete_id) : null;
    
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('athlete_id', athleteId)
      .eq('completed', true)
      .eq('eliminated', false);

    if (error) throw error;
    
    return data || [];
  },

  async update(id, data) {
    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado");

    const { error } = await supabase
      .from('goals')
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  async toggleCompleted(id, completed) {
    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado");

    const { error } = await supabase
      .from('goals')
      .update({ completed })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  async delete(id) {
    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado");

    const { error } = await supabase
      .from('goals')
      .update({ eliminated: true })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  },

  async getGoalsCount() {
    const { count, error } = await supabase
      .from('goals')
      .select('*', { count: 'exact', head: true })
      .eq('eliminated', false);

    if (error) throw error;
    
    return count ?? 0;
  },

  async getGoalsCountByAtleta(athlete_id) {
    const user = await getUser();
    
    if (!user) throw new Error("Utilizador não autenticado");
    
    const athleteId = athlete_id ? String(athlete_id) : null;

    const { count, error } = await supabase
      .from('goals')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('athlete_id', athleteId)
      .eq('eliminated', false);

    if (error) throw error;
    
    return count ?? 0;
  },
};