const kaufmannStoreLabels = {
    "bruuns-galleri": "Bruuns Galleri",
    "aarhus-c": "Strøget",
    "storcenter-nord": "Storcenter Nord",
};

const romerhusStoreLabels = {
    "romerhus-aarhus": "Rømerhus",
};

export const productSources = [
    {
        key: "kaufmann",
        table: "kaufmann_products",
        storeName: "Kaufmann",
        overviewSelect:
            "id, name, brand, current_price, currency, color, category, images, aarhus_total_stock, aarhus_available",
        detailSelect: "*",
        searchColumns: ["name", "brand", "color", "category"],
        orderColumn: "id",
        storeLabels: kaufmannStoreLabels,
        inventoryColumn: "aarhus_inventory",
        applyAvailableFilter: (query) => query.eq("aarhus_available", true),
    },
    {
        key: "romerhus",
        table: "romerhus_products",
        storeName: "Rømerhus",
        overviewSelect:
            "id, name, brand, current_price, currency, color, category, images, aarhus_total_stock, aarhus_available",
        detailSelect: "*",
        searchColumns: ["name", "brand", "color", "category"],
        orderColumn: "id",
        storeLabels: romerhusStoreLabels,
        inventoryColumn: "local_inventory",
        applyAvailableFilter: (query) => query.eq("aarhus_available", true),
    },
];

export const defaultProductSource = productSources[0];

export const getProductSource = (sourceKey) =>
    productSources.find((source) => source.key === sourceKey) ??
    defaultProductSource;

export const getProductHref = (product) => {
    const source = encodeURIComponent(product.sourceKey);
    const id = encodeURIComponent(product.id);

    return `/Produkt-detaljer?source=${source}&id=${id}`;
};

export const getFirstImage = (images, fallbackImage) => {
    if (!Array.isArray(images)) return fallbackImage;

    return (
        images.find((item) => typeof item === "string" && item.trim()) ??
        fallbackImage
    );
};

export const getProductPrice = (product) =>
    product.current_price ?? product.pris ?? product.price;

export const getProductUrl = (product) =>
    product.canonical_url ?? product.source_url ?? product.product_url ?? product.url;

export const getSourceProductName = (product) =>
    product.name ?? product.navn ?? "Produkt";

export const mapOverviewProduct = (product, source, fallbackImage) => ({
    id: product.id,
    sourceKey: source.key,
    brand: product.brand || "Ukendt brand",
    name: getSourceProductName(product),
    price: getProductPrice(product),
    currency: product.currency || "DKK",
    store: source.storeName,
    detail: product.color || product.category || "Produkt",
    image: getFirstImage(product.images, fallbackImage),
    stock: product.aarhus_total_stock,
});

export const normalizeDetailProduct = (product, source) => ({
    ...product,
    sourceKey: source.key,
    sourceName: source.storeName,
    name: getSourceProductName(product),
    price: getProductPrice(product),
    store: source.storeName,
    product_url: getProductUrl(product),
    sizes: product.webshop_sizes ?? product.sizes,
    aarhusTotalStock: product.aarhus_total_stock,
    aarhusInventory: product[source.inventoryColumn] ?? product.aarhus_inventory,
});

export const applyProductSearch = (query, source, searchQuery) => {
    const searchTerm = String(searchQuery ?? "")
        .trim()
        .replace(/[,%()]/g, " ")
        .replace(/\s+/g, " ");

    if (!searchTerm) return query;

    return query.or(
        source.searchColumns
            .map((column) => `${column}.ilike.%${searchTerm}%`)
            .join(","),
    );
};
