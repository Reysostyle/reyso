/* ==========================
   REYSO QUICK VIEW
   Lets a shopper preview a product (image, price, size,
   color, quantity, add to cart) without leaving the shop
   grid or homepage. Triggered by any ".quick-view-btn" on
   a product card. Reuses the same pd-* classes/styles as
   shop-details.html so it inherits that page's look for
   free. Requires products.js and cart.js to already be
   loaded on the page.
========================== */

let qvProduct = null;
let qvSelectedSize = null;
let qvSelectedColor = null;
let qvQty = 1;

function qvBuildModal() {
    if (document.getElementById("qv-modal")) return;

    const modal = document.createElement("div");
    modal.className = "qv-modal";
    modal.id = "qv-modal";
    modal.innerHTML =
        '<div class="qv-backdrop"></div>' +
        '<div class="qv-box">' +
            '<button type="button" class="qv-close" aria-label="بستن"><i class="ri-close-line"></i></button>' +
            '<div class="qv-content">' +
                '<div class="qv-media"><img id="qv-image" src="" alt=""></div>' +
                '<div class="qv-info">' +
                    '<h3 id="qv-name"></h3>' +
                    '<div class="pd-price">' +
                        '<span class="now" id="qv-price-now"></span>' +
                        '<span class="was" id="qv-price-old" hidden></span>' +
                        '<span class="badge" id="qv-discount-badge" hidden></span>' +
                    '</div>' +
                    '<p class="qv-desc" id="qv-desc"></p>' +
                    '<div class="pd-block"><p>سایز</p><div class="pd-options" id="qv-sizes"></div></div>' +
                    '<div class="pd-block"><p>رنگ</p><div class="pd-options" id="qv-colors"></div></div>' +
                    '<div class="pd-block"><p>تعداد</p>' +
                        '<div class="pd-qty">' +
                            '<button type="button" id="qv-qty-minus">−</button>' +
                            '<span id="qv-qty-value">۱</span>' +
                            '<button type="button" id="qv-qty-plus">+</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="pd-cta">' +
                        '<button type="button" class="pd-add-btn" id="qv-add-btn">افزودن به سبد خرید</button>' +
                    '</div>' +
                    '<a href="#" class="qv-full-link" id="qv-full-link">مشاهده کامل محصول <i class="ri-arrow-left-line"></i></a>' +
                '</div>' +
            '</div>' +
        '</div>';

    document.body.appendChild(modal);

    modal.querySelector(".qv-backdrop").addEventListener("click", qvClose);
    modal.querySelector(".qv-close").addEventListener("click", qvClose);

    document.getElementById("qv-qty-minus").addEventListener("click", () => {
        if (qvQty > 1) qvQty -= 1;
        document.getElementById("qv-qty-value").textContent = qvQty.toLocaleString("fa-IR");
    });

    document.getElementById("qv-qty-plus").addEventListener("click", () => {
        qvQty += 1;
        document.getElementById("qv-qty-value").textContent = qvQty.toLocaleString("fa-IR");
    });

    document.getElementById("qv-add-btn").addEventListener("click", () => {
        if (!qvProduct) return;

        const cartItem = {
            id: qvProduct.id,
            name: qvProduct.name,
            price: qvProduct.price,
            image: qvSelectedColor.image,
            size: qvSelectedSize,
            color: qvSelectedColor.name,
            qty: qvQty
        };

        addToCart(cartItem);
        showCartToast(cartItem);
        qvClose();
    });
}

function qvRenderSizes() {
    const wrap = document.getElementById("qv-sizes");
    wrap.innerHTML = "";
    const soldOutSizes = qvProduct.soldOutSizes || [];
    qvProduct.sizes.forEach((size) => {
        const isSoldOut = soldOutSizes.includes(size);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pd-size-btn" + (size === qvSelectedSize ? " active" : "") + (isSoldOut ? " sold-out" : "");
        btn.textContent = size;
        if (isSoldOut) {
            btn.disabled = true;
            btn.title = "این سایز ناموجود است";
        } else {
            btn.addEventListener("click", () => {
                qvSelectedSize = size;
                wrap.querySelectorAll(".pd-size-btn").forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
            });
        }
        wrap.appendChild(btn);
    });
}

function qvRenderColors() {
    const wrap = document.getElementById("qv-colors");
    wrap.innerHTML = "";
    qvProduct.colors.forEach((color) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pd-color-btn" + (color.name === qvSelectedColor.name ? " active" : "");
        btn.innerHTML = '<span class="dot" style="background:' + color.hex + '"></span> ' + color.name;
        btn.addEventListener("click", () => {
            qvSelectedColor = color;
            wrap.querySelectorAll(".pd-color-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById("qv-image").src = color.image;
        });
        wrap.appendChild(btn);
    });
}

function qvOpen(id) {
    const product = (typeof getProductById === "function") ? getProductById(id) : null;
    if (!product) return;

    qvBuildModal();

    qvProduct = product;
    const soldOutSizes = product.soldOutSizes || [];
    qvSelectedSize = product.sizes.find((s) => !soldOutSizes.includes(s)) || product.sizes[0];
    qvSelectedColor = product.colors[0];
    qvQty = 1;

    document.getElementById("qv-image").src = qvSelectedColor.image;
    document.getElementById("qv-image").alt = product.name;
    document.getElementById("qv-name").textContent = product.name;
    document.getElementById("qv-desc").textContent = product.description;
    document.getElementById("qv-price-now").textContent = formatToman(product.price);

    const oldEl = document.getElementById("qv-price-old");
    const badgeEl = document.getElementById("qv-discount-badge");
    if (product.oldPrice) {
        oldEl.textContent = formatToman(product.oldPrice);
        oldEl.hidden = false;
        const percent = Math.round((1 - product.price / product.oldPrice) * 100);
        badgeEl.textContent = percent.toLocaleString("fa-IR") + "٪ تخفیف";
        badgeEl.hidden = false;
    } else {
        oldEl.hidden = true;
        badgeEl.hidden = true;
    }

    document.getElementById("qv-qty-value").textContent = "۱";
    document.getElementById("qv-full-link").href = "shop-details.html?id=" + product.id;

    qvRenderSizes();
    qvRenderColors();

    document.getElementById("qv-modal").classList.add("open");
    document.body.classList.add("qv-open");
}

function qvClose() {
    const modal = document.getElementById("qv-modal");
    if (modal) modal.classList.remove("open");
    document.body.classList.remove("qv-open");
}

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".quick-view-btn");
    if (!btn) return;
    e.preventDefault();

    const card = btn.closest(".product-card");
    const link = card ? card.querySelector(".product-link") : null;
    if (!link) return;

    const id = new URL(link.getAttribute("href"), window.location.href).searchParams.get("id");
    if (id) qvOpen(id);
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") qvClose();
});
