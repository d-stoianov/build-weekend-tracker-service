export interface ParameterOption {
  label: string
  value: string
}

export interface Parameter {
  id: string
  type: 'text' | 'dropdown' | 'number' | 'boolean' | 'date' | 'email' | 'url'
  label: string
  placeholder?: string
  default?: string | number | boolean
  options?: ParameterOption[]
}

import type { Database } from './database.types.js'

export type SupabaseTracker = Database['public']['Tables']['trackers']['Row']

export type SupabaseScenario = Database['public']['Tables']['scenarios']['Row']

export type Tracker = Omit<
  SupabaseTracker,
  | 'tracker_id'
  | 'user_id'
  | 'parameters'
  | 'created_at'
  | 'is_active'
  | 'scenario_id'
> & {
  id: SupabaseTracker['tracker_id']
  createdAt: SupabaseTracker['created_at']
  isActive: SupabaseTracker['is_active']
  scenarioId: SupabaseTracker['scenario_id']
  parameters: Parameter[]
}

export type Scenario = Omit<
  SupabaseScenario,
  'scenario_id' | 'parameters' | 'outputs'
> & {
  id: SupabaseScenario['scenario_id']
  parameters: Parameter[]
  outputs: SupabaseScenario['outputs']
}

export type SupabaseHistory = Database['public']['Tables']['histories']['Row']

export type TrackerHistory = Omit<
  SupabaseHistory,
  'history_id' | 'user_id' | 'tracker_id' | 'summeries'
> & {
  id: SupabaseHistory['history_id']
  summary: SupabaseHistory['summeries']
}
