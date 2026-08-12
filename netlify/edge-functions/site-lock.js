const COOKIE_NAME = "__Host-highlide_test_access";
const COOKIE_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_PAYLOAD = "highlide-test-access-v1";
const encoder = new TextEncoder();

const securityHeaders = {
    "cache-control": "no-store, max-age=0",
    "content-security-policy":
        "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
    "content-type": "text/html; charset=utf-8",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    "referrer-policy": "no-referrer",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "x-robots-tag": "noindex, nofollow, noarchive",
};

const toBase64Url = (bytes) => {
    let binary = "";

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary)
        .replaceAll("+", "-")
        .replaceAll("/", "_")
        .replaceAll("=", "");
};

const digest = async (value) =>
    new Uint8Array(
        await crypto.subtle.digest("SHA-256", encoder.encode(value)),
    );

const signaturesMatch = (left, right) => {
    if (left.length !== right.length) return false;

    let difference = 0;

    for (let index = 0; index < left.length; index += 1) {
        difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
    }

    return difference === 0;
};

const passwordsMatch = async (submitted, expected) => {
    const [submittedDigest, expectedDigest] = await Promise.all([
        digest(submitted),
        digest(expected),
    ]);

    let difference = 0;

    for (let index = 0; index < expectedDigest.length; index += 1) {
        difference |= submittedDigest[index] ^ expectedDigest[index];
    }

    return difference === 0;
};

const createSessionSignature = async (secret) => {
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );
    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(SESSION_PAYLOAD),
    );

    return toBase64Url(new Uint8Array(signature));
};

