import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
    import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
        "Missing PUBLIC_SUPABASE_URL or a public Supabase key.",
    );
}

export const supabase = createBrowserClient(
    supabaseUrl,
    supabasePublishableKey,
);
