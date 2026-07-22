/* =====================================================
   REYSO — SHOP LISTING PAGE
   Renders PRODUCTS (products.js) into a filterable,
   sortable grid. All state lives in memory for this
   page load — nothing here persists beyond a refresh
   except the wishlist/cart, which use their own storage.
===================================================== */

const shopState = {
    categories: new Set(),
    sizes: new Set(),
    colors: new Set(),
    maxPrice: 5000000,
    sort: "newest",
    view: "grid"
};

function shopUniqueCategories() {
    return [...new Set(PRODUCTS.map((p) => p.category))];
}

function shopUniqueSizes() {
    return [...new Set(PRODUCTS.flatMap((p) => p.sizes))];
}

function shopUniqueColors() {
    const seen = new Map();
    PRODUCTS.forEach((p) => {
        p.colors.forEach((c) => {
            if (!seen.has(c.name)) seen.set(c.name, c.hex);
        });
    });
    return [...seen.entries()];
}

function shopRenderFilterOptions() {
    const catWrap = document.getElementById("filter-categories");
    shopUniqueCategories().forEach((cat) => {
        const label = document.createElement("label");
        label.className = "filter-check";
        label.innerHTML =
            '<input type="checkbox" value="' + cat + '"><span>' + cat + "</span>";
        label.querySelector("input").addEventListener("change", (e) => {
            if (e.target.checked) shopState.categories.add(cat);
            else shopState.categories.delete(cat);
            shopRender();
        });
        catWrap.appendChild(label);
    });

    const sizeWrap = document.getElementById("filter-sizes");
    shopUniqueSizes().forEach((size) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = size;
        btn.addEventListener("click", () => {
            if (shopState.sizes.has(size)) {
                shopState.sizes.delete(size);
                btn.classList.remove("active");
            } else {
                shopState.sizes.add(size);
                btn.classList.add("active");
            }
            shopRender();
        });
        sizeWrap.appendChild(btn);
    });

    const colorWrap = document.getElementById("filter-colors");
    shopUniqueColors().forEach(([name, hex]) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "filter-swatch";
        btn.title = name;
        btn.style.setProperty("--swatch", hex);
        btn.addEventListener("click", () => {
            if (shopState.colors.has(name)) {
                shopState.colors.delete(name);
                btn.classList.remove("active");
            } else {
                shopState.colors.add(name);
                btn.classList.add("active");
            }
            shopRender();
        });
        colorWrap.appendChild(btn);
    });

    const priceInput = document.getElementById("filter-price");
    const priceValue = document.getElementById("filter-price-value");
    priceInput.addEventListener("input", () => {
        shopState.maxPrice = Number(priceInput.value);
        priceValue.textContent = "تا " + shopState.maxPrice.toLocaleString("fa-IR");
        shopRender();
    });
    priceValue.textContent = "تا " + shopState.maxPrice.toLocaleString("fa-IR");
}

function shopFilterProducts() {
    return PRODUCTS.filter((p) => {
        if (shopState.categories.size && !shopState.categories.has(p.category)) return false;
        if (shopState.sizes.size && !p.sizes.some((s) => shopState.sizes.has(s))) return false;
        if (shopState.colors.size && !p.colors.some((c) => shopState.colors.has(c.name))) return false;
        if (p.price > shopState.maxPrice) return false;
        return true;
    });
}

