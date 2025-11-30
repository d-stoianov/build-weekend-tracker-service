import { createClient } from '@supabase/supabase-js'
import { supabase } from '../db/supabase.js'
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from '../config.js'

export const createUser = async (id: string, email: string) => {
  try {
    console.log('CREATING USER')
    const { data, error } = await supabase
      .from('users')
      .insert([{ user_id: id, email }])
      .select()
      .single()

    console.log(data)

    if (error) throw error

    console.log('USER CREATED: ', data)

    return data
  } catch (err) {
    console.error('Error creating user:', err)
    return null
  }
}

export const getUserById = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .single()

  console.log('USER FOUND: ', data)

  if (error) {
    console.error('Error fetching user from users table:', error.message)
    return null
  }

  return data
}

export const getUserPrimaryKeyByAuthId = async (
  authUserId: string,
): Promise<number | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('user_id', authUserId)
    .single()

  if (error) {
    console.error('Error fetching user primary key:', error.message)
    return null
  }

  return data?.id || null
}

export const deleteUser = async (userId: number): Promise<void> => {
  // First, get the auth user_id before deleting the user record
  const { data: userData, error: fetchError } = await supabase
    .from('users')
    .select('user_id')
    .eq('id', userId)
    .single()

  if (fetchError) {
    console.error('Error fetching user for deletion:', fetchError)
    throw fetchError
  }

  const authUserId = userData?.user_id

  // Delete all history records for this user (cascade deletion)
  const { error: historyError } = await supabase
    .from('histories')
    .delete()
    .eq('user_id', userId)

  if (historyError) {
    console.error('Error deleting user history:', historyError)
    throw historyError
  }

  // Delete all trackers for this user (this will also delete tracker-specific histories)
  const { error: trackersError } = await supabase
    .from('trackers')
    .delete()
    .eq('user_id', userId)

  if (trackersError) {
    console.error('Error deleting user trackers:', trackersError)
    throw trackersError
  }

  // Delete the user record from database
  const { error } = await supabase.from('users').delete().eq('id', userId)

  if (error) {
    console.error('Error deleting user:', error)
    throw error
  }

  // Delete the user from Supabase Auth using admin client
  if (authUserId) {
    try {
      const adminClient = createClient(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        },
      )

      const { error: authError } =
        await adminClient.auth.admin.deleteUser(authUserId)

      if (authError) {
        console.error('Error deleting user from auth:', authError)
        // Note: We don't throw here because the database user is already deleted
        // This is a best-effort cleanup of the auth user
      }
    } catch (err) {
      console.error('Error calling auth admin API:', err)
      // Note: This might fail if we don't have admin privileges
      // The database user is already deleted, so we continue
    }
  }
}
