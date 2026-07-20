/* =====================================================
   REYSO — CART
   Real localStorage-backed cart. A single item is keyed
   by product id + size + color so the same product in a
   different size/color is stored as a separate line.
===================================================== */

const CART_KEY = "reyso_cart";

function getCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(list) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(list));
    } catch (e) {
        // localStorage unavailable — fail silently
    }
    renderCartNav();
    renderCartPage();
}

function addToCart(item) {
    const list = getCart();
    const existing = list.find(
        (line) => line.id === item.id && line.size === item.size && line.color === item.color
    );

    if (existing) {
        existing.qty += item.qty;
    } else {
        list.push(item);
    }

    saveCart(list);
}

function removeCartLine(index) {
    const list = getCart();
    list.splice(index, 1);
    saveCart(list);
}

function updateCartLineQty(index, qty) {
    const list = getCart();
    if (!list[index]) return;
    list[index].qty = Math.max(1, qty);
    saveCart(list);
}

function showCartToast(item) {
    let overlay = document.getElementById("reyso-toast-overlay");
    let toast = document.getElementById("reyso-toast");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "reyso-toast-overlay";
        overlay.className = "reyso-toast-overlay";
        document.body.appendChild(overlay);
    }
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "reyso-toast";
        toast.className = "reyso-toast";
        document.body.appendChild(toast);
    }

    function hideToast() {
        toast.classList.remove("is-visible");
        overlay.classList.remove("is-visible");
    }

    toast.innerHTML =
        '<button type="button" class="reyso-toast-close" aria-label="بستن"><i class="ri-close-line"></i></button>' +
        (item.image ? '<img src="' + item.image + '" alt="">' : '<span class="reyso-toast-icon"><i class="ri-check-line"></i></span>') +
        '<div class="reyso-toast-text">' +
        '<span class="reyso-toast-title">' + item.name + " به سبد اضافه شد</span>" +
        '<span class="reyso-toast-meta">سایز: ' + item.size + " | رنگ: " + item.color + "</span>" +
        "</div>" +
        '<div class="reyso-toast-actions">' +
        '<a href="cart.html" class="reyso-toast-link">مشاهده سبد خرید</a>' +
        '<button type="button" class="reyso-toast-continue">ادامه خرید</button>' +
        "</div>";

    toast.querySelector(".reyso-toast-close").addEventListener("click", hideToast);
    toast.querySelector(".reyso-toast-continue").addEventListener("click", hideToast);
    overlay.addEventListener("click", hideToast, { once: true });

    toast.classList.add("is-visible");
    overlay.classList.add("is-visible");

    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(hideToast, 5000);
}

function cartCount() {
    return getCart().reduce((sum, line) => sum + line.qty, 0);
}

function cartSubtotal() {
    return getCart().reduce((sum, line) => sum + line.price * line.qty, 0);
}

function renderCartNav() {
    const count = cartCount();
    document.querySelectorAll(".cart-count").forEach((el) => {
        el.textContent = count;
        el.hidden = count === 0;
    });
}

function cartLineCard(line, index) {
    const card = document.createElement("div");
    card.className = "cart-item";

    card.innerHTML =
        '<img src="' + line.image + '" alt="' + line.name + '">' +
        '<div class="cart-item-info">' +
        '<p class="cart-item-name">' + line.name + "</p>" +
        '<p class="cart-item-meta">سایز: ' + line.size + " &nbsp;|&nbsp; رنگ: " + line.color + "</p>" +
        '<button type="button" class="cart-item-remove" data-index="' + index + '">' +
        '<i class="ri-delete-bin-line"></i> حذف</button>' +
        "</div>" +
        '<div class="cart-item-qty">' +
        '<button type="button" class="cart-qty-minus" data-index="' + index + '">−</button>' +
        '<span>' + line.qty.toLocaleString("fa-IR") + "</span>" +
        '<button type="button" class="cart-qty-plus" data-index="' + index + '">+</button>' +
        "</div>" +
        '<p class="cart-item-price">' + formatToman(line.price * line.qty) + "</p>";

    return card;
}

function renderCartPage() {
    const wrap = document.getElementById("cart-items");
    if (!wrap) return;

    const list = getCart();
    const layout = document.getElementById("cart-layout");
    const empty = document.getElementById("cart-empty");

    if (list.length === 0) {
        layout.hidden = true;
        empty.hidden = false;
        wrap.innerHTML = "";
        return;
    }

    layout.hidden = false;
    empty.hidden = true;

    wrap.innerHTML = "";
    list.forEach((line, index) => wrap.appendChild(cartLineCard(line, index)));

    wrap.querySelectorAll(".cart-item-remove").forEach((btn) => {
        btn.addEventListener("click", () => removeCartLine(Number(btn.dataset.index)));
    });
    wrap.querySelectorAll(".cart-qty-minus").forEach((btn) => {
        btn.addEventListener("click", () => {
            const i = Number(btn.dataset.index);
            updateCartLineQty(i, list[i].qty - 1);
        });
    });
    wrap.querySelectorAll(".cart-qty-plus").forEach((btn) => {
        btn.addEventListener("click", () => {
            const i = Number(btn.dataset.index);
            updateCartLineQty(i, list[i].qty + 1);
        });
    });

    const subtotal = cartSubtotal();
    const subtotalEl = document.getElementById("cart-subtotal");
    const totalEl = document.getElementById("cart-total");
    if (subtotalEl) subtotalEl.textContent = formatToman(subtotal);
    if (totalEl) totalEl.textContent = formatToman(subtotal);
}

document.addEventListener("DOMContentLoaded", () => {
    renderCartPage();

    const checkoutBtn = document.getElementById("cart-checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            window.location.href = "order-form.html";
        });
    }
});

document.addEventListener("partialsReady", renderCartNav);
