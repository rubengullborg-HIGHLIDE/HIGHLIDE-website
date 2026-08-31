import test from "node:test";
import assert from "node:assert/strict";

import {
    getActiveFilterCount,
    getNewProductsCutoffIso,
    getProductSort,
    parseProductFilters,
    productFilterParams,
} from "../src/lib/productFilters.js";

test("restores Nyheder from the URL and counts it as an active filter", () => {
    const filters = parseProductFilters(
        new URLSearchParams(`${productFilterParams.newProducts}=true`),
    );

    assert.equal(productFilterParams.newProducts, "nyheder");
    assert.equal(filters.newProducts, true);
    assert.equal(getActiveFilterCount(filters), 1);
    assert.equal(
        parseProductFilters(new URLSearchParams("nyheder=false")).newProducts,
        false,
    );
});

test("calculates a 14-day UTC cutoff", () => {
    const now = new Date("2026-08-31T12:00:00.000Z");

    assert.equal(
        getNewProductsCutoffIso(now),
        "2026-08-17T12:00:00.000Z",
    );
});

test("Nyheder always sorts by first_seen_at descending", () => {
    assert.deepEqual(getProductSort("price-asc", { newProducts: true }), [
        { column: "first_seen_at", ascending: false },
        { column: "id", ascending: false },
    ]);
});
