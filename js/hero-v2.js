(function () {
    const slides = document.querySelectorAll(".hero-v2-slide");
    const dots = document.querySelectorAll(".hero-v2-dot");
    const tagLabel = document.querySelector(".hero-v2-tag span");
    if (!slides.length) return;

    const fabrics = ["ابریشم درجه‌یک", "پشم نرم", "کتان سبک", "مخمل ظریف"];
    let current = 0;
    const DURATION = 4200;

    function show(index) {
        slides.forEach((s, i) => s.classList.toggle("active", i === index));
        dots.forEach((d, i) => d.classList.toggle("active", i === index));
        if (tagLabel) tagLabel.textContent = fabrics[index] || fabrics[0];
    }

    show(0);
    setInterval(() => {
        current = (current + 1) % slides.length;
        show(current);
    }, DURATION);

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            current = i;
            show(current);
        });
    });
})();
