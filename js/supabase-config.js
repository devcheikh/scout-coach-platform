import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://itzluysqqsrzaidxgtqc.supabase.co'
const supabaseKey = 'sb_publishable_VJVI8pSmFeKkcTzgzJUwQw_1DBtTmb0'

export const supabase = createClient(supabaseUrl, supabaseKey)
