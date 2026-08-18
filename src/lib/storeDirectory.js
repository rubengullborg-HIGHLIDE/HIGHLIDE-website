export const storeDirectory = [
    {
        key: "kaufmann",
        name: "Kaufmann",
        area: "Midtbyen og Aarhus N",
        description:
            "Klassisk og international herremode fordelt på tre butikker i Aarhus.",
        website: "https://www.kaufmann.dk/butikker",
        locations: [
            {
                name: "Bruuns Galleri",
                address: "M.P. Bruuns Gade 25, 8000 Aarhus C",
                hours: "Man–fre 10–20 · Lør–søn 10–18",
            },
            {
                name: "Strøget – Regina",
                address: "Søndergade 53, 8000 Aarhus C",
                hours: "Se aktuelle åbningstider hos Kaufmann",
            },
            {
                name: "Storcenter Nord",
                address: "Finlandsgade 17, 8200 Aarhus N",
                hours: "Se aktuelle åbningstider hos Kaufmann",
            },
        ],
    },
    {
        key: "romerhus",
        name: "Rømerhus",
        area: "Skt. Clemens Torv",
        description:
            "En central Aarhus-butik med et bredt udvalg af hverdagsmode og sæsonens nyheder.",
        website: "https://bestseller-romerhus.dk/",
        locations: [
            {
                name: "Rømerhus",
                address: "Sankt Clemens Torv 8, 8000 Aarhus C",
                hours: "Se aktuelle åbningstider hos Rømerhus",
            },
        ],
    },
    {
        key: "lakor",
        name: "LAKOR",
        area: "Latinerkvarteret",
        description:
            "Vestkyst-inspireret tøj og illustrationer i en butik bygget op omkring lokale historier og godt håndværk.",
        website: "https://www.lakor.dk/pages/lakor-shop-aarhus",
        locations: [
            {
                name: "LAKOR Aarhus",
                address: "Graven 25, 8000 Aarhus C",
                hours: "Hverdage 10–18 · Lørdag 10–15",
            },
        ],
    },
    {
        key: "rains",
        name: "Rains",
        area: "Klostertorv",
        description:
            "Skandinavisk overtøj, tasker og accessories med fokus på funktionelle materialer og et enkelt udtryk.",
        website: "https://www.dk.rains.com/pages/stores?id=3856525",
        locations: [
            {
                name: "Rains Store Aarhus",
                address: "Klostertorv 6, 8000 Aarhus C",
                hours: "Man–fre 11–18 · Lørdag 10–16.30 · Søndag lukket",
            },
        ],
    },
    {
        key: "stoy",
        name: "STOY",
        area: "Store Torv",
        description:
            "Et kurateret udvalg af internationale modebrands i to etager ved Hotel Royal.",
        website: "https://stoy.com/da/pages/aarhus-store-1",
        locations: [
            {
                name: "STOY Aarhus",
                address: "Store Torv 4, 8000 Aarhus C",
                hours: "Man–fre 11–18 · Lørdag 11–17 · Søndag 11–16",
            },
        ],
    },
    {
        key: "shoechapter",
        name: "Shoe Chapter",
        area: "Store Torv",
        description:
            "Sneakers og sko fra både etablerede mærker og mindre, nøje udvalgte brands.",
        website: "https://shoechapter.com/en/pages/store",
        locations: [
            {
                name: "Shoe Chapter",
                address: "Store Torv 6, st. tv., 8000 Aarhus C",
                hours: "Man–tor 10–18 · Fredag 10–18.30 · Lørdag 10–17",
            },
        ],
    },
    {
        key: "skagen-clothing",
        name: "Skagen Clothing",
        area: "Store Torv",
        description:
            "Dansk herretøj med en afslappet, nordisk garderobe som omdrejningspunkt.",
        website: "https://skagenclothing.com/da/pages/store-locator",
        locations: [
            {
                name: "Skagen Clothing Aarhus",
                address: "Store Torv 14, 8000 Aarhus C",
                hours: "Man–fre 10–18 · Lørdag 10–17 · Søndag 11–15",
            },
        ],
    },
];

export const getStoreDirectoryEntry = (storeKey) =>
    storeDirectory.find((store) => store.key === storeKey) ?? null;

export const getStoreDirectoryHref = (storeKey) =>
    `/Butiks-info#${encodeURIComponent(storeKey)}`;

export const getStoreProductsHref = (storeKey) =>
    `/Produkt-overblik?butik=${encodeURIComponent(storeKey)}`;

