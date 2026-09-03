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

    const { data: athlete, error } = await supabase
      .from("athletes")
      .insert({
        name: data.name,
        age: data.age,
        sport: data.sport,
        team: data.team,
        position: data.position,
        notes: data.notes,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    await this.syncGroups(athlete.id, data.group_ids || []);

    if (data.group_id) {
      const { error: groupError } = await supabase
        .from("group_athletes")
        .insert({
          athlete_id: athlete.id,
          group_id: data.group_id,
          ativo: true,
        });

      if (groupError) throw groupError;
    }

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

    await this.syncGroups(id, data.group_ids || []);

  },

  async getAtletasCount() {
    const { count, error } = await supabase
      .from('athletes')
      .select('*', { count: 'exact', head: true })
      .not('eliminated', 'is', true)

    if (error) throw error

    return count ?? 0
  },

  async delete(id) {
    
    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado")

    //eliminar atletas
    const { error } = await supabase
      .from('athletes')
      .update({ eliminated: true })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error

    //desativar atletas nos grupo atletas
    const { error: groupError } = await supabase
      .from('group_athletes')
      .update({ ativo: false })
      .eq('athlete_id', id);

    if (groupError) throw groupError;

    //Eliminar avaliações do atleta
    const { error: avaliacaoError } = await supabase
      .from('avaliacoes')
      .update({ eliminated: true })
      .eq('athlete_id', id)
      .eq('user_id', user.id);

    if (avaliacaoError) throw avaliacaoError;
  },
  async syncGroups(athleteId, groupIds) {
  
      const { data: existing, error } = await supabase
        .from("group_athletes")
        .select("group_id, ativo")
        .eq("athlete_id", athleteId);
  
      if (error) throw error;
  
      const existingIds = existing.map(g => g.group_id);
  
      const toDeactivate = existingIds.filter(id => !groupIds.includes(id));
  
      const toActivate = groupIds.filter(id => existingIds.includes(id));
  
      const toInsert = groupIds.filter(id => !existingIds.includes(id));
  
      if (toDeactivate.length) {
        await supabase
          .from("group_athletes")
          .update({ ativo: false })
          .eq("athlete_id", athleteId)
          .in("group_id", toDeactivate);
      }
  
      if (toActivate.length) {
        await supabase
          .from("group_athletes")
          .update({ ativo: true })
          .eq("athlete_id", athleteId)
          .in("group_id", toActivate);
      }
  
      if (toInsert.length) {
        await supabase
          .from("group_athletes")
          .insert(
            toInsert.map(groupId => ({
              athlete_id: athleteId,
              group_id: groupId,
              ativo: true
            }))
          );
      }
    },

  async getGroupsByAthlete(athleteId) {
    const { data, error } = await supabase
      .from("group_athletes")
      .select("group_id")
      .eq("athlete_id", athleteId)
      .eq("ativo", true);

    if (error) throw error;

    return data.map(g => g.group_id);
  },

  async getGroupsByAthlete(athleteId) {
    const { data, error } = await supabase
      .from("group_athletes")
      .select(`
        group_id,
        groups (
          id,
          name,
          sport
        )
      `)
      .eq("athlete_id", athleteId)
      .eq("ativo", true);

    if (error) throw error;

    return data.map(item => item.groups);
  },

  

}



