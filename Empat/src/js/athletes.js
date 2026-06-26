import { supabase } from '../context/AuthContext';

const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const Atletas = {
  
  async getAllData() {
    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado")

    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .eq('user_id', user.id)
      .eq('eliminated', false);

    if (error) throw error
    //console.log("Dados dos atletas:", data);
    return data
  },

  async insert(data) {
    
    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado")

    const { error } = await supabase
      .from('athletes')
      .insert({
        name: data.name,
        age: data.age,
        sport: data.sport,
        team: data.team,
        position: data.position,
        notes: data.notes,
        user_id: user.id,
      })

    if (error) throw error
  },

  async getAtletaDetails(id) {
    const user = await getUser();

  if (!user) throw new Error("Utilizador não autenticado")
  const { data, error } = await supabase
    .from('athletes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) throw error
  //console.log("Dados do atleta:", data);
  return data
  },

  async update(id, data) {
    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado");

    const { error } = await supabase
      .from("athletes")
      .update({
        name: data.name,
        age: data.age,
        sport: data.sport,
        team: data.team,
        position: data.position,
        notes: data.notes,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

  },

  async getAtletasCount() {
    const { count, error } = await supabase
      .from('athletes')
      .select('*', { count: 'exact', head: true })

  if (error) throw error

  return count ?? 0
  },

  async delete(id) {
    
    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado")

    const { error } = await supabase
  .from('athletes')
  .update({ eliminated: true })
  .eq('id', id)
  .eq('user_id', user.id);

    if (error) throw error
  }

}



