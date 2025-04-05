import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://olkxhzgjkiqmmpaysrlj.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sa3hoemdqa2lxbW1wYXlzcmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MTMyNzksImV4cCI6MjA1OTA4OTI3OX0.HXqlWqfFrSBjNOW3zfu-fVjw7JqLs8WPbAh68d__9UU";

export const supabase = createClient(supabaseUrl, supabaseKey);

