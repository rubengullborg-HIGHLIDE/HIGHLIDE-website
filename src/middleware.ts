import { defineMiddleware } from "astro:middleware";
import { safeReturnPath } from "./lib/auth";
import { createSupabaseServerClient } from "./lib/supabaseServer";

const publicAssets = [
    "/_astro/",
    "/icons/",
    "/images/",
    "/logos/",
];

const publicFiles = new Set([
    "/favicon.png",
    "/HIGHLIDE_logo_dark.png",
    "/robots.txt",
]);

const publicPages = new Set(["/Auth", "/Privatlivspolitik"]);
const publicAuthEndpoints = new Set([
    "/api/auth/login",
    "/api/auth/signup",
]);

export const onRequest = defineMiddleware(async (context, next) => {
    const rawPathname = context.url.pathname;
    const pathname =
        rawPathname === "/" ? "/" : rawPathname.replace(/\/+$/, "");
    const { search } = context.url;

    if (
        publicFiles.has(pathname) ||
        publicAssets.some((prefix) => pathname.startsWith(prefix))
    ) {
        return next();
    }

    const supabase = createSupabaseServerClient(
        context.request,
        context.cookies,
    );
    context.locals.supabase = supabase;
    context.locals.user = null;
    context.locals.analyticsConsent = null;

    const { data: claimsData } = await supabase.auth.getClaims();
    const claims = claimsData?.claims;
    const userId = claims?.sub;

    if (typeof userId === "string") {
        const email = claims?.email;
        context.locals.user = {
            id: userId,
            email: typeof email === "string" ? email : null,
        };

        const { data: consent } = await supabase
            .from("consent_events")
            .select("status")
            .eq("user_id", userId)
            .eq("purpose", "product_analytics")
            .order("occurred_at", { ascending: false })
            .order("id", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (
            consent?.status === "granted" ||
            consent?.status === "declined" ||
            consent?.status === "withdrawn"
        ) {
            context.locals.analyticsConsent = consent.status;
        }
    }

    if (pathname === "/Auth" && context.locals.user) {
        return context.redirect(
            safeReturnPath(context.url.searchParams.get("next")),
            303,
        );
    }

    if (
        !context.locals.user &&
        !publicPages.has(pathname) &&
        !publicAuthEndpoints.has(pathname)
    ) {
        const authUrl = new URL("/Auth", context.url);
        authUrl.searchParams.set("next", `${rawPathname}${search}`);
        return context.redirect(authUrl.toString(), 303);
    }

    const response = await next();
    if (publicFiles.has(pathname)) {
        return response;
    }

    // Redirect responses use immutable Fetch headers in Node/Undici. Clone the
    // response before adding our cache policy so auth redirects remain valid.
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "private, no-store");

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
});
