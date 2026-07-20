/* ==========================
   REYSO — STORY SCROLL REVEAL
   Drives --story-progress (0 → 1) on .story-stage based on
   how far the section has scrolled through the viewport.
   Only listens while the section is actually visible.
========================== */

const storyStage = document.querySelector(".story-stage");

if (storyStage) {

    let ticking = false;

    function updateProgress() {

        const rect = storyStage.getBoundingClientRect();
        const vh = window.innerHeight;

        // Progress starts when the stage enters the bottom of the
        // viewport and reaches 1 once it nears the top.
        const start = vh * 0.85;
        const end = vh * 0.25;

        let progress = (start - rect.top) / (start - end);
        progress = Math.min(1, Math.max(0, progress));

        storyStage.style.setProperty("--story-progress", progress.toFixed(3));

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }

    // Only attach the scroll listener while the section is near/in view
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    updateProgress();
                    window.addEventListener("scroll", onScroll, { passive: true });
                } else {
                    window.removeEventListener("scroll", onScroll);
                }
            });
        },
        { rootMargin: "20% 0px 20% 0px" }
    );

    observer.observe(storyStage);

    // Initial state on load
    updateProgress();

}
