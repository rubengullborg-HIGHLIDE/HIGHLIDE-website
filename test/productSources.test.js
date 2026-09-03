import assert from "node:assert/strict";
import test from "node:test";

import { getResponsiveProductImage } from "../src/lib/productSources.js";

test("creates a responsive Shopify CDN image and preserves existing parameters", () => {
    const image = getResponsiveProductImage(
        "https://cdn.shopify.com/s/files/1/0123/products/jacket.jpg?v=42",
        { widths: [640, 320, 640], sizes: "50vw" },
    );

    assert.equal(
        image.src,
        "https://cdn.shopify.com/s/files/1/0123/products/jacket.jpg?v=42&width=640",
    );
    assert.equal(
        image.srcset,
        "https://cdn.shopify.com/s/files/1/0123/products/jacket.jpg?v=42&width=320 320w, https://cdn.shopify.com/s/files/1/0123/products/jacket.jpg?v=42&width=640 640w",
    );
    assert.equal(image.sizes, "50vw");
});

test("recognizes Shopify images served from a shop domain", () => {
    const image = getResponsiveProductImage(
        "https://example-store.dk/cdn/shop/files/shirt.png?v=7",
        { widths: [480] },
    );

    assert.equal(
        image.src,
        "https://example-store.dk/cdn/shop/files/shirt.png?v=7&width=480",
    );
    assert.match(image.srcset, /width=480 480w$/);
});

test("leaves non-Shopify and local images untouched", () => {
    assert.deepEqual(
        getResponsiveProductImage("https://images.example.com/jacket.jpg"),
        {
            src: "https://images.example.com/jacket.jpg",
            srcset: "",
            sizes: "",
        },
    );
    assert.deepEqual(getResponsiveProductImage("/images/fallback.png"), {
        src: "/images/fallback.png",
        srcset: "",
        sizes: "",
    });
});
