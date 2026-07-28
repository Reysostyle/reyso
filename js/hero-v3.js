(function () {
    const viewport = document.getElementById("hero-v3-viewport");
    const track = document.getElementById("hero-v3-track");
    const counterCurrent = document.getElementById("hero-v3-counter-current");
    if (!viewport || !track) return;

    const cards = Array.from(track.children);
    const toFa = (n) => n.toLocaleString("fa-IR", { minimumIntegerDigits: 2 });

    function updateCounter() {
        const rect = viewport.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        let closest = 0;
        let closestDist = Infinity;
        cards.forEach((card, i) => {
            const cRect = card.getBoundingClientRect();
            const cCenter = cRect.left + cRect.width / 2;
            const dist = Math.abs(cCenter - center);
            if (dist < closestDist) {
                closestDist = dist;
                closest = i;
            }
        });
        if (counterCurrent) counterCurrent.textContent = toFa(closest + 1);
    }

    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    viewport.addEventListener("pointerdown", (e) => {
        isDown = true;
        moved = false;
        startX = e.clientX;
        startScroll = viewport.scrollLeft;
        viewport.classList.add("dragging");
    });

    viewport.addEventListener("pointermove", (e) => {
        if (!isDown) return;
        const delta = e.clientX - startX;
        if (Math.abs(delta) > 3) moved = true;
        viewport.scrollLeft = startScroll + delta;
    });

    function endDrag() {
        if (!isDown) return;
        isDown = false;
        viewport.classList.remove("dragging");
    }

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerleave", endDrag);

    let scrollTicking = false;
    viewport.addEventListener("scroll", () => {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => {
            updateCounter();
            scrollTicking = false;
        });
    });

    updateCounter();
})();
