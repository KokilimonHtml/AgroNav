/* =========================================
   SUPABASE CLIENT
   ========================================= */

const SUPABASE_URL =
    "https://gslziuxqkyjzlqzrmewa.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_04FlIUJAYtJ8IjkjjN_ZEg_M6kwp58l";

// Initialize Supabase safely when the library is ready
function initSupabase() {
    if (typeof window.supabase !== "undefined" && window.supabase.createClient) {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } else {
        // Retry after short delay if library is still loading
        setTimeout(initSupabase, 100);
    }
}

initSupabase();