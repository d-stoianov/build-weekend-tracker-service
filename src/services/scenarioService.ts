import { supabase } from '../db/supabase.js'
import type { Scenario, SupabaseScenario, Parameter } from '../models/types.js'

export const getAllScenarios = async (): Promise<Scenario[]> => {
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .order('scenario_id', { ascending: false })

  if (error) {
    console.error('Error fetching scenarios:', error)
    throw error
  }

  return data.map(transformScenario)
}

export const getScenarioById = async (
  scenarioId: number,
): Promise<Scenario | null> => {
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .eq('scenario_id', scenarioId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching scenario:', error)
    throw error
  }

  return transformScenario(data)
}

function transformScenario(dbScenario: SupabaseScenario): Scenario {
  return {
    id: dbScenario.scenario_id,
    name: dbScenario.name,
    description: dbScenario.description,
    parameters: (dbScenario.parameters as unknown as Parameter[]) || [],
    outputs: dbScenario.outputs,
    workflow_id: dbScenario.workflow_id,
  }
}
