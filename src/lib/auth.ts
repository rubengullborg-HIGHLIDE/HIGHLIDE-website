export const ANALYTICS_POLICY_VERSION = "2026-08-26-v1";

export const safeReturnPath = (
    value: FormDataEntryValue | string | null | undefined,
    fallback = "/",
) => {
    if (typeof value !== "string") return fallback;
    if (!value.startsWith("/") || value.startsWith("//")) return fallback;
    if (value.startsWith("/Auth") || value.startsWith("/api/")) {
        return fallback;
    }
    return value;
};

export const isSameOriginRequest = (request: Request) => {
    const origin = request.headers.get("origin");
    if (!origin) return true;
    return origin === new URL(request.url).origin;
};

export const redirectWithAuthError = (
    request: Request,
    error: string,
    mode: "signup" | "login",
    next = "/",
) => {
    const url = new URL("/Auth", request.url);
    url.searchParams.set("mode", mode);
    url.searchParams.set("error", error);
    if (next !== "/") url.searchParams.set("next", next);
    return Response.redirect(url, 303);
};
