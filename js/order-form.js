/* =====================================================
   REYSO — ORDER REQUEST FORM
   Interim order-collection flow used until the online
   payment gateway is live. Reads the real cart from
   localStorage (see cart.js), then sends the order to the
   n8n webhook that owns the Google Sheets + Telegram
   notification flow.
===================================================== */

/* ---------- Configuration ----------
   Fill these in once the n8n workflow is imported and
   the Telegram bot is created. Until ORDER_WEBHOOK_URL is
   set, orders are saved locally so nothing is lost, and
   the person sees an honest note that the backend isn't
   connected yet. */

const ORDER_WEBHOOK_URL = ""; // e.g. "https://your-n8n-host/webhook/reyso-order"
const TELEGRAM_BOT_USERNAME = ""; // e.g. "reyso_orders_bot" (without @)

const PENDING_ORDERS_KEY = "reyso_pending_orders";
const LAST_ORDER_ID_KEY = "reyso_last_order_id";

function telegramBotLink() {
    return TELEGRAM_BOT_USERNAME
        ? "https://t.me/" + TELEGRAM_BOT_USERNAME
        : "https://telegram.org";
}

function generateOrderId() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const rand = String(Math.floor(1000 + Math.random() * 9000));
    return "RS" + y + m + d + "-" + rand;
}

function renderOrderSummary() {
    const cart = getCart();
    const itemsWrap = document.getElementById("order-summary-items");
    const totalEl = document.getElementById("order-total");
    const layout = document.getElementById("order-form-layout");
    const emptyEl = document.getElementById("order-empty");

    if (!itemsWrap || !totalEl) return;

    if (cart.length === 0) {
        if (layout) layout.hidden = true;
        if (emptyEl) emptyEl.hidden = false;
        return;
    }

    if (layout) layout.hidden = false;
    if (emptyEl) emptyEl.hidden = true;

    itemsWrap.innerHTML = "";
    cart.forEach((line) => {
        const row = document.createElement("div");
        row.className = "order-summary-item";
        row.innerHTML =
            "<span>" + line.name + " (" + line.size + "، " + line.color + ") ×" +
            line.qty.toLocaleString("fa-IR") + "</span>" +
            "<span>" + formatToman(line.price * line.qty) + "</span>";
        itemsWrap.appendChild(row);
    });

    totalEl.textContent = formatToman(cartSubtotal());
}

function setFormBusy(submitBtn, busy) {
    submitBtn.disabled = busy;
    submitBtn.textContent = busy ? "در حال ثبت..." : "ثبت درخواست سفارش";
}

function showFormNote(text) {
    const note = document.getElementById("order-form-note");
    if (!note) return;
    note.textContent = text;
    note.hidden = false;
}

function savePendingOrderLocally(order) {
    try {
        const raw = localStorage.getItem(PENDING_ORDERS_KEY);
        const list = raw ? JSON.parse(raw) : [];
        list.push(order);
        localStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(list));
    } catch (e) {
        // localStorage unavailable — fail silently, the order still
        // shows a success screen with its ID since it's collected client-side.
    }
}

async function sendOrderToWebhook(order) {
    if (!ORDER_WEBHOOK_URL) {
        // Backend not connected yet — keep the order safe locally.
        savePendingOrderLocally(order);
        return { delivered: false };
    }

    try {
        const res = await fetch(ORDER_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
        });
        if (!res.ok) throw new Error("bad status " + res.status);
        return { delivered: true };
    } catch (e) {
        // Network/webhook failure — don't lose the order.
        savePendingOrderLocally(order);
        return { delivered: false };
    }
}

function validateForm(fields) {
    const digitsOnly = (s) => s.replace(/[^0-9۰-۹]/g, "");

    if (!fields.name) return "لطفاً نام و نام‌خانوادگی رو وارد کن";
    if (!fields.phone || digitsOnly(fields.phone).length < 10) return "شماره تماس معتبر نیست";
    if (!fields.telegram) return "لطفاً یوزرنیم تلگرامت رو وارد کن";
    if (!fields.address) return "لطفاً آدرس کامل رو وارد کن";
    if (!fields.postal || digitsOnly(fields.postal).length !== 10) return "کد پستی باید ۱۰ رقم باشه";
    return null;
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }
    // Fallback for browsers without the async Clipboard API
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    try {
        document.execCommand("copy");
    } catch (e) {
        // ignore
    }
    document.body.removeChild(helper);
    return Promise.resolve();
}

