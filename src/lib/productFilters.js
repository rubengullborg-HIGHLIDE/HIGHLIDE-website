export const productFilterParams = {
    stores: "butik",
    types: "type",
    brands: "brand",
    colors: "farve",
    fits: "fit",
    minPrice: "prisFra",
    maxPrice: "prisTil",
    onSale: "udsalg",
    newProducts: "nyheder",
    sort: "sortering",
};

export const productFilterParamNames = Object.values(productFilterParams);

export const defaultProductSort = "standard";
export const newProductsWindowInDays = 14;

export const productSortOptions = [
    { value: defaultProductSort, label: "Standard" },
    { value: "price-asc", label: "Pris: lav til høj" },
    { value: "price-desc", label: "Pris: høj til lav" },
    { value: "name-asc", label: "Navn: A–Å" },
    { value: "brand-asc", label: "Brand: A–Å" },
];

const productSortOrders = {
    [defaultProductSort]: [{ column: "id", ascending: true }],
    "price-asc": [
        { column: "current_price", ascending: true },
        { column: "id", ascending: true },
    ],
    "price-desc": [
        { column: "current_price", ascending: false },
        { column: "id", ascending: true },
    ],
    "name-asc": [
        { column: "name", ascending: true },
        { column: "id", ascending: true },
    ],
    "brand-asc": [
        { column: "brand", ascending: true },
        { column: "name", ascending: true },
        { column: "id", ascending: true },
    ],
};

export const clothingTypeOptions = [
    {
        value: "t-shirts",
        label: "T-shirts",
        predicates: ["category.ilike.*T-Shirt*", "name.ilike.*T-Shirt*"],
    },
    {
        value: "skjorter",
        label: "Skjorter",
        predicates: [
            "category.ilike.Shirt",
            "category.ilike.Shirts",
            "name.ilike.* Shirt*",
        ],
    },
    {
        value: "poloer",
        label: "Poloer",
        predicates: ["category.ilike.*Polo*", "name.ilike.*Polo*"],
    },
    {
        value: "strik",
        label: "Strik",
        predicates: [
            "category.ilike.*Pullover*",
            "name.ilike.*Pullover*",
            "name.ilike.*Knit*",
        ],
    },
    {
        value: "sweatshirts",
        label: "Sweatshirts",
        predicates: [
            "category.ilike.*Sweat*",
            "name.ilike.*Sweat*",
            "name.ilike.*Hoodie*",
        ],
    },
    {
        value: "jakker",
        label: "Jakker",
        predicates: ["category.ilike.*Jacket*", "name.ilike.*Jacket*"],
    },
    {
        value: "blazere",
        label: "Blazere",
        predicates: ["category.ilike.*Blazer*", "name.ilike.*Blazer*"],
    },
    {
        value: "bukser",
        label: "Bukser",
        predicates: [
            "category.ilike.Pants",
            "category.ilike.Trousers",
            "name.ilike.*Pants*",
            "name.ilike.*Trousers*",
        ],
    },
    {
        value: "jeans",
        label: "Jeans",
        predicates: ["category.ilike.Jeans", "name.ilike.*Jeans*"],
    },
    {
        value: "shorts",
        label: "Shorts",
        predicates: ["category.ilike.Shorts", "name.ilike.*Shorts*"],
    },
    {
        value: "veste",
        label: "Veste",
        predicates: [
            "category.ilike.Waistcoat",
            "name.ilike.*Waistcoat*",
            "name.ilike.*Vest*",
        ],
    },
    {
        value: "sko",
        label: "Sko",
        predicates: [
            "category.ilike.*Shoe*",
            "category.ilike.*Sneaker*",
            "category.ilike.*Boot*",
            "name.ilike.*Shoe*",
            "name.ilike.*Sneaker*",
            "name.ilike.*Boot*",
        ],
    },
];

const getAllUnique = (params, name) => [
    ...new Set(
        params
            .getAll(name)
            .map((value) => value.trim())
            .filter(Boolean),
    ),
];

const parsePrice = (value) => {
    if (value == null || value === "") return null;
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
};

const parseSort = (value) =>
    Object.hasOwn(productSortOrders, value) ? value : defaultProductSort;

export const parseProductFilters = (params) => ({
    stores: getAllUnique(params, productFilterParams.stores),
    types: getAllUnique(params, productFilterParams.types),
    brands: getAllUnique(params, productFilterParams.brands),
    colors: getAllUnique(params, productFilterParams.colors),
    fits: getAllUnique(params, productFilterParams.fits),
    minPrice: parsePrice(params.get(productFilterParams.minPrice)),
    maxPrice: parsePrice(params.get(productFilterParams.maxPrice)),
    onSale: ["true", "1", "on"].includes(
        String(params.get(productFilterParams.onSale) ?? "").toLowerCase(),
    ),
    newProducts: ["true", "1", "on"].includes(
        String(params.get(productFilterParams.newProducts) ?? "").toLowerCase(),
    ),
    sort: parseSort(params.get(productFilterParams.sort)),
});

export const getNewProductsCutoffIso = (now = new Date()) =>
    new Date(
        now.getTime() - newProductsWindowInDays * 24 * 60 * 60 * 1000,
    ).toISOString();

export const getActiveFilterCount = (filters) =>
    filters.stores.length +
    filters.types.length +
    filters.brands.length +
    filters.colors.length +
    filters.fits.length +
    Number(filters.minPrice != null) +
    Number(filters.maxPrice != null) +
    Number(filters.onSale) +
    Number(filters.newProducts) +
    Number(filters.sort !== defaultProductSort);

export const getProductSort = (sort, filters = {}) => {
    if (filters.newProducts) {
        return [
            { column: "first_seen_at", ascending: false },
            { column: "id", ascending: false },
        ];
    }

    return (
        productSortOrders[parseSort(sort)] ??
        productSortOrders[defaultProductSort]
    );
};

export const applyProductSort = (query, sort, filters = {}) =>
    getProductSort(sort, filters).reduce(
        (currentQuery, order) =>
            currentQuery.order(order.column, {
                ascending: order.ascending,
                nullsFirst: false,
            }),
        query,
    );

export const getProductSourcesForFilters = (sources, filters) => {
    if (filters.stores.length === 0) return sources;

    return sources.filter((source) => filters.stores.includes(source.key));
};

export const applyProductFilters = (query, filters, options = {}) => {
    if (filters.types.length > 0) {
        const predicates = clothingTypeOptions
            .filter((option) => filters.types.includes(option.value))
            .flatMap((option) => option.predicates);

        if (predicates.length > 0) query = query.or(predicates.join(","));
    }

    if (filters.brands.length > 0) {
        query = query.in("brand", filters.brands);
    }

    if (filters.colors.length > 0) {
        query = query.in("color_group", filters.colors);
    }

    if (filters.fits.length > 0) {
        query = query.in("fit", filters.fits);
    }

    if (filters.minPrice != null) {
        query = query.gte("current_price", filters.minPrice);
    }

    if (filters.maxPrice != null) {
        query = query.lte("current_price", filters.maxPrice);
    }

    if (filters.onSale) {
        query = query.not("list_price", "is", null);
    }

    if (filters.newProducts) {
        query = query
            .eq("publication_status", "active")
            .gte("first_seen_at", getNewProductsCutoffIso(options.now));
    }

    return query;
};
