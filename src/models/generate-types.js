#!/usr/bin/env node
/**
 * Script to generate Supabase types from remote database
 * Usage: node src/models/generate-types.js
 */

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') })

const SUPABASE_URL = process.env.SUPABASE_URL

if (!SUPABASE_URL) {
  console.error('Error: SUPABASE_URL environment variable is not set')
  process.exit(1)
}

// Extract project ID from Supabase URL
// Format: https://<project-id>.supabase.co
const projectIdMatch = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)
if (!projectIdMatch) {
  console.error('Error: Could not extract project ID from SUPABASE_URL')
  console.error('Expected format: https://<project-id>.supabase.co')
  process.exit(1)
}

const projectId = projectIdMatch[1]
const outputPath = join(__dirname, 'database.types.ts')

console.log(`Generating types from project: ${projectId}`)
console.log(`Output: ${outputPath}`)

// Check if user is logged in
try {
  execSync('npx supabase projects list', { stdio: 'pipe' })
} catch (error) {
  console.error('❌ Not authenticated with Supabase CLI')
  console.error('Please run: npx supabase login')
  console.error('Then run this script again.')
  process.exit(1)
}

try {
  // Follow official Supabase documentation pattern:
  // https://supabase.com/docs/guides/api/rest/generating-types
  execSync(
    `npx supabase gen types typescript --project-id ${projectId} --schema public > ${outputPath}`,
    { stdio: 'inherit' },
  )
  console.log('✅ Types generated successfully!')
} catch (error) {
  console.error('❌ Error generating types:', error.message)
  process.exit(1)
}
