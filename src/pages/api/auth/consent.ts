import type { APIRoute } from "astro";
import {
    ANALYTICS_POLICY_VERSION,
    isSameOriginRequest,
    safeReturnPath,
} from "../../../lib/auth";

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
    const decision = form.get("decision");
    const source = form.get("source");
    const returnTo = safeReturnPath(form.get("return_to"), "/Profil");

    if (
        (decision !== "granted" && decision !== "withdrawn") ||
        (source !== "profile_settings" && source !== "privacy_settings")
    ) {
        return new Response("Ugyldigt samtykkevalg.", { status: 400 });
    }

    const { error } = await supabase.from("consent_events").insert({
        user_id: user.id,
        purpose: "product_analytics",
        status: decision,
        policy_version: ANALYTICS_POLICY_VERSION,
        source,
    });

    const url = new URL(returnTo, request.url);
    url.searchParams.set("consent", error ? "error" : decision);
    return Response.redirect(url, 303);
};
