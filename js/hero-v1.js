(function () {
    const slides = document.querySelectorAll(".hero-v1-slide");
    const ticks = document.querySelectorAll(".hero-v1-tick");
    if (!slides.length) return;

    let current = 0;
    const DURATION = 4500;

    function show(index) {
        slides.forEach((s, i) => s.classList.toggle("active", i === index));
        ticks.forEach((t, i) => t.classList.toggle("active", i === index));
        slides[index].querySelector("img").style.animation = "none";
        void slides[index].querySelector("img").offsetWidth;
        slides[index].querySelector("img").style.animation = "";
    }

    show(0);
    setInterval(() => {
        current = (current + 1) % slides.length;
        show(current);
    }, DURATION);

    ticks.forEach((tick, i) => {
        tick.addEventListener("click", () => {
            current = i;
            show(current);
        });
    });
})();
