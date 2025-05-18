// server/config/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');

let supabase;

const initSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key missing in .env file');
    // Optionally throw an error or exit, depending on how critical Supabase is at startup
    // process.exit(1);
    return null; // Return null if initialization fails
  }

  if (!supabase) {
      supabase = createClient(supabaseUrl, supabaseAnonKey);
      console.log('Supabase client initialized.');
  }
  return supabase;
};

// Function to get the initialized client instance
const getSupabase = () => {
    if (!supabase) {
       console.warn('Supabase client requested before initialization or initialization failed.');
       // Attempt to initialize again or handle error as needed
       return initSupabase();
    }
    return supabase;
}

module.exports = { initSupabase, getSupabase };