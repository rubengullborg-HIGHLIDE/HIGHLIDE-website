import type { APIRoute } from "astro";
import {
    isSameOriginRequest,
    redirectWithAuthError,
    safeReturnPath,
} from "../../../lib/auth";

export const POST: APIRoute = async ({ request, locals }) => {
    if (!isSameOriginRequest(request)) {
        return new Response("Ugyldig forespørgsel.", { status: 403 });
    }

    const form = await request.formData();
    const email = String(form.get("email") ?? "")
        .trim()
        .toLowerCase();
    const password = String(form.get("password") ?? "");
    const next = safeReturnPath(form.get("next"));
    const supabase = locals.supabase;

    if (!supabase || !email || !password) {
        return redirectWithAuthError(request, "invalid-login", "login", next);
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirectWithAuthError(request, "invalid-login", "login", next);
    }

    return Response.redirect(new URL(next, request.url), 303);
};
