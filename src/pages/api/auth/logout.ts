import type { APIRoute } from "astro";
import { isSameOriginRequest, safeReturnPath } from "../../../lib/auth";

export const POST: APIRoute = async ({ request, locals }) => {
    if (!isSameOriginRequest(request)) {
        return new Response("Ugyldig forespørgsel.", { status: 403 });
    }

    const form = await request.formData();
    const returnTo = safeReturnPath(form.get("return_to"), "/Auth");
    await locals.supabase?.auth.signOut({ scope: "local" });
    return Response.redirect(new URL(returnTo, request.url), 303);
};
