/* =====================================================
   REYSO — COLLECTION DETAILS PAGE
   One shared template for every collection (مانتو, پالتو,
   کت و شلوار, شومیز, پیراهن, ست). Reads the category from
   ?category= in the URL, pulls its banner/description from
   COLLECTIONS (products.js), and renders every matching
   product in a simple grid — no filters/sort, that's what
   shop.html is for.
===================================================== */

function coldCreateCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";

    const front = product.images[0];
    const back = product.images[1] || product.images[0];

    card.innerHTML =
        '<button class="wishlist-btn" data-id="' + product.name + '" aria-label="افزودن به علاقه‌مندی‌ها">' +
        '<i class="ri-heart-line"></i></button>' +
        '<button class="quick-view-btn" aria-label="مشاهده سریع">' +
        '<i class="ri-eye-line"></i></button>' +
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

function initCollectionDetails() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("category") || "";
    const collection = getCollectionBySlug(slug);

    const name = collection ? collection.name : slug || "کالکشن";

    document.title = "ReySo | " + name;
    document.getElementById("cold-crumb").textContent = name;
    document.getElementById("cold-shop-link").href = "shop.html?category=" + encodeURIComponent(slug);

    const matches = PRODUCTS.filter((p) => p.category === slug);

    document.getElementById("cold-toolbar-title").textContent =
        "محصولات " + name + " (" + matches.length.toLocaleString("fa-IR") + ")";

    const grid = document.getElementById("cold-grid");
    const empty = document.getElementById("cold-empty");

    grid.innerHTML = "";
    if (matches.length === 0) {
        empty.hidden = false;
    } else {
        empty.hidden = true;
        matches.forEach((p) => grid.appendChild(coldCreateCard(p)));
    }

    grid.querySelectorAll(".wishlist-btn").forEach(bindWishlistButton);
}

document.addEventListener("DOMContentLoaded", initCollectionDetails);
