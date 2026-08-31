const asArray = (value) => (Array.isArray(value) ? value : []);

/**
 * Keep the browser and filter dialog aligned on the RPC parameter contract.
 */
export const getRankedProductSearchParams = ({
    searchQuery,
    filters,
    limit = 12,
    offset = 0,
}) => ({
    p_search_query: String(searchQuery ?? "").trim(),
    p_store_keys: asArray(filters?.stores),
    p_types: asArray(filters?.types),
    p_brands: asArray(filters?.brands),
    p_colors: asArray(filters?.colors),
    p_fits: asArray(filters?.fits),
    p_min_price: filters?.minPrice ?? null,
    p_max_price: filters?.maxPrice ?? null,
    p_on_sale: Boolean(filters?.onSale),
    p_new_products: Boolean(filters?.newProducts),
    p_sort: filters?.sort ?? "standard",
    p_limit: Math.min(50, Math.max(1, Number(limit) || 12)),
    p_offset: Math.max(0, Number(offset) || 0),
});

export const getRankedProductSearchCount = (rows) => {
    const count = Number(rows?.[0]?.total_count ?? 0);
    return Number.isFinite(count) ? count : 0;
};
