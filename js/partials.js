/* =====================================================
   REYSO — PARTIALS LOADER
   Fetches the shared header/footer markup from
   partials/header.html and partials/footer.html so every
   page stays in sync from one place. Requires the site to
   be served over http(s) (fetch of local files fails when
   a page is opened directly as a file:// URL) — any static
   server, including the one used for local preview, is fine.

   Scripts that touch header/footer elements (nav toggle,
   wishlist panel, cart badge) wait for the "partialsReady"
   event this file dispatches, instead of DOMContentLoaded.
===================================================== */

function setActiveNav(){
    const current = window.location.pathname.split("/").pop() || "index.html";
    const matchHref = current === "shop-details.html" ? "shop.html" : current;

    document.querySelectorAll("header nav a, .mobile-menu-links a").forEach((a) => {
        const href = a.getAttribute("href");
        a.classList.toggle("active", href === matchHref);
    });
}

async function loadPartials(){
    const headerSlot = document.getElementById("site-header");
    const footerSlot = document.getElementById("site-footer");

    try {
        const [headerHTML, footerHTML] = await Promise.all([
            headerSlot ? fetch("partials/header.html").then((r) => r.text()) : Promise.resolve(""),
            footerSlot ? fetch("partials/footer.html").then((r) => r.text()) : Promise.resolve("")
        ]);

        if (headerSlot) headerSlot.innerHTML = headerHTML;
        if (footerSlot) footerSlot.innerHTML = footerHTML;

        setActiveNav();
    } catch (e) {
        // If the page was opened directly as a file:// URL, fetch will fail —
        // header/footer simply won't render. Serve the folder over http(s) instead.
        console.error("ReySo: could not load header/footer partials.", e);
    }

    document.dispatchEvent(new Event("partialsReady"));
}

loadPartials();
