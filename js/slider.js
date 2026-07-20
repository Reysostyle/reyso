/* ==========================
   REYSO SLIDER
   Logic unchanged — autoplay only, no manual controls.
========================== */

const cards = document.querySelectorAll(".card");
const dots = document.querySelectorAll(".dot");

let current = 0;

function updateSlider(){

    // Reset cards
    cards.forEach(card => {
        card.className = "card hidden";
    });

    // Reset dots
    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    // Calculate positions
    const active = current;
    const next = (current + 1) % cards.length;
    const prev = (current - 1 + cards.length) % cards.length;

    // Apply classes
    cards[active].className = "card active";
    cards[next].className = "card next";
    cards[prev].className = "card prev";

    // Active dot
    if (dots[current]) {
        dots[current].classList.add("active");
    }

}

function nextSlide(){
    current++;
    if (current >= cards.length) {
        current = 0;
    }
    updateSlider();
}

// Initial load
updateSlider();

// Auto play
setInterval(nextSlide, 3000);
