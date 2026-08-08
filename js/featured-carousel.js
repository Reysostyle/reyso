/* ==========================
   REYSO — FEATURED PRODUCTS CAROUSEL
   Drives the homepage "پرفروش‌ترین‌ها" row as a single-line
   slider: draggable, arrow buttons, and a slow auto-advance
   that pauses on hover/interaction. Same interaction pattern
   as js/recently-viewed.js, kept separate since this row is
   static markup (no localStorage data to render).
========================== */

const FEATURED_AUTO_MS = 4000;

let featuredAutoTimer = null;

function featuredStepSize(viewport) {
    const card = viewport.querySelector(".product-card");
    if (!card) return 300;
    const style = getComputedStyle(viewport.querySelector(".recent-grid"));
    const gap = parseFloat(style.columnGap || style.gap || "16");
    return card.getBoundingClientRect().width + gap;
}

function featuredAtStart(viewport) {
    return Math.abs(viewport.scrollLeft) < 2;
}

function featuredAtEnd(viewport) {
    const max = viewport.scrollWidth - viewport.clientWidth;
    return Math.abs(Math.abs(viewport.scrollLeft) - max) < 2;
}

function featuredScrollByStep(viewport, forward) {
    const amount = featuredStepSize(viewport);
    const dir = viewport.scrollLeft <= 0 ? -1 : 1;
    const delta = forward ? dir * amount : -dir * amount;

    if (forward && featuredAtEnd(viewport)) {
        viewport.scrollTo({ left: 0, behavior: "smooth" });
        return;
    }
    if (!forward && featuredAtStart(viewport)) {
        const max = viewport.scrollWidth - viewport.clientWidth;
        viewport.scrollTo({ left: dir * max, behavior: "smooth" });
        return;
    }
    viewport.scrollBy({ left: delta, behavior: "smooth" });
}

function featuredStartAuto(viewport) {
    featuredStopAuto();
    if (viewport.scrollWidth <= viewport.clientWidth + 2) return;
    featuredAutoTimer = setInterval(() => featuredScrollByStep(viewport, true), FEATURED_AUTO_MS);
}

function featuredStopAuto() {
    if (featuredAutoTimer) {
        clearInterval(featuredAutoTimer);
        featuredAutoTimer = null;
    }
}

function featuredInitDrag(viewport) {
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
        featuredStopAuto();
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
        featuredStartAuto(viewport);
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

function initFeaturedCarousel() {
    const viewport = document.getElementById("featured-viewport");
    const prevBtn = document.getElementById("featured-prev");
    const nextBtn = document.getElementById("featured-next");
    if (!viewport) return;

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            featuredStopAuto();
            featuredScrollByStep(viewport, false);
            featuredStartAuto(viewport);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            featuredStopAuto();
            featuredScrollByStep(viewport, true);
            featuredStartAuto(viewport);
        });
    }

    featuredInitDrag(viewport);
    viewport.addEventListener("mouseenter", featuredStopAuto);
    viewport.addEventListener("mouseleave", () => featuredStartAuto(viewport));

    // Give the browser a moment to lay out cards before measuring
    setTimeout(() => featuredStartAuto(viewport), 300);
}

document.addEventListener("DOMContentLoaded", initFeaturedCarousel);
