import { supabase } from "../context/AuthContext";

export const Users = {
  async insertUser(data) {
    if (!data.id) {
      return {
        data: null,
        error: new Error(
          "Não foi fornecido o ID do utilizador do Supabase Auth."
        ),
      };
    }

    const { data: userData, error } = await supabase
      .from("users")
      .upsert(
        {
          id: data.id,
          name: data.name,
          email: data.email,
          role: "coach",
        },
        {
          onConflict: "id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Erro ao inserir/atualizar utilizador:", error);

      return {
        data: null,
        error,
      };
    }

    return {
      data: userData,
      error: null,
    };
  },

  async getUserData(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateUser(data) {
    const { error } = await supabase
      .from("users")
      .update({
        name: data.name,
        email: data.email,
        role: data.role,
      })
      .eq("id", data.id);

    if (error) {
      throw error;
    }
  },
};