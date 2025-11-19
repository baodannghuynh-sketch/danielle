import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://evtcttyznlhzbrustbyh.supabase.co";
const SUPABASE_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dGN0dHl6bmxoemJydXN0YnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NTM2NzksImV4cCI6MjA3OTAyOTY3OX0.tFB-wIeN8tqRnlA5x3aqEuT5o-a5jqIk6OfHXwlQ23Q";

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