function shopSortProducts(list) {
    const sorted = [...list];
    if (shopState.sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (shopState.sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (shopState.sort === "popular") sorted.sort((a, b) => b.popularity - a.popularity);
    else sorted.sort((a, b) => b.dateAdded - a.dateAdded);
    return sorted;
}

function shopRenderActiveChips() {
    const wrap = document.getElementById("active-filters");
    wrap.innerHTML = "";

    const chips = [];
    shopState.categories.forEach((c) => chips.push({ label: c, remove: () => shopState.categories.delete(c) }));
    shopState.sizes.forEach((s) => chips.push({ label: "سایز " + s, remove: () => shopState.sizes.delete(s) }));
    shopState.colors.forEach((c) => chips.push({ label: c, remove: () => shopState.colors.delete(c) }));
    if (shopState.maxPrice < 5000000) {
        chips.push({
            label: "تا " + shopState.maxPrice.toLocaleString("fa-IR") + " تومان",
            remove: () => {
                shopState.maxPrice = 5000000;
                document.getElementById("filter-price").value = 5000000;
                document.getElementById("filter-price-value").textContent = "تا ۵٬۰۰۰٬۰۰۰";
            }
        });
    }

    chips.forEach((chip) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "filter-chip";
        el.innerHTML = chip.label + ' <i class="ri-close-line"></i>';
        el.addEventListener("click", () => {
            chip.remove();
            shopSyncControlsWithState();
            shopRender();
        });
        wrap.appendChild(el);
    });
}

function shopSyncControlsWithState() {
    document.querySelectorAll('#filter-categories input[type="checkbox"]').forEach((input) => {
        input.checked = shopState.categories.has(input.value);
    });
    document.querySelectorAll("#filter-sizes button").forEach((btn) => {
        btn.classList.toggle("active", shopState.sizes.has(btn.textContent));
    });
    document.querySelectorAll("#filter-colors .filter-swatch").forEach((btn) => {
        btn.classList.toggle("active", shopState.colors.has(btn.title));
    });
}

function shopCreateCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";

    const front = product.images[0];
    const back = product.images[1] || product.images[0];

    card.innerHTML =
        '<button class="wishlist-btn" data-id="' + product.name + '" aria-label="افزودن به علاقه‌مندی‌ها">' +
        '<i class="ri-heart-line"></i></button>' +
        '<a href="shop-details.html?id=' + product.id + '" class="product-link">' +
        '<div class="product-media">' +
        '<img class="img-front" loading="lazy" src="' + front + '" alt="' + product.name + '">' +
        '<img class="img-back" loading="lazy" src="' + back + '" alt="' + product.name + '">' +
        (product.oldPrice ? '<span class="shop-card-badge">تخفیف</span>' : "") +
        "</div>" +
        '<div class="product-info">' +
        '<p class="product-name">' + product.name + "</p>" +
        '<p class="product-price">' + formatToman(product.price) + "</p>" +
        "</div>" +
        "</a>";

    return card;
}

function shopRender() {
    const filtered = shopFilterProducts();
    const sorted = shopSortProducts(filtered);

    const grid = document.getElementById("shop-grid");
    const empty = document.getElementById("shop-empty");
    const count = document.getElementById("shop-count");

    count.textContent = sorted.length.toLocaleString("fa-IR") + " محصول";
    grid.classList.toggle("shop-grid-list", shopState.view === "list");

    grid.innerHTML = "";
    if (sorted.length === 0) {
        empty.hidden = false;
    } else {
        empty.hidden = true;
        sorted.forEach((p) => grid.appendChild(shopCreateCard(p)));
    }

    grid.querySelectorAll(".wishlist-btn").forEach(bindWishlistButton);
    shopRenderActiveChips();
}

function initShop() {
    shopRenderFilterOptions();

    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    if (categoryParam && shopUniqueCategories().includes(categoryParam)) {
        shopState.categories.add(categoryParam);
        shopSyncControlsWithState();
    }

    shopRender();

    document.getElementById("shop-sort").addEventListener("change", (e) => {
        shopState.sort = e.target.value;
        shopRender();
    });

    document.querySelectorAll(".shop-view-toggle button").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".shop-view-toggle button").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            shopState.view = btn.dataset.view;
            shopRender();
        });
    });

    document.getElementById("filters-clear").addEventListener("click", () => {
        shopState.categories.clear();
        shopState.sizes.clear();
        shopState.colors.clear();
        shopState.maxPrice = 5000000;
        document.getElementById("filter-price").value = 5000000;
        document.getElementById("filter-price-value").textContent = "تا ۵٬۰۰۰٬۰۰۰";
        shopSyncControlsWithState();
        shopRender();
    });

    const filtersPanel = document.getElementById("shop-filters");
    const filtersBackdrop = document.getElementById("shop-filters-backdrop");

    function openFilters() {
        filtersPanel.classList.add("open");
        filtersBackdrop.classList.add("open");
    }
    function closeFilters() {
        filtersPanel.classList.remove("open");
        filtersBackdrop.classList.remove("open");
    }

    document.getElementById("mobile-filters-btn").addEventListener("click", openFilters);
    document.getElementById("shop-filters-close").addEventListener("click", closeFilters);
    filtersBackdrop.addEventListener("click", closeFilters);
}

document.addEventListener("DOMContentLoaded", initShop);
