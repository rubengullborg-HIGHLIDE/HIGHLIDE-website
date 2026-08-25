const storeIntentStorageKey = "highlide-store-intent-context";

const cleanString = (value) => {
    if (value == null) return null;

    const cleaned = String(value).trim();
    return cleaned || null;
};

export const getProductAnalyticsProperties = (product = {}) => ({
    product_id: cleanString(product.id),
    product_key:
        cleanString(product.sourceKey) && cleanString(product.id)
            ? `${product.sourceKey}:${product.id}`
            : null,
    retailer_id: cleanString(product.sourceKey),
    retailer_name: cleanString(
        product.store ?? product.sourceName ?? product.retailer_name,
    ),
    brand: cleanString(product.brand),
    category: cleanString(product.category ?? product.product_type),
});

export const captureAnalyticsEvent = (eventName, properties = {}) => {
    if (!window.posthog) return false;

    window.posthog.capture(eventName, properties);
    return true;
};

export const setStoreIntentContext = (product) => {
    try {
        window.sessionStorage.setItem(
            storeIntentStorageKey,
            JSON.stringify(getProductAnalyticsProperties(product)),
        );
    } catch {
        // Store navigation still works when browser storage is unavailable.
    }
};

export const getStoreIntentContext = (storeKey) => {
    try {
        const stored = JSON.parse(
            window.sessionStorage.getItem(storeIntentStorageKey) ?? "null",
        );

        if (!stored || stored.retailer_id !== storeKey) return {};
        return stored;
    } catch {
        return {};
    }
};
