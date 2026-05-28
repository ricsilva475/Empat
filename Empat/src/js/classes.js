import { supabase } from '../context/AuthContext';

const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const Classes = {

    async insert(data) {

    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado")
    const { error } = await supabase
        .from('classes')
        .insert({
        title: data.title,
        time: data.date,
        sport: data.sport,
        team: data.team,
        focus_skill: data.focus_skill,
        user_id: user.id,
        })

        if (error) throw error
    },

    async getAllData() {

    const user = await getUser();

    if (!user) throw new Error("Utilizador não autenticado")
    
    const { data, error } = await supabase
        .from('classes')
        .select('*')
    
        if (error) throw error

        console.log("Dados das aulas:", data);

        return data
    },



}