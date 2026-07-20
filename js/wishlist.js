/* ==========================
   REYSO WISHLIST
   Heart button on product cards — saved to localStorage,
   with a small pulse animation on toggle.
========================== */

const WISHLIST_KEY = "reyso_wishlist";

function getWishlist(){
    try {
        const raw = localStorage.getItem(WISHLIST_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveWishlist(list){
    try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    } catch (e) {
        // localStorage unavailable — fail silently
    }
}

function setButtonState(btn, isActive){
    const icon = btn.querySelector("i");
    btn.classList.toggle("active", isActive);
    if (icon) {
        icon.className = isActive ? "ri-heart-fill" : "ri-heart-line";
    }
}

function renderWishlistNav(){
    const list = getWishlist();
    const counts = document.querySelectorAll(".wishlist-count");
    counts.forEach((el) => {
        el.textContent = list.length;
        el.hidden = list.length === 0;
    });

    const navBtns = document.querySelectorAll(".wishlist-nav-btn");
    navBtns.forEach((btn) => btn.classList.toggle("active", list.length > 0));

    const panelList = document.querySelector(".wishlist-panel-list");
    const emptyMsg = document.querySelector(".wishlist-empty");
    if (!panelList) return;

    panelList.innerHTML = "";

    if (list.length === 0) {
        if (emptyMsg) emptyMsg.style.display = "block";
        return;
    }

    if (emptyMsg) emptyMsg.style.display = "none";

    list.forEach((id) => {
        const li = document.createElement("li");

        const product = (typeof PRODUCTS !== "undefined") ? PRODUCTS.find((p) => p.name === id) : null;

        if (product) {
            const link = document.createElement("a");
            link.href = "shop-details.html?id=" + product.id;
            link.className = "wishlist-panel-link";

            const img = document.createElement("img");
            img.src = product.images[0];
            img.alt = id;

            const span = document.createElement("span");
            span.textContent = id;

            link.appendChild(img);
            link.appendChild(span);
            li.appendChild(link);
        } else {
            const span = document.createElement("span");
            span.textContent = id;
            li.appendChild(span);
        }

        const removeBtn = document.createElement("button");
        removeBtn.setAttribute("aria-label", "حذف از علاقه‌مندی‌ها");
        removeBtn.innerHTML = '<i class="ri-close-line"></i>';
        removeBtn.addEventListener("click", () => {
            const current = getWishlist();
            const idx = current.indexOf(id);
            if (idx !== -1) {
                current.splice(idx, 1);
                saveWishlist(current);
            }

            const matchingBtn = document.querySelector(`.wishlist-btn[data-id="${CSS.escape(id)}"]`);
            if (matchingBtn) setButtonState(matchingBtn, false);

            renderWishlistNav();
        });

        li.appendChild(removeBtn);
        panelList.appendChild(li);
    });
}

function openWishlistPanel(){
    document.querySelector(".wishlist-panel")?.classList.add("open");
    document.querySelector(".wishlist-backdrop")?.classList.add("open");
}

function closeWishlistPanel(){
    document.querySelector(".wishlist-panel")?.classList.remove("open");
    document.querySelector(".wishlist-backdrop")?.classList.remove("open");
}

function initWishlistNav(){
    renderWishlistNav();

    document.querySelectorAll(".wishlist-nav-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            openWishlistPanel();
        });
    });

    document.querySelector(".wishlist-backdrop")?.addEventListener("click", closeWishlistPanel);
    document.querySelector(".wishlist-panel-close")?.addEventListener("click", closeWishlistPanel);
}

function bindWishlistButton(btn){
    if (btn.dataset.wishlistBound === "true") return;
    btn.dataset.wishlistBound = "true";

    const id = btn.dataset.id;
    setButtonState(btn, getWishlist().includes(id));

    btn.addEventListener("click", (e) => {
        e.preventDefault();

        const list = getWishlist();
        const index = list.indexOf(id);
        const nowActive = index === -1;

        if (nowActive) {
            list.push(id);
        } else {
            list.splice(index, 1);
        }

        saveWishlist(list);
        setButtonState(btn, nowActive);
        renderWishlistNav();

        btn.classList.remove("pulse");
        // Force reflow so the animation can replay on repeated clicks
        void btn.offsetWidth;
        btn.classList.add("pulse");
    });
}

function initWishlist(){
    document.querySelectorAll(".wishlist-btn").forEach(bindWishlistButton);
}

document.addEventListener("DOMContentLoaded", initWishlist);
document.addEventListener("partialsReady", initWishlistNav);
