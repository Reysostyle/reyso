/* =====================================================
   REYSO — CONTACT PAGE
   FAQ accordion + a placeholder form submit handler
   (no backend yet — shows a note instead of sending).
===================================================== */

function initContactForm(){
    const form = document.getElementById("contact-form");
    const note = document.getElementById("contact-form-note");
    const btn = document.getElementById("contact-submit-btn");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        note.hidden = false;
        btn.disabled = true;
    });
}

function initFaq(){
    document.querySelectorAll(".faq-item").forEach((item) => {
        const question = item.querySelector(".faq-question");
        question.addEventListener("click", () => {
            const isOpen = item.classList.contains("open");
            document.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("open"));
            if (!isOpen) item.classList.add("open");
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initContactForm();
    initFaq();
});
