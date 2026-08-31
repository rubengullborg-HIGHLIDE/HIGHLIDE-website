import test from "node:test";
import assert from "node:assert/strict";

import { parseProductFilters } from "../src/lib/productFilters.js";
import { buildProductOverviewQuery } from "../src/lib/productQueries.js";

class FakeQuery {
    constructor(rows) {
        this.rows = rows;
        this.actions = [];
        this.predicates = [];
        this.orders = [];
        this.page = null;
    }

    eq(column, value) {
        this.actions.push({ type: "eq", column, value });
        this.predicates.push((row) => row[column] === value);
        return this;
    }

    gte(column, value) {
        this.actions.push({ type: "gte", column, value });
        this.predicates.push((row) => row[column] >= value);
        return this;
    }

    order(column, options) {
        this.actions.push({ type: "order", column, options });
        this.orders.push({ column, ascending: options.ascending });
        return this;
    }

    range(from, to) {
        this.actions.push({ type: "range", from, to });
        this.page = { from, to };
        return this;
    }

    execute() {
        const filteredRows = this.rows.filter((row) =>
            this.predicates.every((predicate) => predicate(row)),
        );
        const sortedRows = [...filteredRows].sort((left, right) => {
            for (const { column, ascending } of this.orders) {
                const leftValue = left[column] ?? "";
                const rightValue = right[column] ?? "";
                if (leftValue === rightValue) continue;

                const comparison = leftValue < rightValue ? -1 : 1;
                return ascending ? comparison : -comparison;
            }

            return 0;
        });

        return sortedRows.slice(this.page.from, this.page.to + 1);
    }
}

const source = {
    applyAvailableFilter: (query) => query.eq("aarhus_available", true),
    searchColumns: ["name", "brand"],
};

const now = new Date("2026-08-31T12:00:00.000Z");
const rows = [
    {
        id: 1,
        name: "Nyt produkt",
        publication_status: "active",
        first_seen_at: "2026-08-25T12:00:00.000Z",
        aarhus_available: true,
    },
    {
        id: 2,
        name: "For gammelt produkt",
        publication_status: "active",
        first_seen_at: "2026-08-16T12:00:00.000Z",
        aarhus_available: true,
    },
    {
        id: 3,
        name: "Ikke aktivt produkt",
        publication_status: "draft",
        first_seen_at: "2026-08-30T12:00:00.000Z",
        aarhus_available: true,
    },
    {
        id: 4,
        name: "Ikke tilgængeligt produkt",
        publication_status: "active",
        first_seen_at: "2026-08-29T12:00:00.000Z",
        aarhus_available: false,
    },
    {
        id: 5,
        name: "Nyeste produkt",
        publication_status: "active",
        first_seen_at: "2026-08-31T10:00:00.000Z",
        aarhus_available: true,
    },
];

test("Nyheder includes only available, active products from the last 14 days", () => {
    const filters = parseProductFilters(new URLSearchParams("nyheder=true"));
    const query = new FakeQuery(rows);

    buildProductOverviewQuery({
        query,
        source,
        filters,
        from: 0,
        to: 9,
        now,
    });

    assert.deepEqual(
        query.execute().map((row) => row.id),
        [5, 1],
    );
});

test("Nyheder filters and sorting run before pagination", () => {
    const filters = parseProductFilters(new URLSearchParams("nyheder=true"));
    const query = new FakeQuery(rows);

    buildProductOverviewQuery({
        query,
        source,
        filters,
        from: 0,
        to: 0,
        now,
    });

    const rangeIndex = query.actions.findIndex(({ type }) => type === "range");
    const relevantActions = query.actions.filter(({ type }) =>
        ["eq", "gte", "order"].includes(type),
    );

    assert.ok(relevantActions.every((action) => query.actions.indexOf(action) < rangeIndex));
    assert.deepEqual(
        query.execute().map((row) => row.id),
        [5],
    );
});
