export const productFilterParams = {
    stores: "butik",
    types: "type",
    brands: "brand",
    colors: "farve",
    fits: "fit",
    minPrice: "prisFra",
    maxPrice: "prisTil",
};

export const productFilterParamNames = Object.values(productFilterParams);

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

export const parseProductFilters = (params) => ({
    stores: getAllUnique(params, productFilterParams.stores),
    types: getAllUnique(params, productFilterParams.types),
    brands: getAllUnique(params, productFilterParams.brands),
    colors: getAllUnique(params, productFilterParams.colors),
    fits: getAllUnique(params, productFilterParams.fits),
    minPrice: parsePrice(params.get(productFilterParams.minPrice)),
    maxPrice: parsePrice(params.get(productFilterParams.maxPrice)),
});

export const getActiveFilterCount = (filters) =>
    filters.stores.length +
    filters.types.length +
    filters.brands.length +
    filters.colors.length +
    filters.fits.length +
    Number(filters.minPrice != null) +
    Number(filters.maxPrice != null);

export const getProductSourcesForFilters = (sources, filters) => {
    if (filters.stores.length === 0) return sources;

    return sources.filter((source) => filters.stores.includes(source.key));
};

export const applyProductFilters = (query, filters) => {
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

    return query;
};
