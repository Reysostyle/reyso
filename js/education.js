/* =====================================================
   REYSO — EDUCATION PAGE
   Renders LESSONS (lessons.js) into filterable category
   tabs + a grid of lesson cards. Clicking a card opens a
   modal with the Aparat embed for that lesson.

   To go live with a real video: set that lesson's
   `aparatId` in js/lessons.js to the Aparat video hash
   (the part of the Aparat share/embed URL after
   /video/video/embed/videohash/). Until it's set, the
   modal shows a "coming soon" placeholder instead of a
   broken embed.
===================================================== */

let eduActiveCategory = "همه";

function eduRenderTabs() {
    const wrap = document.getElementById("edu-tabs");
    const categories = ["همه", ...lessonUniqueCategories()];

    wrap.innerHTML = "";
    categories.forEach((cat) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "edu-tab" + (cat === eduActiveCategory ? " active" : "");
        btn.textContent = cat;
        btn.addEventListener("click", () => {
            eduActiveCategory = cat;
            wrap.querySelectorAll(".edu-tab").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            eduRenderGrid();
        });
        wrap.appendChild(btn);
    });
}

function eduCreateCard(lesson) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "edu-card";
    card.innerHTML =
        '<div class="edu-card-media">' +
        '<img src="' + lesson.thumbnail + '" alt="' + lesson.title + '">' +
        '<span class="edu-play-btn"><i class="ri-play-fill"></i></span>' +
        '<span class="edu-duration">' + lesson.duration + "</span>" +
        "</div>" +
        '<div class="edu-card-info">' +
        '<span class="edu-card-tag">' + lesson.category + "</span>" +
        '<p class="edu-card-title">' + lesson.title + "</p>" +
        "</div>";

    card.addEventListener("click", () => eduOpenModal(lesson));
    return card;
}

function eduRenderGrid() {
    const grid = document.getElementById("edu-grid");
    const list = eduActiveCategory === "همه"
        ? LESSONS
        : LESSONS.filter((l) => l.category === eduActiveCategory);

    grid.innerHTML = "";
    list.forEach((lesson) => grid.appendChild(eduCreateCard(lesson)));
}

function eduOpenModal(lesson) {
    const player = document.getElementById("edu-modal-player");
    const tag = document.getElementById("edu-modal-tag");
    const title = document.getElementById("edu-modal-title");
    const desc = document.getElementById("edu-modal-desc");

    tag.textContent = lesson.category;
    title.textContent = lesson.title;
    desc.textContent = lesson.description;

    if (lesson.aparatId) {
        player.innerHTML =
            '<iframe src="https://www.aparat.com/video/video/embed/videohash/' +
            lesson.aparatId +
            '/vt/frame" allowFullScreen webkitallowfullscreen mozallowfullscreen loading="lazy"></iframe>';
    } else {
        player.innerHTML =
            '<div class="edu-coming-soon">' +
            '<i class="ri-film-line"></i>' +
            "<p>این ویدیو به‌زودی روی آپارات بارگذاری می‌شه.</p>" +
            "</div>";
    }

    document.getElementById("edu-modal").classList.add("open");
    document.body.style.overflow = "hidden";
}

function eduCloseModal() {
    document.getElementById("edu-modal").classList.remove("open");
    document.body.style.overflow = "";
    document.getElementById("edu-modal-player").innerHTML = "";
}

function initEducation() {
    const countEl = document.getElementById("edu-lesson-count");
    if (countEl) countEl.textContent = LESSONS.length.toLocaleString("fa-IR");

    eduRenderTabs();
    eduRenderGrid();

    document.getElementById("edu-modal-close").addEventListener("click", eduCloseModal);
    document.getElementById("edu-modal-backdrop").addEventListener("click", eduCloseModal);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") eduCloseModal();
    });
}

document.addEventListener("DOMContentLoaded", initEducation);
