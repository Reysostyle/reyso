/* =====================================================
   REYSO — PAGE LOADER LOGIC
   The loader markup itself sits at the top of <body> on
   every page (so it paints instantly, before any CSS/JS
   finishes loading). This file only handles hiding it once
   the page is ready, and showing it again briefly whenever
   the visitor clicks through to another page.
===================================================== */

(function () {
    function hideLoader() {
        const loader = document.getElementById("site-loader");
        if (loader) loader.classList.add("loader-hidden");
    }

    // Normal case: hide once header/footer partials have been
    // injected (dispatched by js/partials.js).
    document.addEventListener("partialsReady", hideLoader);

    // Safety net: if partials.js ever fails (e.g. page opened as
    // a file:// URL) or the event is slow to arrive, don't leave
    // the visitor stuck behind the loader.
    window.addEventListener("load", function () {
        setTimeout(hideLoader, 900);
    });

    // Bug fix: when the visitor navigates back/forward, some browsers
    // restore the page from the back-forward cache (bfcache) instead
    // of reloading it — no script re-runs, so "partialsReady" never
    // fires again. If the loader happened to be showing at the exact
    // moment the page was frozen (visitor had just clicked a link
    // away from it), it stayed stuck forever until a manual refresh.
    // event.persisted flags a bfcache restore — hide immediately.
    window.addEventListener("pageshow", function (e) {
        if (e.persisted) hideLoader();
    });

    // Re-show the loader the moment the visitor clicks a link to
    // another page on the site, so the transition feels covered
    // instead of showing a blank flash before the next page paints.
    document.addEventListener("click", function (e) {
        // Modified clicks (ctrl/cmd/shift/middle-click) open the link in a
        // new tab — the current page never navigates away, so showing the
        // loader here would leave it stuck with nothing to ever hide it.
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

        const link = e.target.closest("a[href]");
        if (!link) return;

        const href = link.getAttribute("href");
        if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:") ||
            href.startsWith("http://") ||
            href.startsWith("https://") ||
            href.startsWith("javascript:") ||
            link.target === "_blank"
        ) {
            return;
        }

        const loader = document.getElementById("site-loader");
        if (loader) loader.classList.remove("loader-hidden");
    });
})();
