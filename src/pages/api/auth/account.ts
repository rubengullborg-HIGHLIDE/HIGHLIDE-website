import type { APIRoute } from "astro";
import { isSameOriginRequest } from "../../../lib/auth";

const redirectToProfile = (request: Request, result: string) => {
    const url = new URL("/Profil", request.url);
    url.searchParams.set("account", result);
    return Response.redirect(url, 303);
};

export const POST: APIRoute = async ({ request, locals }) => {
    if (!isSameOriginRequest(request)) {
        return new Response("Ugyldig forespørgsel.", { status: 403 });
    }

    const user = locals.user;
    const supabase = locals.supabase;
    if (!user || !supabase) {
        return Response.redirect(new URL("/Auth?mode=login", request.url), 303);
    }

    const form = await request.formData();
    const action = form.get("action");

    if (action === "email") {
        const email = String(form.get("email") ?? "")
            .trim()
            .toLowerCase();

        if (!email || email.length > 254 || !email.includes("@")) {
            return redirectToProfile(request, "email-invalid");
        }

        const { data, error } = await supabase.auth.updateUser({ email });

        if (error) {
            return redirectToProfile(
                request,
                error.code === "email_exists" || error.code === "user_already_exists"
                    ? "email-exists"
                    : "email-error",
            );
        }

        const emailIsPending =
            data.user?.new_email === email && data.user.email !== email;

        if (!emailIsPending && data.user?.email === email) {
            await supabase
                .from("profiles")
                .update({
                    email,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);
        }

        return redirectToProfile(
            request,
            emailIsPending ? "email-pending" : "email-updated",
        );
    }

    if (action === "password") {
        const currentPassword = String(form.get("current_password") ?? "");
        const newPassword = String(form.get("new_password") ?? "");
        const confirmedPassword = String(form.get("confirm_password") ?? "");

        if (
            !currentPassword ||
            newPassword.length < 8 ||
            newPassword !== confirmedPassword
        ) {
            return redirectToProfile(request, "password-invalid");
        }

        const { error } = await supabase.auth.updateUser({
            current_password: currentPassword,
            password: newPassword,
        });

        if (error) {
            const reauthenticationRequired =
                error.code === "reauth_nonce_missing" ||
                error.code === "reauthentication_needed" ||
                error.code === "reauthentication_not_valid";

            return redirectToProfile(
                request,
                reauthenticationRequired
                    ? "password-reauth"
                    : "password-error",
            );
        }

        return redirectToProfile(request, "password-updated");
    }

    return new Response("Ugyldig kontohandling.", { status: 400 });
};
