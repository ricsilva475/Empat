import { supabase } from '../context/AuthContext';

const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getAtletasNum = async () => {
  const { count, error } = await supabase
    .from('athletes')
    .select('*', { count: 'exact', head: true })

  if (error) throw error

  return count ?? 0
}

export const insertAtletas = {
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
  }
}

export const getAtletasData = {
  async getAll() {
    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado")

    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .eq('user_id', user.id)

    if (error) throw error
    //console.log("Dados dos atletas:", data);
    return data
  },
}

export const getAtletaDetail = async (id) => {
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
}

export const deleteAtleta = {
  async delete(id) {
    
    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado")

    const { error } = await supabase
      .from('athletes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  },
}

