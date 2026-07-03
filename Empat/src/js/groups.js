import { supabase } from '../context/AuthContext';

const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};



export const Grupos = {

    async getAllData() {
    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado")

    const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("user_id", user.id)
        .eq("eliminated", false);

        if (error) throw error
        //console.log("Dados dos grupos:", data);
        return data
    },

    async getGroupDetails(groupId) {
        const { data, error } = await supabase
            .from('groups_athletes')
            .select('*')
            .eq('id', groupId)
            .single()
        if (error) throw error
        return data
    },
    async update(id, data) {
  const user = await getUser();

  if (!user) throw new Error("Utilizador não autenticado");

  const { error } = await supabase
    .from("groups")
    .update({
      name: data.name,
      sport: data.sport,
      focus_skill: data.focus_skill,
      notes: data.description,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  await this.syncAthletes(id, data.athlete_ids || []);
},
    async delete(id) {
    
        const user = await getUser();

        if (!user) throw new Error("Utilizador não autenticado")

        const { error } = await supabase
        .from('groups')
        .update({ eliminated: true })
        .eq('id', id)
        .eq('user_id', user.id);

        if (error) throw error
    },


    async insert(data) {

        const user = await getUser();

        if (!user) throw new Error("Utilizador não autenticado")

        const { data: group, error } = await supabase
            .from('groups')
            .insert({
                name: data.name,
                sport: data.sport,
                focus_skill: data.focus_skill,
                notes: data.description,
                user_id: user.id,
            })
            .select()
            .single()

        if (error) throw error

        if (data.athlete_ids && data.athlete_ids.length > 0) {
            const groupAthletes = data.athlete_ids.map(athlete_id => ({
                group_id: group.id,
                athlete_id: athlete_id,
            }))

            const { error: athletesError } = await supabase
                .from('group_athletes')
                .insert(groupAthletes)

            if (athletesError) throw athletesError
        }

        return group

    },

    async getAtletasCountByGroup(id) {
        const { count, error } = await supabase
            .from('group_athletes')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', id)
            .eq('ativo', true);

        console.log(id, count, error);
        if (error) throw error;
        return count ?? 0;
    },

    async getAthletesByGroup(groupId) {
        const { data, error } = await supabase
            .from("group_athletes")
            .select("athlete_id")
            .eq("group_id", groupId)
            .eq("ativo", true);

        if (error) throw error;

        return data.map(item => item.athlete_id);
    },

    async syncAthletes(groupId, athleteIds) {
  // 1. buscar relações existentes
  const { data: existing, error } = await supabase
    .from("group_athletes")
    .select("athlete_id, ativo")
    .eq("group_id", groupId);

  if (error) throw error;

  const existingIds = existing.map(e => e.athlete_id);

  // 2. atletas a remover (estavam ativos mas não estão selecionados)
  const toDeactivate = existingIds.filter(id => !athleteIds.includes(id));

  // 3. atletas a ativar (já existem mas estavam inativos)
  const toActivate = athleteIds.filter(id => existingIds.includes(id));

  // 4. novos atletas (não existem ainda)
  const toInsert = athleteIds.filter(id => !existingIds.includes(id));

  // --- DESATIVAR ---
  if (toDeactivate.length > 0) {
    const { error: err1 } = await supabase
      .from("group_athletes")
      .update({ ativo: false })
      .eq("group_id", groupId)
      .in("athlete_id", toDeactivate);

    if (err1) throw err1;
  }

  // --- REATIVAR ---
  if (toActivate.length > 0) {
    const { error: err2 } = await supabase
      .from("group_athletes")
      .update({ ativo: true })
      .eq("group_id", groupId)
      .in("athlete_id", toActivate);

    if (err2) throw err2;
  }

  // --- INSERIR NOVOS ---
  if (toInsert.length > 0) {
    const rows = toInsert.map(id => ({
      group_id: groupId,
      athlete_id: id,
      ativo: true,
    }));

    const { error: err3 } = await supabase
      .from("group_athletes")
      .insert(rows);

    if (err3) throw err3;
  }
}
    

    

}