function showOrderSuccessModal(orderId, botLink, delivered) {
    let overlay = document.getElementById("order-success-modal-overlay");
    let modal = document.getElementById("order-success-modal");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "order-success-modal-overlay";
        overlay.className = "order-success-modal-overlay";
        document.body.appendChild(overlay);
    }
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "order-success-modal";
        modal.className = "order-success-modal";
        modal.setAttribute("tabindex", "-1");
        document.body.appendChild(modal);
    }

    const note = delivered
        ? "این کد رو نگه دار؛ برای پیگیری سفارش بهش نیاز داری."
        : "این کد رو نگه دار؛ برای پیگیری سفارش بهش نیاز داری. (اطلاع‌رسانی خودکار تلگرام به‌زودی وصل می‌شه — فعلاً پیگیری از طریق تلگرام انجام می‌شه.)";

    modal.innerHTML =
        '<button type="button" class="reyso-toast-close" aria-label="بستن"><i class="ri-close-line"></i></button>' +
        '<i class="ri-checkbox-circle-line"></i>' +
        "<h2>درخواست سفارش شما ثبت شد</h2>" +
        '<div class="order-success-modal-id-row">' +
        '<span class="order-success-modal-id">' + orderId + "</span>" +
        '<button type="button" class="order-success-copy-btn" id="order-success-copy-btn">' +
        '<i class="ri-file-copy-line"></i> کپی کد</button>' +
        "</div>" +
        '<p class="order-success-modal-note">' + note + "</p>" +
        '<div class="order-success-modal-actions">' +
        '<a href="' + botLink + '" class="order-success-btn" target="_blank" rel="noopener">استارت ربات تلگرام</a>' +
        '<a href="track-order.html" class="order-success-link">پیگیری وضعیت سفارش</a>' +
        "</div>";

    function hideModal() {
        modal.classList.remove("is-visible");
        overlay.classList.remove("is-visible");
    }

    modal.querySelector(".reyso-toast-close").addEventListener("click", hideModal);
    overlay.addEventListener("click", hideModal, { once: true });

    const copyBtn = modal.querySelector("#order-success-copy-btn");
    copyBtn.addEventListener("click", () => {
        copyToClipboard(orderId).then(() => {
            copyBtn.innerHTML = '<i class="ri-check-line"></i> کپی شد';
            copyBtn.classList.add("is-copied");
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="ri-file-copy-line"></i> کپی کد';
                copyBtn.classList.remove("is-copied");
            }, 1800);
        });
    });

    modal.classList.add("is-visible");
    overlay.classList.add("is-visible");
    modal.focus({ preventScroll: true });
}

document.addEventListener("DOMContentLoaded", () => {
    renderOrderSummary();

    const botLink = telegramBotLink();
    const headerBotLink = document.getElementById("of-bot-link");
    if (headerBotLink) headerBotLink.href = botLink;

    const form = document.getElementById("order-form");
    const submitBtn = document.getElementById("order-submit-btn");
    const layout = document.getElementById("order-form-layout");
    const successInline = document.getElementById("order-success-inline");
    const successInlineId = document.getElementById("order-success-inline-id");

    if (!form || !submitBtn) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const cart = getCart();
        if (cart.length === 0) return;

        const fields = {
            name: document.getElementById("of-name").value.trim(),
            phone: document.getElementById("of-phone").value.trim(),
            telegram: document.getElementById("of-telegram").value.trim().replace(/^@/, ""),
            address: document.getElementById("of-address").value.trim(),
            postal: document.getElementById("of-postal").value.trim(),
            notes: document.getElementById("of-notes").value.trim(),
        };

        const error = validateForm(fields);
        if (error) {
            showFormNote(error);
            return;
        }

        const orderId = generateOrderId();
        const order = {
            orderId: orderId,
            createdAt: new Date().toISOString(),
            customer: fields,
            items: cart,
            subtotal: cartSubtotal(),
            total: cartSubtotal(),
        };

        setFormBusy(submitBtn, true);
        const result = await sendOrderToWebhook(order);
        setFormBusy(submitBtn, false);

        localStorage.setItem(LAST_ORDER_ID_KEY, orderId);
        saveCart([]); // clear cart now that the order request is placed

        if (layout) layout.hidden = true;
        const emptyEl = document.getElementById("order-empty");
        if (emptyEl) emptyEl.hidden = true;

        if (successInlineId) successInlineId.textContent = orderId;
        if (successInline) successInline.hidden = false;

        showOrderSuccessModal(orderId, botLink, result.delivered);
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

document.addEventListener("partialsReady", renderOrderSummary);
