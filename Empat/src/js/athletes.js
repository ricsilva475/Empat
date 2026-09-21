import { supabase } from "../context/AuthContext";

const getUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

export const Atletas = {
  // ============================================================
  // OBTER TODOS OS ATLETAS ATIVOS
  // ============================================================
  async getAllData() {
    const user = await getUser();

    if (!user) {
      throw new Error("Utilizador não autenticado");
    }

    const { data, error } = await supabase
      .from("athletes")
      .select("*")
      .eq("user_id", user.id)
      .eq("eliminated", false)
      .order("name", { ascending: true });

    if (error) throw error;

    return data || [];
  },

  // ============================================================
  // CRIAR ATLETA
  // ============================================================
  async insert(data) {
    const user = await getUser();

    if (!user) {
      throw new Error("Utilizador não autenticado");
    }

    const { data: athlete, error } = await supabase
      .from("athletes")
      .insert({
        name: data.name,
        age: data.age,
        position: data.position,
        notes: data.notes,
        user_id: user.id,
        eliminated: false,
      })
      .select()
      .single();

    if (error) throw error;

    // Se forem fornecidas turmas, sincronizar
    if (data.group_ids?.length) {
      await this.syncGroups(athlete.id, data.group_ids);
    }

    return athlete;
  },

  // ============================================================
  // OBTER DETALHES DE UM ATLETA
  // ============================================================
  async getAtletaDetails(id) {
    const user = await getUser();

    if (!user) {
      throw new Error("Utilizador não autenticado");
    }

    const { data, error } = await supabase
      .from("athletes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) throw error;

    return data;
  },

  // ============================================================
  // ATUALIZAR ATLETA
  // ============================================================
  async update(id, data) {
    const user = await getUser();

    if (!user) {
      throw new Error("Utilizador não autenticado");
    }

    const { error } = await supabase
      .from("athletes")
      .update({
        name: data.name,
        age: data.age,
        position: data.position,
        notes: data.notes,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    // Apenas sincroniza grupos se forem fornecidos
    if (Array.isArray(data.group_ids)) {
      await this.syncGroups(id, data.group_ids);
    }
  },

  // ============================================================
  // CONTAR ATLETAS
  // ============================================================
  async getAtletasCount() {
    const { count, error } = await supabase
      .from("athletes")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("eliminated", false);

    if (error) throw error;

    return count ?? 0;
  },

  // ============================================================
  // ELIMINAR ATLETA
  // ============================================================
  async delete(id) {
    const user = await getUser();

    if (!user) {
      throw new Error("Utilizador não autenticado");
    }

    // Eliminar logicamente o atleta
    const { error } = await supabase
      .from("athletes")
      .update({
        eliminated: true,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    // Desativar atleta nas turmas
    const { error: groupError } = await supabase
      .from("group_athletes")
      .update({
        ativo: false,
      })
      .eq("athlete_id", id);

    if (groupError) throw groupError;

    // Eliminar logicamente as avaliações
    const { error: avaliacaoError } = await supabase
      .from("avaliacoes")
      .update({
        eliminated: true,
      })
      .eq("athlete_id", id)
      .eq("user_id", user.id);

    if (avaliacaoError) throw avaliacaoError;
  },

  // ============================================================
  // OBTER TURMA ATUAL DO ATLETA
  // ============================================================
  async getCurrentGroup(athleteId) {
    const { data, error } = await supabase
      .from("group_athletes")
      .select(`
        group_id,
        ativo,
        groups (
          id,
          name,
          sport
        )
      `)
      .eq("athlete_id", athleteId)
      .eq("ativo", true)
      .maybeSingle();

    if (error) throw error;

    return data?.groups || null;
  },

  // ============================================================
  // SINCRONIZAR TURMA DO ATLETA
  // ============================================================
  async syncGroups(athleteId, groupIds) {
    if (!Array.isArray(groupIds)) {
      groupIds = [];
    }

    // Um atleta só pode ter uma turma
    if (groupIds.length > 1) {
      throw new Error(
        "Um atleta só pode estar associado a uma turma."
      );
    }

    // ==========================================================
    // OBTER RELAÇÕES EXISTENTES
    // ==========================================================

    const { data: existing, error } = await supabase
      .from("group_athletes")
      .select(`
        group_id,
        ativo,
        groups (
          id,
          name,
          sport
        )
      `)
      .eq("athlete_id", athleteId);

    if (error) throw error;

    const activeGroup = (existing || []).find(
      (group) => group.ativo === true
    );

    const newGroupId =
      groupIds.length > 0
        ? groupIds[0]
        : null;


    // ==========================================================
    // REMOVER O ATLETA DA TURMA
    // ==========================================================

    if (!newGroupId) {

      if (!activeGroup) {
        return;
      }

      const { error: deactivateError } =
        await supabase
          .from("group_athletes")
          .update({
            ativo: false,
          })
          .eq("athlete_id", athleteId)
          .eq("ativo", true);

      if (deactivateError) {
        throw deactivateError;
      }

      return;
    }


    // ==========================================================
    // JÁ ESTÁ NA TURMA SELECIONADA
    // ==========================================================

    if (
      activeGroup &&
      String(activeGroup.group_id) ===
        String(newGroupId)
    ) {
      return;
    }


    // ==========================================================
    // DESATIVAR TURMA ATUAL
    // ==========================================================

    if (activeGroup) {

      const { error: deactivateError } =
        await supabase
          .from("group_athletes")
          .update({
            ativo: false,
          })
          .eq("athlete_id", athleteId)
          .eq("ativo", true);

      if (deactivateError) {
        throw deactivateError;
      }
    }


    // ==========================================================
    // VERIFICAR SE JÁ EXISTE RELAÇÃO COM A NOVA TURMA
    // ==========================================================

    const existingRelation =
      (existing || []).find(
        (group) =>
          String(group.group_id) ===
          String(newGroupId)
      );


    // ==========================================================
    // REATIVAR RELAÇÃO EXISTENTE
    // ==========================================================

    if (existingRelation) {

      const { error: reactivateError } =
        await supabase
          .from("group_athletes")
          .update({
            ativo: true,
          })
          .eq("athlete_id", athleteId)
          .eq("group_id", newGroupId);

      if (reactivateError) {
        throw reactivateError;
      }

      return;
    }


    // ==========================================================
    // CRIAR NOVA RELAÇÃO
    // ==========================================================

    const { error: insertError } =
      await supabase
        .from("group_athletes")
        .insert({
          athlete_id: athleteId,
          group_id: newGroupId,
          ativo: true,
        });

    if (insertError) {

      // Violação de constraint/índice único
      if (insertError.code === "23505") {
        throw new Error(
          "Este atleta já está associado a esta turma."
        );
      }

      throw insertError;
    }
  },

  // ============================================================
  // OBTER IDs DAS TURMAS DO ATLETA
  // ============================================================
  async getGroupsByAthlete(athleteId) {
    const { data, error } = await supabase
      .from("group_athletes")
      .select("group_id")
      .eq("athlete_id", athleteId)
      .eq("ativo", true);

    if (error) throw error;

    return (data || []).map((g) => g.group_id);
  },

  // ============================================================
  // OBTER TURMA DO ATLETA COM DETALHES
  // ============================================================
  async getGroupsDetailsByAthlete(athleteId) {
    const { data, error } = await supabase
      .from("group_athletes")
      .select(`
        group_id,
        ativo,
        groups (
          id,
          name,
          sport
        )
      `)
      .eq("athlete_id", athleteId)
      .eq("ativo", true);

    if (error) throw error;

    return (data || []).map((item) => item.groups);
  },
};