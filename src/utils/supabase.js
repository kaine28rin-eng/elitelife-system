// Supabase configuration
// Replace with your actual Supabase URL and anon key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export async function submitPollData(payload) {
  const { user_id, need, difficulty_module, weak_module, level, study_method } = payload

  if (!user_id) {
    throw new Error('Missing user_id — submission blocked.')
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/poll_responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      user_id,
      need,
      difficulty_module,
      weak_module,
      level,
      study_method,
      submitted_at: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    // Handle duplicate user_id (unique constraint violation)
    if (response.status === 409 || error.includes('duplicate') || error.includes('unique')) {
      throw new Error('DUPLICATE_USER')
    }
    throw new Error(`Submission failed: ${response.status}`)
  }

  return true
}
