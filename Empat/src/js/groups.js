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
    

    

}