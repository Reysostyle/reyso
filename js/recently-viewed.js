/* ==========================
   REYSO — RECENTLY VIEWED
   Tracks product detail views in localStorage and renders a
   "اخیراً دیده‌شده" row of cards on pages that include the
   #recently-viewed-section markup. Requires products.js
   (getProductById/formatToman) and wishlist.js
   (bindWishlistButton) to already be loaded.

   Shows up to 5 cards per row. If more products have been
   viewed than fit in one row, the row becomes a draggable
   slider: the visitor can drag it with the mouse/finger or
   use the arrow buttons, and it also auto-advances slowly on
   its own (pausing whenever the visitor interacts with it).
========================== */

const RECENT_VIEWED_KEY = "reyso_recently_viewed";
const RECENT_VIEWED_MAX = 8;
const RECENT_AUTO_MS = 3500;

let recentAutoTimer = null;

function trackProductView(id) {
    try {
        const raw = localStorage.getItem(RECENT_VIEWED_KEY);
        let list = raw ? JSON.parse(raw) : [];
        list = list.filter((x) => x !== id);
        list.unshift(id);
        list = list.slice(0, RECENT_VIEWED_MAX);
        localStorage.setItem(RECENT_VIEWED_KEY, JSON.stringify(list));
    } catch (e) {
        // localStorage unavailable — fail silently
    }
}

function getRecentlyViewed(excludeId) {
    try {
        const raw = localStorage.getItem(RECENT_VIEWED_KEY);
        const ids = raw ? JSON.parse(raw) : [];
        return ids
            .filter((id) => id !== excludeId)
            .map((id) => (typeof getProductById === "function" ? getProductById(id) : null))
            .filter(Boolean);
    } catch (e) {
        return [];
    }
}

function recentlyViewedCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";

    const front = product.images[0];
    const back = product.images[1] || product.images[0];

    card.innerHTML =
        '<button class="wishlist-btn" data-id="' + product.name + '" aria-label="افزودن به علاقه‌مندی‌ها">' +
        '<i class="ri-heart-line"></i></button>' +
        '<button class="quick-view-btn" aria-label="مشاهده سریع">' +
        '<i class="ri-eye-line"></i></button>' +
        '<a href="shop-details.html?id=' + product.id + '" class="product-link" draggable="false">' +
        '<div class="product-media">' +
        '<img class="img-front" loading="lazy" draggable="false" src="' + front + '" alt="' + product.name + '">' +
        '<img class="img-back" loading="lazy" draggable="false" src="' + back + '" alt="' + product.name + '">' +
        (product.oldPrice ? '<span class="shop-card-badge">تخفیف</span>' : "") +
        "</div>" +
        '<div class="product-info">' +
        '<p class="product-name">' + product.name + "</p>" +
        '<p class="product-price">' + formatToman(product.price) + "</p>" +
        "</div>" +
        "</a>";

    return card;
}

function stepSize(viewport) {
    const card = viewport.querySelector(".product-card");
    if (!card) return 300;
    const style = getComputedStyle(viewport.querySelector(".recent-grid"));
    const gap = parseFloat(style.columnGap || style.gap || "16");
    return card.getBoundingClientRect().width + gap;
}

function atStart(viewport) {
    return Math.abs(viewport.scrollLeft) < 2;
}

function atEnd(viewport) {
    // Works for both LTR (positive scrollLeft) and RTL (negative scrollLeft
    // in modern browsers) since we compare against the container's own max.
    const max = viewport.scrollWidth - viewport.clientWidth;
    return Math.abs(Math.abs(viewport.scrollLeft) - max) < 2;
}

function scrollByStep(viewport, forward) {
    const amount = stepSize(viewport);
    // Whichever sign moves "forward" (toward not-yet-seen items) is
    // determined by the container's own scroll direction, so we just
    // flip sign based on the current scrollLeft's sign convention.
    const dir = viewport.scrollLeft <= 0 ? -1 : 1;
    const delta = forward ? dir * amount : -dir * amount;

    if (forward && atEnd(viewport)) {
        viewport.scrollTo({ left: 0, behavior: "smooth" });
        return;
    }
    if (!forward && atStart(viewport)) {
        const max = viewport.scrollWidth - viewport.clientWidth;
        viewport.scrollTo({ left: dir * max, behavior: "smooth" });
        return;
    }
    viewport.scrollBy({ left: delta, behavior: "smooth" });
}

function startAutoAdvance(viewport) {
    stopAutoAdvance();
    if (viewport.scrollWidth <= viewport.clientWidth + 2) return;
    recentAutoTimer = setInterval(() => scrollByStep(viewport, true), RECENT_AUTO_MS);
}

function stopAutoAdvance() {
    if (recentAutoTimer) {
        clearInterval(recentAutoTimer);
        recentAutoTimer = null;
    }
}

function initDrag(viewport) {
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    viewport.addEventListener("pointerdown", (e) => {
        isDown = true;
        moved = false;
        startX = e.clientX;
        startScroll = viewport.scrollLeft;
        viewport.classList.add("dragging");
        stopAutoAdvance();
    });

    viewport.addEventListener("pointermove", (e) => {
        if (!isDown) return;
        const delta = e.clientX - startX;
        if (Math.abs(delta) > 3) moved = true;
        viewport.scrollLeft = startScroll + delta;
    });

    function endDrag() {
        if (!isDown) return;
        isDown = false;
        viewport.classList.remove("dragging");
        startAutoAdvance(viewport);
    }

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerleave", endDrag);

    // Prevent the product link from opening after an actual drag gesture
    viewport.addEventListener(
        "click",
        (e) => {
            if (moved) {
                e.preventDefault();
                e.stopPropagation();
            }
        },
        true
    );
}

function renderRecentlyViewed(excludeId) {
    const section = document.getElementById("recently-viewed-section");
    const grid = document.getElementById("recently-viewed-grid");
    const viewport = document.getElementById("recent-viewport");
    const prevBtn = document.getElementById("recent-prev");
    const nextBtn = document.getElementById("recent-next");
    if (!section || !grid || !viewport) return;

    const products = getRecentlyViewed(excludeId || null);
    if (products.length === 0) {
        section.hidden = true;
        return;
    }

    grid.innerHTML = "";
    products.forEach((p) => grid.appendChild(recentlyViewedCard(p)));

    if (typeof bindWishlistButton === "function") {
        grid.querySelectorAll(".wishlist-btn").forEach(bindWishlistButton);
    }

    section.hidden = false;

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            stopAutoAdvance();
            scrollByStep(viewport, false);
            startAutoAdvance(viewport);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            stopAutoAdvance();
            scrollByStep(viewport, true);
            startAutoAdvance(viewport);
        });
    }

    initDrag(viewport);
    viewport.addEventListener("mouseenter", stopAutoAdvance);
    viewport.addEventListener("mouseleave", () => startAutoAdvance(viewport));

    // Give the browser a moment to lay out cards before measuring
    setTimeout(() => startAutoAdvance(viewport), 300);
}

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    renderRecentlyViewed(params.get("id"));
});
