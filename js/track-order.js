/* =====================================================
   REYSO — ORDER TRACKING
   Looks up an order's status by Order ID against the n8n
   lookup endpoint (reads from the Google Sheets order log).
   Until that endpoint is configured, the page shows an
   honest "coming soon" note instead of pretending to work.
===================================================== */

/* ---------- Configuration ----------
   Fill in once the n8n workflow exposes a lookup webhook
   that accepts ?orderId=... and returns
   { found: true, status: { payment, production, trackingCode } } */

const TRACK_LOOKUP_URL = ""; // e.g. "https://your-n8n-host/webhook/reyso-order-status"

const PRODUCTION_STEPS = [
    { key: "registered", label: "ثبت شده" },
    { key: "paid", label: "پرداخت تایید شده" },
    { key: "in_production", label: "در حال تولید" },
    { key: "ready", label: "آماده ارسال" },
    { key: "shipped", label: "ارسال شده" },
];

function stepIndex(statusKey) {
    return PRODUCTION_STEPS.findIndex((s) => s.key === statusKey);
}

function renderTimeline(currentKey) {
    const wrap = document.getElementById("track-timeline");
    if (!wrap) return;

    const currentIndex = stepIndex(currentKey);
    wrap.innerHTML = "";

    PRODUCTION_STEPS.forEach((step, index) => {
        const el = document.createElement("div");
        let stateClass = "";
        if (index < currentIndex) stateClass = "is-done";
        if (index === currentIndex) stateClass = "is-current";

        el.className = "track-step " + stateClass;
        el.innerHTML =
            '<span class="track-step-dot"><i class="ri-check-line"></i></span>' +
            '<span class="track-step-label">' + step.label + "</span>";
        wrap.appendChild(el);
    });
}

async function lookupOrder(orderId) {
    const res = await fetch(
        TRACK_LOOKUP_URL + "?orderId=" + encodeURIComponent(orderId)
    );
    if (!res.ok) throw new Error("bad status " + res.status);
    return res.json();
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("track-form");
    const input = document.getElementById("track-order-id");
    const notConfiguredEl = document.getElementById("track-not-configured");
    const errorEl = document.getElementById("track-error");
    const resultEl = document.getElementById("track-result");
    const resultIdEl = document.getElementById("track-result-id");
    const codeWrap = document.getElementById("track-code-wrap");
    const codeEl = document.getElementById("track-code");

    // Pre-fill with the last order placed on this device, if any.
    try {
        const lastId = localStorage.getItem("reyso_last_order_id");
        if (lastId && input) input.value = lastId;
    } catch (e) {
        // ignore
    }

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        errorEl.hidden = true;
        resultEl.hidden = true;
        codeWrap.hidden = true;

        const orderId = input.value.trim();
        if (!orderId) return;

        if (!TRACK_LOOKUP_URL) {
            notConfiguredEl.hidden = false;
            return;
        }

        try {
            const data = await lookupOrder(orderId);
            if (!data.found) {
                errorEl.hidden = false;
                return;
            }

            resultIdEl.textContent = orderId;
            renderTimeline(data.status.production);

            if (data.status.trackingCode) {
                codeEl.textContent = data.status.trackingCode;
                codeWrap.hidden = false;
            }

            resultEl.hidden = false;
        } catch (err) {
            errorEl.hidden = false;
        }
    });
});
