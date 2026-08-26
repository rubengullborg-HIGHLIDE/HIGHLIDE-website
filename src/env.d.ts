/// <reference path="../.astro/types.d.ts" />

import type { SupabaseClient } from "@supabase/supabase-js";

declare global {
    interface Window {
        posthog?: typeof import("posthog-js").default;
        __highlideAnalytics?: {
            userId: string | null;
            analyticsConsent: boolean;
        };
    }

    namespace App {
        interface Locals {
            supabase?: SupabaseClient;
            user: {
                id: string;
                email: string | null;
            } | null;
            analyticsConsent: "granted" | "declined" | "withdrawn" | null;
        }
    }
}

export {};
