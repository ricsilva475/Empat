import { supabase } from '../context/AuthContext';

export const insertUser = async (userData) => {
  const { error } = await supabase
      .from('users')
      .insert({
        name: userData.name,
        email: userData.email,
        password_hash: userData.password,
        role: 'coach'
      })

    if (error) throw error
  
};

