import { supabase } from '../context/AuthContext';

const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const Grupos = {

    async getGroupDetails(groupId) {

    const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single()
    if (groupError) throw groupError

    const { data: links, error: linksError } = await supabase
        .from('group_athletes')
        .select('athlete_id')
        .eq('group_id', groupId)
    if (linksError) throw linksError

    return {
        ...group,
        athlete_ids: links.map(l => l.athlete_id),
    }

    },

    async getAllData() {

    const { data: groups, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false })
    if (groupsError) throw groupsError

    const { data: links, error: linksError } = await supabase
        .from('group_athletes')
        .select('group_id, athlete_id')
    if (linksError) throw linksError

    return groups.map(g => ({
        ...g,
        athlete_ids: links.filter(l => l.group_id === g.id).map(l => l.athlete_id),
    }))
    
    },

    async insert(form) {

    const { athlete_ids, ...groupFields } = form
    const { data: group, error } = await supabase
        .from('groups')
        .insert(groupFields)
        .select()
        .single()
    if (error) throw error

    if (athlete_ids?.length) {
        const rows = athlete_ids.map(athlete_id => ({ group_id: group.id, athlete_id }))
        const { error: linkError } = await supabase.from('group_athletes').insert(rows)
        if (linkError) throw linkError
    }
    return group

    },

    async update(groupId, form) {

    const { athlete_ids, ...groupFields } = form
    const { error } = await supabase
        .from('groups')
        .update(groupFields)
        .eq('id', groupId)
    if (error) throw error

    const { error: delError } = await supabase
        .from('group_athletes')
        .delete()
        .eq('group_id', groupId)
    if (delError) throw delError

    if (athlete_ids?.length) {
        const rows = athlete_ids.map(athlete_id => ({ group_id: groupId, athlete_id }))
        const { error: insError } = await supabase.from('group_athletes').insert(rows)
        if (insError) throw insError
    }
    },

    

}