const renderGate = ({ invalid = false, configurationError = false } = {}) => `<!doctype html>
<html lang="da">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="robots" content="noindex,nofollow,noarchive" />
        <title>Testadgang | HIGHLIDE</title>
        <style>
            :root {
                color-scheme: light;
                font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                background: #420e0e;
                color: #1e1a17;
            }

            * { box-sizing: border-box; }

            html, body {
                width: 100%;
                height: 100%;
                margin: 0;
                overflow: hidden;
                overscroll-behavior: none;
            }

            body {
                position: fixed;
                inset: 0;
                background: #420e0e;
            }

            .gate {
                position: relative;
                isolation: isolate;
                display: grid;
                width: 100%;
                height: 100svh;
                place-items: center;
                overflow: hidden;
                padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
                background:
                    radial-gradient(circle at 50% 38%, rgba(152, 49, 43, 0.58), transparent 32rem),
                    linear-gradient(145deg, #5b1716 0%, #420e0e 56%, #2b0808 100%);
            }

            .route {
                position: absolute;
                inset: 0;
                z-index: -2;
                width: 100%;
                height: 100%;
                color: rgba(255, 250, 241, 0.2);
                pointer-events: none;
            }

            .city {
                position: absolute;
                right: 0;
                bottom: -0.16em;
                left: 0;
                z-index: -1;
                color: transparent;
                font-size: clamp(7.5rem, 24vw, 22rem);
                font-weight: 900;
                line-height: 1;
                letter-spacing: -0.04em;
                text-align: center;
                white-space: nowrap;
                -webkit-text-stroke: 1px rgba(255, 250, 241, 0.14);
                user-select: none;
            }

            .panel {
                width: min(100%, 384px);
                max-height: calc(100svh - 32px);
                overflow: auto;
                padding: 24px;
                background: #fffaf1;
                box-shadow: 10px 10px 0 rgba(22, 3, 3, 0.34);
            }

            .logo {
                margin: 0 0 28px;
                font-size: 1.35rem;
                font-weight: 900;
                letter-spacing: -0.04em;
            }

            h1 {
                margin: 0 0 12px;
                font-size: 1.5rem;
                line-height: 1.2;
            }

            .intro {
                margin: 0 0 24px;
                color: #554c43;
                font-size: 0.875rem;
                line-height: 1.65;
            }

            label {
                display: block;
                margin-bottom: 8px;
                font-size: 0.875rem;
                font-weight: 600;
            }

            input, button {
                width: 100%;
                height: 48px;
                border-radius: 0;
                font: inherit;
            }

            input {
                border: 1px solid rgba(30, 26, 23, 0.28);
                padding: 0 12px;
                background: white;
                color: #1e1a17;
                font-size: 1rem;
                outline: none;
            }

            input::placeholder { color: #6f655b; }
            input:focus { border-color: #1e1a17; box-shadow: 0 0 0 1px #1e1a17; }

            .error {
                margin: 10px 0 0;
                color: #8f1d1d;
                font-size: 0.875rem;
                font-weight: 600;
            }

            button {
                margin-top: 16px;
                border: 0;
                background: #1e1a17;
                color: white;
                font-size: 0.875rem;
                font-weight: 700;
                cursor: pointer;
            }

            button:hover { background: #352e28; }
            button:focus-visible { outline: 2px solid #1e1a17; outline-offset: 3px; }

            @supports (height: 100dvh) {
                .gate { height: 100dvh; }
                .panel { max-height: calc(100dvh - 32px); }
            }

            @media (max-height: 560px) {
                .panel { padding: 20px; }
                .logo { margin-bottom: 16px; }
                .intro { margin-bottom: 16px; }
            }
        </style>
    </head>
    <body>
        <main class="gate">
            <svg class="route" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none" aria-hidden="true">
                <path d="M-80 180C176 75 332 112 445 254C558 396 506 559 682 643C858 727 1010 611 1034 449C1058 287 1184 203 1520 250" stroke="currentColor" stroke-width="2" />
                <circle cx="445" cy="254" r="7" fill="currentColor" />
                <circle cx="1034" cy="449" r="7" fill="currentColor" />
            </svg>
            <div class="city" aria-hidden="true">AARHUS</div>
            <section class="panel" aria-labelledby="access-title">
                <p class="logo">HIGHLIDE</p>
                <h1 id="access-title">${configurationError ? "Adgang er ikke konfigureret" : "Testadgang"}</h1>
                <p class="intro">${configurationError ? "Testsiden er låst, men mangler sin adgangskode i Netlify." : "HIGHLIDE er midlertidigt lukket for offentlig adgang. Indtast testkoden for at fortsætte."}</p>
                ${configurationError ? "" : `<form method="post">
                    <label for="access-password">Kodeord</label>
                    <input id="access-password" name="password" type="password" autocomplete="current-password" placeholder="Indtast kodeord" required autofocus ${invalid ? 'aria-invalid="true" aria-describedby="access-error"' : ""} />
                    ${invalid ? '<p class="error" id="access-error" role="alert">Koden er ikke korrekt.</p>' : ""}
                    <button type="submit">Fortsæt</button>
                </form>`}
            </section>
        </main>
    </body>
</html>`;

const gateResponse = (options = {}, status = 401) =>
    new Response(renderGate(options), {
        status,
        headers: securityHeaders,
    });

export default async (request, context) => {
    if (Netlify.env.get("SITE_LOCK_ENABLED") === "false") {
        return;
    }

    const password = Netlify.env.get("SITE_LOCK_PASSWORD");
    const secret = Netlify.env.get("SITE_LOCK_SECRET");

    if (!password || !secret) {
        return gateResponse({ configurationError: true }, 503);
    }

    const expectedSignature = await createSessionSignature(secret);
    const sessionCookie = context.cookies.get(COOKIE_NAME);

    if (
        sessionCookie &&
        signaturesMatch(sessionCookie, expectedSignature)
    ) {
        return;
    }

    if (request.method === "POST") {
        const formData = await request.formData();
        const submittedPassword = formData.get("password");

        if (
            typeof submittedPassword === "string" &&
            await passwordsMatch(submittedPassword.trim(), password)
        ) {
            context.cookies.set({
                name: COOKIE_NAME,
                value: expectedSignature,
                path: "/",
                secure: true,
                httpOnly: true,
                sameSite: "Strict",
                expires: new Date(Date.now() + COOKIE_LIFETIME_MS),
            });

            return new Response(null, {
                status: 303,
                headers: {
                    location: request.url,
                    "cache-control": "no-store, max-age=0",
                    "x-robots-tag": "noindex, nofollow, noarchive",
                },
            });
        }

        return gateResponse({ invalid: true });
    }

    return gateResponse();
};
