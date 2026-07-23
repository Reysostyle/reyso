/* ==========================
   REYSO MOBILE MENU
   Opens/closes the slide-in navigation panel. Runs after
   the header/footer partials are injected (see partials.js)
   since the menu markup lives inside the header partial.
========================== */

function initMobileMenu(){
    const menuToggle = document.querySelector(".menu-toggle");
    const menuClose = document.querySelector(".menu-close");
    const menuBackdrop = document.querySelector(".mobile-menu-backdrop");

    function isOpen(){
        return document.body.classList.contains("menu-open");
    }

    function openMenu(){
        if (isOpen()) return;
        document.body.classList.add("menu-open");
        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "true");
        }
    }

    function closeMenu(){
        if (!isOpen()) return;
        document.body.classList.remove("menu-open");
        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
        }
    }

    function toggleMenu(){
        if (isOpen()) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", toggleMenu);
    }

    if (menuClose) {
        menuClose.addEventListener("click", closeMenu);
    }

    if (menuBackdrop) {
        menuBackdrop.addEventListener("click", closeMenu);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    document.querySelectorAll(".mobile-menu-links a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });
}

document.addEventListener("partialsReady", initMobileMenu);
