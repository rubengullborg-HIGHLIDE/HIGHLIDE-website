import test from "node:test";
import assert from "node:assert/strict";

import {
    getRankedProductSearchCount,
    getRankedProductSearchParams,
} from "../src/lib/rankedProductSearch.js";

test("builds bounded ranked-search RPC parameters from the active filters", () => {
    assert.deepEqual(
        getRankedProductSearchParams({
            searchQuery: "  Adidas sneakers  ",
            filters: {
                stores: ["stoy"],
                types: ["sko"],
                brands: ["Adidas"],
                colors: ["White"],
                fits: ["Regular"],
                minPrice: 500,
                maxPrice: 1500,
                onSale: true,
                newProducts: false,
                sort: "price-asc",
            },
            limit: 500,
            offset: -10,
        }),
        {
            p_search_query: "Adidas sneakers",
            p_store_keys: ["stoy"],
            p_types: ["sko"],
            p_brands: ["Adidas"],
            p_colors: ["White"],
            p_fits: ["Regular"],
            p_min_price: 500,
            p_max_price: 1500,
            p_on_sale: true,
            p_new_products: false,
            p_sort: "price-asc",
            p_limit: 50,
            p_offset: 0,
        },
    );
});

test("uses safe defaults and reads the RPC total count", () => {
    const params = getRankedProductSearchParams({
        searchQuery: null,
        filters: {},
    });

    assert.equal(params.p_search_query, "");
    assert.deepEqual(params.p_store_keys, []);
    assert.equal(params.p_sort, "standard");
    assert.equal(params.p_limit, 12);
    assert.equal(params.p_offset, 0);
    assert.equal(getRankedProductSearchCount([{ total_count: "27" }]), 27);
    assert.equal(getRankedProductSearchCount([]), 0);
});
