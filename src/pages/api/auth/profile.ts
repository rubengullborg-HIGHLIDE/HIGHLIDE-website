import type { APIRoute } from "astro";
import { isSameOriginRequest } from "../../../lib/auth";

export const POST: APIRoute = async ({ request, locals }) => {
    if (!isSameOriginRequest(request)) {
        return new Response("Ugyldig forespørgsel.", { status: 403 });
    }

    const user = locals.user;
    const supabase = locals.supabase;
    if (!user || !supabase) {
        return Response.redirect(new URL("/Auth", request.url), 303);
    }

    const form = await request.formData();
    const firstName = String(form.get("first_name") ?? "").trim();
    const postalCode = String(form.get("postal_code") ?? "").trim();
    const resultUrl = new URL("/Profil", request.url);

    if (!firstName || firstName.length > 80 || !/^\d{4}$/.test(postalCode)) {
        resultUrl.searchParams.set("profile", "invalid");
        return Response.redirect(resultUrl, 303);
    }

    const { data, error } = await supabase
        .from("profiles")
        .update({
            first_name: firstName,
            full_name: firstName,
            postal_code: postalCode,
            updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select("id")
        .maybeSingle();

    resultUrl.searchParams.set("profile", error || !data ? "error" : "updated");
    return Response.redirect(resultUrl, 303);
};
