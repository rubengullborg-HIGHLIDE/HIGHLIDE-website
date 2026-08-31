import {
    applyProductFilters,
    applyProductSort,
} from "./productFilters.js";
import { applyProductSearch } from "./productSources.js";

/**
 * Apply availability, filters, search, and sorting before Supabase paginates.
 */
export const buildProductOverviewQuery = ({
    query,
    source,
    filters,
    searchQuery = "",
    from,
    to,
    now,
}) => {
    query = source.applyAvailableFilter(query);
    query = applyProductFilters(query, filters, { now });

    if (searchQuery) {
        query = applyProductSearch(query, source, searchQuery);
    }

    query = applyProductSort(query, filters.sort, filters);

    return query.range(from, to);
};
