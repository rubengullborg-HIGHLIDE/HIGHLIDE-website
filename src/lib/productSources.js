const kaufmannStoreLabels = {
    "bruuns-galleri": "Bruuns Galleri",
    "aarhus-c": "Strøget",
    "storcenter-nord": "Storcenter Nord",
};

const romerhusStoreLabels = {
    "romerhus-aarhus": "Rømerhus",
};

const lakorStoreLabels = {
    "lakor-aarhus": "LAKOR Aarhus",
};

const rainsStoreLabels = {
    "rains-aarhus": "Rains Aarhus, Klostertorv",
};

const stoyStoreLabels = {
    "stoy-aarhus": "STOY Aarhus",
};

const shoeChapterStoreLabels = {
    "shoechapter-aarhus": "Shoe Chapter Aarhus",
};

const skagenClothingStoreLabels = {
    "skagen-aarhus": "Skagen Clothing Aarhus",
};

const suitClubStoreLabels = {
    "suitclub-aarhus": "SUIT CLUB Aarhus",
};

const cejfStoreLabels = {
    "cejf-aarhus": "Ćejf Aarhus",
};

const withSharedProductSchema = (source) => ({
    variantGroupColumn: "source_parent_id",
    allowUnavailableDetails: true,
    ...source,
});

export const productSources = [
    {
        key: "kaufmann",
        table: "kaufmann_products",
        storeName: "Kaufmann",
        overviewSelect:
            "id, name, brand, current_price, list_price, currency, color, category, images, aarhus_total_stock, aarhus_available",
        detailSelect: "*",
        searchColumns: ["name", "brand", "color", "category"],
        orderColumn: "id",
        storeLabels: kaufmannStoreLabels,
        aarhusStoreKey: null,
        inventoryColumn: "aarhus_inventory",
        applyAvailableFilter: (query) => query.eq("aarhus_available", true),
    },
    {
        key: "romerhus",
        table: "romerhus_products",
        storeName: "Rømerhus",
        overviewSelect:
            "id, name, brand, current_price, list_price, currency, color, category, images, aarhus_total_stock, aarhus_available",
        detailSelect: "*",
        searchColumns: ["name", "brand", "color", "category"],
        orderColumn: "id",
        storeLabels: romerhusStoreLabels,
        aarhusStoreKey: "romerhus-aarhus",
        inventoryColumn: "local_inventory",
        applyAvailableFilter: (query) => query.eq("aarhus_available", true),
    },
    {
        key: "lakor",
        table: "lakor_products",
        storeName: "LAKOR",
        overviewSelect:
            "id, name, brand, current_price, list_price, currency, color, category, images, local_inventory, aarhus_available",
        detailSelect: "*",
        searchColumns: ["name", "brand", "color", "category"],
        orderColumn: "id",
        storeLabels: lakorStoreLabels,
        aarhusStoreKey: "lakor-aarhus",
        inventoryColumn: "local_inventory",
        applyAvailableFilter: (query) => query.eq("aarhus_available", true),
    },
    {
        key: "rains",
        table: "rains_products",
        storeName: "Rains",
        overviewSelect:
            "id, name, brand, current_price, list_price, currency, color, category, images, aarhus_total_stock, aarhus_available",
        detailSelect: "*",
        searchColumns: ["name", "brand", "color", "category", "product_type"],
        orderColumn: "id",
        storeLabels: rainsStoreLabels,
        aarhusStoreKey: "rains-aarhus",
        inventoryColumn: "local_inventory",
        applyAvailableFilter: (query) => query.eq("aarhus_available", true),
    },
    {
        key: "stoy",
        table: "stoy_products",
        storeName: "STOY",
        overviewSelect:
            "id, name, brand, current_price, list_price, currency, color, category, images, local_inventory, aarhus_available",
        detailSelect: "*",
        searchColumns: ["name", "brand", "color", "category", "product_type"],
        orderColumn: "id",
        storeLabels: stoyStoreLabels,
        aarhusStoreKey: "stoy-aarhus",
        inventoryColumn: "local_inventory",
        applyAvailableFilter: (query) => query.eq("aarhus_available", true),
    },
    {
        key: "shoechapter",
        table: "shoechapter_products",
        storeName: "Shoe Chapter",
        overviewSelect:
            "id, name, brand, current_price, list_price, currency, color, category, images, local_inventory, aarhus_available",
        detailSelect: "*",
        searchColumns: ["name", "brand", "color", "category", "product_type"],
        orderColumn: "id",
        storeLabels: shoeChapterStoreLabels,
        aarhusStoreKey: "shoechapter-aarhus",
        inventoryColumn: "local_inventory",
        applyAvailableFilter: (query) => query.eq("aarhus_available", true),
    },
    {
        key: "skagen-clothing",
        table: "skagen_clothing_products",
        storeName: "Skagen Clothing",
        overviewSelect:
            "id, name, brand, current_price, list_price, currency, color, category, images, local_inventory, aarhus_available",
        detailSelect: "*",
        searchColumns: ["name", "brand", "color", "category", "product_type"],
        orderColumn: "id",
        storeLabels: skagenClothingStoreLabels,
        aarhusStoreKey: "skagen-aarhus",
        inventoryColumn: "local_inventory",
        applyAvailableFilter: (query) => query.eq("aarhus_available", true),
    },
    {
        key: "suitclub",
        table: "suitclub_products",
        storeName: "SUIT CLUB",
        overviewSelect:
            "id, name, brand, current_price, list_price, currency, color, category, images, local_inventory, aarhus_available",
        detailSelect: "*",
        searchColumns: ["name", "brand", "color", "category", "product_type"],
        orderColumn: "id",
        storeLabels: suitClubStoreLabels,
        aarhusStoreKey: "suitclub-aarhus",
        inventoryColumn: "local_inventory",
        variantGroupColumn: null,
        applyAvailableFilter: (query) => query.eq("aarhus_available", true),
    },
    {
        key: "cejf",
        table: "cejf_products",
        storeName: "Ćejf",
        overviewSelect:
            "id, name, brand, current_price, list_price, currency, color, category, images, local_inventory, aarhus_available",
        detailSelect: "*",
        searchColumns: ["name", "brand", "color", "category"],
        orderColumn: "id",
        storeLabels: cejfStoreLabels,
        aarhusStoreKey: "cejf-aarhus",
        inventoryColumn: "local_inventory",
        variantGroupColumn: null,
        applyAvailableFilter: (query) => query.eq("aarhus_available", true),
    },
].map(withSharedProductSchema);

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

const getKnownStock = (value) => {
    if (value == null || value === "") return null;

    const stock = Number(value);
    return Number.isFinite(stock) ? stock : null;
};

export const getAarhusTotalStock = (product, source) => {
    const directStock = getKnownStock(product.aarhus_total_stock);
    if (directStock === 0 && product.aarhus_available === true) return null;
    if (directStock != null) return directStock;
    if (!source.aarhusStoreKey) return null;

    return getKnownStock(
        product[source.inventoryColumn]?.stores?.[source.aarhusStoreKey]
            ?.total_stock,
    );
};

export const mapOverviewProduct = (product, source, fallbackImage) => ({
    id: product.id,
    sourceKey: source.key,
    brand: product.brand || "Ukendt brand",
    name: getSourceProductName(product),
    price: getProductPrice(product),
    listPrice: product.list_price,
    currency: product.currency || "DKK",
    store: source.storeName,
    category: product.category ?? product.product_type ?? null,
    detail: product.color || product.category || "Produkt",
    image: getFirstImage(product.images, fallbackImage),
    stock: getAarhusTotalStock(product, source),
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
    aarhusTotalStock: getAarhusTotalStock(product, source),
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
