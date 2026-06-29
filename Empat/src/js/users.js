import { supabase } from '../context/AuthContext';

export const Users = {
  
  async insertUser(data) {
    const { error } = await supabase
      .from('users')
      .insert({
        name: data.name,
        email: data.email,
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

  async updateUser(data) {
    const { error } = await supabase
      .from('users')
      .update({
        name: data.name,
        email: data.email,
        role: data.role
      })
      .eq('id', data.id)
    if (error) throw error
  }

}



