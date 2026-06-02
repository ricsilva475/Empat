import { supabase } from '../context/AuthContext';

export const Users = {
  
  async insertUser(userData) {
    const { error } = await supabase
      .from('users')
      .insert({
        name: userData.name,
        email: userData.email,
        role: 'coach'
      })

    if (error) throw error
      
  },

  async getUserData(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single() 
    if (error) throw error
    return data
  },

  async updateUser(userData) {
    const { error } = await supabase
      .from('users')
      .update({
        name: userData.name,
        email: userData.email,
        role: userData.role
      })
      .eq('id', userData.id)
    if (error) throw error
  }

}



