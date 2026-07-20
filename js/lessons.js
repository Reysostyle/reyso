/* =====================================================
   REYSO — LESSONS DATA
   Video tutorials taught by Reyhaneh, hosted on Aparat.
   Replace `aparatId` with the real Aparat video hash for
   each lesson once uploaded (see the embed URL pattern in
   js/education.js). Thumbnails are placeholders — swap in
   real video thumbnails when available.
===================================================== */

const LESSONS = [
    {
        id: "l1",
        title: "آشنایی با ابزار الگوسازی",
        category: "الگوسازی",
        duration: "۱۸:۲۰",
        thumbnail: "images/trust-poster.jpg",
        aparatId: "",
        description: "معرفی ابزارهای پایه‌ی الگوسازی و نحوه‌ی صحیح استفاده از هرکدوم، قدم اول برای شروع دوخت اصولی."
    },
    {
        id: "l2",
        title: "الگوی پایه بالاتنه زنانه",
        category: "الگوسازی",
        duration: "۲۴:۴۵",
        thumbnail: "images/hero3.jpg",
        aparatId: "",
        description: "رسم گام‌به‌گام الگوی پایه‌ی بالاتنه بر اساس سایزبندی استاندارد، پایه‌ی خیلی از مدل‌های دیگه."
    },
    {
        id: "l3",
        title: "اصول دوخت درزهای ظریف",
        category: "دوخت",
        duration: "۱۵:۱۰",
        thumbnail: "images/hero1.jpg",
        aparatId: "",
        description: "تکنیک‌های دوخت درز روی پارچه‌های ظریف مثل ابریشم و شیفون بدون آسیب به بافت پارچه."
    },
    {
        id: "l4",
        title: "دوخت آستین ساده و کلاسیک",
        category: "دوخت",
        duration: "۲۰:۰۵",
        thumbnail: "images/hero4.jpg",
        aparatId: "",
        description: "روش صحیح نصب و دوخت آستین ساده، از خط‌کشی تا اتوی نهایی."
    },
    {
        id: "l5",
        title: "اصول طراحی لباس مجلسی",
        category: "طراحی لباس",
        duration: "۲۲:۳۰",
        thumbnail: "images/hero2.jpg",
        aparatId: "",
        description: "چطور از ایده‌ی اولیه به طرح نهایی یک لباس مجلسی برسیم؛ فرم، تناسب و انتخاب پارچه."
    },
    {
        id: "l6",
        title: "ترکیب رنگ و پارچه در طراحی",
        category: "طراحی لباس",
        duration: "۱۶:۴۰",
        thumbnail: "images/hero6.jpg",
        aparatId: "",
        description: "اصول انتخاب و ترکیب رنگ‌ها و جنس پارچه برای رسیدن به یک طرح هماهنگ و لوکس."
    }
];

function getLessonById(id) {
    return LESSONS.find((l) => l.id === id) || null;
}

function lessonUniqueCategories() {
    return [...new Set(LESSONS.map((l) => l.category))];
}
