import { supabase } from '../db/supabase.js'
import type {
  Tracker,
  SupabaseTracker,
  TrackerHistory,
  Parameter,
} from '../models/types.js'

export const getTrackersByUserId = async (
  userId: number,
): Promise<Tracker[]> => {
  const { data, error } = await supabase
    .from('trackers')
    .select('*')
    .eq('user_id', userId)
    .order('tracker_id', { ascending: false })

  if (error) {
    console.error('Error fetching trackers:', error)
    throw error
  }

  return data.map(transformTracker)
}

export const getTrackerById = async (
  trackerId: string,
  userId: number,
): Promise<Tracker | null> => {
  const { data, error } = await supabase
    .from('trackers')
    .select('*')
    .eq('tracker_id', trackerId)
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching tracker:', error)
    throw error
  }

  return transformTracker(data)
}

export const createTracker = async (
  userId: number,
  trackerData: Omit<Tracker, 'id'>,
): Promise<Tracker> => {
  const insertData: Omit<SupabaseTracker, 'tracker_id'> = {
    user_id: userId,
    interval: trackerData.interval ?? null,
    time: trackerData.time ?? null,
    parameters: trackerData.parameters as any,
    name: trackerData.name ?? null,
    description: trackerData.description ?? null,
    actions: trackerData.actions as any,
    is_active: (trackerData as any).is_active ?? null,
    created_at: new Date().toISOString(),
    scenario_id: (trackerData as any).scenario_id ?? null,
    workflow_id: (trackerData as any).workflow_id ?? null,
  }

  const { data, error } = await supabase
    .from('trackers')
    .insert([insertData])
    .select()
    .single()

  if (error) {
    console.error('Error creating tracker:', error)
    throw error
  }

  return transformTracker(data)
}

export const updateTracker = async (
  trackerId: string,
  userId: number,
  trackerData: Partial<Omit<Tracker, 'id'>>,
): Promise<Tracker> => {
  const updateData: Partial<Omit<SupabaseTracker, 'tracker_id'>> = {}

  if (trackerData.interval !== undefined)
    updateData.interval = trackerData.interval
  if (trackerData.time !== undefined) updateData.time = trackerData.time
  if (trackerData.parameters !== undefined)
    updateData.parameters = trackerData.parameters as any
  if (trackerData.name !== undefined) updateData.name = trackerData.name
  if (trackerData.description !== undefined)
    updateData.description = trackerData.description
  if (trackerData.actions !== undefined)
    updateData.actions = trackerData.actions as any
  if (trackerData.isActive !== undefined)
    updateData.is_active = trackerData.isActive

  const { data, error } = await supabase
    .from('trackers')
    .update(updateData)
    .eq('tracker_id', trackerId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Tracker not found')
    }
    console.error('Error updating tracker:', error)
    throw error
  }

  return transformTracker(data)
}

export const deleteTracker = async (
  trackerId: string,
  userId: number,
): Promise<void> => {
  const tracker = await getTrackerById(trackerId, userId)
  if (!tracker) {
    throw new Error('Tracker not found')
  }

  const trackerIdNum = parseInt(trackerId, 10)
  if (isNaN(trackerIdNum)) {
    throw new Error('Invalid tracker ID')
  }

  const { error } = await supabase
    .from('trackers')
    .delete()
    .eq('tracker_id', trackerIdNum)
    .eq('user_id', userId)

  if (error) {
    console.error('Error deleting tracker:', error)
    throw error
  }
}

export const getTrackerHistory = async (
  trackerId: string,
  userId: number,
): Promise<TrackerHistory[]> => {
  const tracker = await getTrackerById(trackerId, userId)
  if (!tracker) {
    throw new Error('Tracker not found')
  }

  const trackerIdNum = parseInt(trackerId, 10)
  if (isNaN(trackerIdNum)) {
    throw new Error('Invalid tracker ID')
  }

  const { data, error } = await supabase
    .from('histories')
    .select('history_id, timestamp, tracker_id, user_id, output, summeries')
    .eq('tracker_id', trackerIdNum)
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching tracker history:', error)
    throw error
  }

  return data.map((item) => ({
    id: item.history_id,
    timestamp: item.timestamp,
    summary: item.summeries,
    output: item.output,
  }))
}

function transformTracker(dbTracker: SupabaseTracker): Tracker {
  console.log(dbTracker)
  return {
    id: dbTracker.tracker_id,
    interval: dbTracker.interval,
    time: dbTracker.time,
    parameters: (dbTracker.parameters as unknown as Parameter[]) || [],
    name: dbTracker.name,
    description: dbTracker.description,
    actions: dbTracker.actions as any,
    isActive: dbTracker.is_active,
    createdAt: dbTracker.created_at,
    scenarioId: dbTracker.scenario_id,
    workflow_id: dbTracker.workflow_id,
  }
}
