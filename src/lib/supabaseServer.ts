import { createServerClient } from "@supabase/ssr";
import { parseCookieHeader } from "@supabase/ssr";
import type { APIContext } from "astro";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
    import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
        "Missing PUBLIC_SUPABASE_URL or a public Supabase key.",
    );
}

export const createSupabaseServerClient = (
    request: Request,
    cookies: APIContext["cookies"],
) =>
    createServerClient(supabaseUrl, supabasePublishableKey, {
        cookies: {
            getAll() {
                return parseCookieHeader(
                    request.headers.get("cookie") ?? "",
                ).map(({ name, value }) => ({ name, value: value ?? "" }));
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    cookies.set(name, value, {
                        ...options,
                        path: options.path ?? "/",
                    });
                });
            },
        },
    });
