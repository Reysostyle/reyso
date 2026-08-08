/* ==========================
   REYSO — SEARCH
   Opens a search overlay and live-filters PRODUCTS by name or
   category as the visitor types. Requires products.js
   (PRODUCTS/formatToman) to already be loaded. Uses event
   delegation throughout (same fix pattern as the mobile menu
   and wishlist icon) so it isn't tied to header-load timing.
========================== */

function searchIsOpen(){
    const overlay = document.querySelector(".search-overlay");
    return overlay ? overlay.classList.contains("open") : false;
}

function openSearchOverlay(){
    const overlay = document.querySelector(".search-overlay");
    const backdrop = document.querySelector(".search-overlay-backdrop");
    const input = document.getElementById("search-input");
    if (!overlay) return;

    overlay.classList.add("open");
    if (backdrop) backdrop.classList.add("open");
    document.body.classList.add("search-open");
    renderSearchResults("");
    if (input) {
        input.value = "";
        setTimeout(() => input.focus(), 100);
    }
}

function closeSearchOverlay(){
    const overlay = document.querySelector(".search-overlay");
    const backdrop = document.querySelector(".search-overlay-backdrop");
    if (overlay) overlay.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
    document.body.classList.remove("search-open");
}

function toggleSearchOverlay(){
    if (searchIsOpen()) {
        closeSearchOverlay();
    } else {
        openSearchOverlay();
    }
}

function renderSearchResults(query){
    const resultsWrap = document.getElementById("search-results");
    const emptyNote = document.getElementById("search-empty");
    if (!resultsWrap || typeof PRODUCTS === "undefined") return;

    const q = query.trim().toLowerCase();
    const matches = q
        ? PRODUCTS.filter((p) =>
            p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
        )
        : PRODUCTS;

    resultsWrap.innerHTML = "";

    if (matches.length === 0) {
        if (emptyNote) emptyNote.hidden = false;
        return;
    }
    if (emptyNote) emptyNote.hidden = true;

    matches.forEach((p) => {
        const item = document.createElement("a");
        item.className = "search-result-item";
        item.href = "shop-details.html?id=" + p.id;
        item.innerHTML =
            '<img src="' + p.images[0] + '" alt="' + p.name + '">' +
            '<div class="search-result-info">' +
            "<p>" + p.name + "</p>" +
            "<span>" + formatToman(p.price) + "</span>" +
            "</div>";
        resultsWrap.appendChild(item);
    });
}

document.addEventListener("click", (e) => {
    if (e.target.closest(".search-nav-btn")) {
        e.preventDefault();
        openSearchOverlay();
        return;
    }
    if (e.target.closest(".search-overlay-close")) {
        closeSearchOverlay();
        return;
    }
    if (e.target.closest(".search-overlay-backdrop")) {
        closeSearchOverlay();
        return;
    }
    if (e.target.closest(".search-result-item")) {
        closeSearchOverlay();
        return;
    }
});

document.addEventListener("input", (e) => {
    if (e.target && e.target.id === "search-input") {
        renderSearchResults(e.target.value);
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchIsOpen()) {
        closeSearchOverlay();
    }
});
