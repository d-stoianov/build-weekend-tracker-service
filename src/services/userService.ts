import { supabase } from '../db/supabase.js'

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
