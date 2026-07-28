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

/* ---------- Contact links ----------
   Fill these in with ReySo's real WhatsApp number and Telegram
   username once ready — every "#" placeholder link across the
   site (footer icons, contact page, the floating button) is
   wired to these two constants. */

const WHATSAPP_NUMBER = ""; // e.g. "989123456789" (country code, no + or leading 0)
const TELEGRAM_USERNAME = ""; // e.g. "reyso_support" (without @)

function contactLinks(){
    return {
        whatsapp: "https://wa.me/" + WHATSAPP_NUMBER,
        telegram: "https://t.me/" + TELEGRAM_USERNAME
    };
}

function applyContactLinks(){
    if (!WHATSAPP_NUMBER && !TELEGRAM_USERNAME) return;
    const links = contactLinks();
    if (WHATSAPP_NUMBER) {
        document.querySelectorAll("[data-whatsapp-link]").forEach((el) => { el.href = links.whatsapp; });
    }
    if (TELEGRAM_USERNAME) {
        document.querySelectorAll("[data-telegram-link]").forEach((el) => { el.href = links.telegram; });
    }
}

function injectFloatingContact(){
    if (document.getElementById("floating-contact")) return;

    const links = contactLinks();
    const wrap = document.createElement("div");
    wrap.id = "floating-contact";
    wrap.className = "floating-contact";
    wrap.innerHTML =
        '<a href="' + links.whatsapp + '" target="_blank" rel="noopener" class="floating-contact-btn wa" aria-label="گفتگو در واتس‌اپ" data-whatsapp-link>' +
            '<i class="ri-whatsapp-line"></i>' +
        '</a>' +
        '<a href="' + links.telegram + '" target="_blank" rel="noopener" class="floating-contact-btn tg" aria-label="گفتگو در تلگرام" data-telegram-link>' +
            '<i class="ri-telegram-line"></i>' +
        '</a>';

    document.body.appendChild(wrap);
}

function initHeaderScrollEffect(){
    const header = document.querySelector("header");
    if (!header) return;

    // Hysteresis: enter "scrolled" only past 60px, leave it only once back
    // under 20px. A single hard threshold flickers when the scroll
    // position hovers right at that pixel (slow scrolling, trackpad
    // momentum), which shows up as the header visibly shaking.
    const ENTER_AT = 60;
    const EXIT_AT = 20;
    let ticking = false;

    function applyState(){
        const y = window.scrollY;
        if (y > ENTER_AT) {
            header.classList.add("scrolled");
        } else if (y < EXIT_AT) {
            header.classList.remove("scrolled");
        }
        ticking = false;
    }

    function onScroll(){
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(applyState);
    }

    applyState();
    window.addEventListener("scroll", onScroll, { passive: true });
}

function initNewsletterForm(){
    const form = document.getElementById("newsletter-form");
    const emailInput = document.getElementById("newsletter-email");
    const agreeCheck = document.getElementById("newsletter-agree-check");
    const note = document.getElementById("newsletter-note");
    if (!form || !note) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = emailInput ? emailInput.value.trim() : "";
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!emailValid) {
            note.textContent = "یه ایمیل معتبر وارد کن.";
            return;
        }
        if (agreeCheck && !agreeCheck.checked) {
            note.textContent = "برای عضویت، باید با قوانین موافقت کنی.";
            return;
        }

        try {
            const raw = localStorage.getItem("reyso_newsletter_emails");
            const list = raw ? JSON.parse(raw) : [];
            if (!list.includes(email)) list.push(email);
            localStorage.setItem("reyso_newsletter_emails", JSON.stringify(list));
        } catch (err) {
            // localStorage unavailable — the confirmation message below still applies
        }

        note.textContent = "ثبت شد! به محض فعال شدن خبرنامه، بهت خبر می‌دیم.";
        form.reset();
    });
}

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
            headerSlot ? fetch("partials/header.html?v=32").then((r) => r.text()) : Promise.resolve(""),
            footerSlot ? fetch("partials/footer.html?v=32").then((r) => r.text()) : Promise.resolve("")
        ]);

        // Use outerHTML (not innerHTML) for the header specifically: header
        // uses position:sticky, and a snug wrapper div that only ever hugs
        // header's own height becomes its sticky containing block — leaving
        // it zero room to actually stick. Replacing the wrapper div itself
        // makes <header> a direct child of <body> instead, which spans the
        // full page and gives sticky positioning room to work.
        if (headerSlot) headerSlot.outerHTML = headerHTML;
        if (footerSlot) footerSlot.innerHTML = footerHTML;

        setActiveNav();
        initHeaderScrollEffect();
        initNewsletterForm();
        applyContactLinks();
        injectFloatingContact();
    } catch (e) {
        // If the page was opened directly as a file:// URL, fetch will fail —
        // header/footer simply won't render. Serve the folder over http(s) instead.
        console.error("ReySo: could not load header/footer partials.", e);
    }

    document.dispatchEvent(new Event("partialsReady"));
}

loadPartials();
