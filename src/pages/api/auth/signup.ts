import type { APIRoute } from "astro";
import {
    ANALYTICS_POLICY_VERSION,
    isSameOriginRequest,
    redirectWithAuthError,
    safeReturnPath,
} from "../../../lib/auth";

export const POST: APIRoute = async ({ request, locals }) => {
    if (!isSameOriginRequest(request)) {
        return new Response("Ugyldig forespørgsel.", { status: 403 });
    }

    const form = await request.formData();
    const firstName = String(form.get("first_name") ?? "").trim();
    const postalCode = String(form.get("postal_code") ?? "").trim();
    const email = String(form.get("email") ?? "")
        .trim()
        .toLowerCase();
    const password = String(form.get("password") ?? "");
    const ageConfirmed = form.get("age_confirmed") === "on";
    const analyticsGranted = form.get("analytics_consent") === "on";
    const next = safeReturnPath(form.get("next"));

    if (
        !firstName ||
        firstName.length > 80 ||
        !/^\d{4}$/.test(postalCode) ||
        !email.includes("@") ||
        password.length < 8 ||
        !ageConfirmed
    ) {
        return redirectWithAuthError(request, "invalid-signup", "signup", next);
    }

    const supabase = locals.supabase;
    if (!supabase) {
        return redirectWithAuthError(request, "service", "signup", next);
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { first_name: firstName },
        },
    });

    if (error) {
        return redirectWithAuthError(request, "signup-failed", "signup", next);
    }

    if (!data.session || !data.user) {
        return redirectWithAuthError(
            request,
            data.user?.identities?.length === 0
                ? "email-in-use"
                : "confirmation-enabled",
            "signup",
            next,
        );
    }

    const { error: profileError } = await supabase.from("profiles").upsert(
        {
            id: data.user.id,
            first_name: firstName,
            full_name: firstName,
            email,
            postal_code: postalCode,
            age_confirmed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
    );

    if (profileError) {
        await supabase.auth.signOut({ scope: "local" });
        return redirectWithAuthError(request, "profile-failed", "signup", next);
    }

    const { error: consentError } = await supabase
        .from("consent_events")
        .insert({
            user_id: data.user.id,
            purpose: "product_analytics",
            status: analyticsGranted ? "granted" : "declined",
            policy_version: ANALYTICS_POLICY_VERSION,
            source: "signup",
        });

    if (consentError) {
        await supabase.auth.signOut({ scope: "local" });
        return redirectWithAuthError(request, "consent-failed", "signup", next);
    }

    return Response.redirect(new URL(next, request.url), 303);
};
