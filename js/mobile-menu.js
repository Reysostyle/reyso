/* ==========================
   REYSO MOBILE MENU
   Opens/closes the slide-in navigation panel. Uses event
   delegation on document (rather than binding directly to
   the hamburger button) so it keeps working even if the
   header partial gets swapped in later or re-rendered —
   there's no stale element reference that can go stale.
========================== */

function isMobileMenuOpen(){
    return document.body.classList.contains("menu-open");
}

function openMobileMenu(){
    if (isMobileMenuOpen()) return;
    document.body.classList.add("menu-open");
    const toggle = document.querySelector(".menu-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
}

function closeMobileMenu(){
    if (!isMobileMenuOpen()) return;
    document.body.classList.remove("menu-open");
    const toggle = document.querySelector(".menu-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
}

function toggleMobileMenu(){
    if (isMobileMenuOpen()) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

document.addEventListener("click", (e) => {
    if (e.target.closest(".menu-toggle")) {
        toggleMobileMenu();
        return;
    }
    if (e.target.closest(".menu-close")) {
        closeMobileMenu();
        return;
    }
    if (e.target.closest(".mobile-menu-backdrop")) {
        closeMobileMenu();
        return;
    }
    if (e.target.closest(".mobile-menu-links a")) {
        closeMobileMenu();
        return;
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeMobileMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});
