// Run: node server/scripts/create-admin.js
import { createClient } from '@supabase/supabase-js'
import { config } from '../config/env.js'

const adminSchema = {
  email: 'admin@alihassan.dev',
  password: 'Admin@786',
}

async function createAdmin() {
  if (!config.supabaseUrl || !config.supabaseServiceRole) {
    console.error('Missing Supabase credentials in .env')
    process.exit(1)
  }

  const supabase = createClient(config.supabaseUrl, config.supabaseServiceRole)

  console.log('Creating admin user...')
  
  const { data, error } = await supabase.auth.admin.createUser({
    email: adminSchema.email,
    password: adminSchema.password,
    email_confirm: true,
    user_metadata: { full_name: 'Admin', role: 'admin' },
  })

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('Admin user already exists. You can reset password in Supabase dashboard.')
    } else {
      console.error('Error:', error.message)
    }
  } else {
    console.log(`✓ Admin user created!`)
    console.log(`  Email: ${adminSchema.email}`)
    console.log(`  Password: ${adminSchema.password}`)
    console.log(`  Login at: http://localhost:5173/admin/login`)
  }
}

createAdmin()
