/* =====================================================
   REYSO — PRODUCT DATA
   Single source of truth for product cards, the shop
   listing page, and the product detail page. Replace
   image paths and copy with real product photography
   and content when ready.
===================================================== */

const PRODUCTS = [
    {
        id: "manteau-abrisham",
        name: "مانتو کرم ابریشمی",
        category: "مانتو",
        price: 2850000,
        oldPrice: 3200000,
        rating: 5,
        reviews: 42,
        popularity: 91,
        dateAdded: 6,
        description: "طراحی‌شده با پارچه ابریشم درجه‌یک و دوخت دست؛ رنگ کرم ملایمش برای استفاده روزانه و مجالس نیمه‌رسمی هر دو مناسبه.",
        images: ["images/hero1.jpg", "images/hero2.jpg", "images/hero3.jpg", "images/hero4.jpg"],
        sizes: ["36", "38", "40", "42", "44"],
        colors: [
            { name: "کرم", hex: "#E8DFC8", image: "images/hero1.jpg" },
            { name: "سبز تیره", hex: "#1C4436", image: "images/hero2.jpg" },
            { name: "مشکی", hex: "#2B2B2B", image: "images/hero3.jpg" }
        ]
    },
    {
        id: "pirahan-majlesi",
        name: "پیراهن مجلسی زرشکی",
        category: "پیراهن",
        price: 3200000,
        oldPrice: null,
        rating: 4,
        reviews: 27,
        popularity: 74,
        dateAdded: 2,
        description: "پیراهن مجلسی با برش اصولی و پارچه‌ای که به‌آرامی روی بدن می‌افته؛ انتخابی شیک برای مهمانی‌های رسمی.",
        images: ["images/hero2.jpg", "images/hero3.jpg", "images/hero4.jpg", "images/hero5.jpg"],
        sizes: ["36", "38", "40", "42", "44"],
        colors: [
            { name: "زرشکی", hex: "#7B1E3D", image: "images/hero2.jpg" },
            { name: "مشکی", hex: "#2B2B2B", image: "images/hero3.jpg" }
        ]
    },
    {
        id: "kot-shalvar-beige",
        name: "کت و شلوار بژ کلاسیک",
        category: "کت و شلوار",
        price: 4150000,
        oldPrice: 4650000,
        rating: 5,
        reviews: 58,
        popularity: 97,
        dateAdded: 5,
        description: "ست کت‌وشلوار کلاسیک با برش راسته و پارچه بژ لطیف؛ برای محیط کاری و مناسبت‌های رسمی مناسبه.",
        images: ["images/hero3.jpg", "images/hero4.jpg", "images/hero5.jpg", "images/hero6.jpg"],
        sizes: ["36", "38", "40", "42", "44"],
        colors: [
            { name: "بژ", hex: "#D8C9AE", image: "images/hero3.jpg" },
            { name: "سبز تیره", hex: "#1C4436", image: "images/hero4.jpg" },
            { name: "مشکی", hex: "#2B2B2B", image: "images/hero5.jpg" }
        ]
    },
    {
        id: "shomiz-abrisham-sabz",
        name: "شومیز ابریشم سبز",
        category: "شومیز",
        price: 1950000,
        oldPrice: null,
        rating: 4,
        reviews: 19,
        popularity: 58,
        dateAdded: 1,
        description: "شومیز سبک و خنک با پارچه ابریشمی و رنگ سبز آرام؛ برای ست کردن با شلوار یا دامن، هر دو خوش می‌شینه.",
        images: ["images/hero4.jpg", "images/hero5.jpg", "images/hero6.jpg", "images/hero1.jpg"],
        sizes: ["36", "38", "40", "42", "44"],
        colors: [
            { name: "سبز", hex: "#3F5C48", image: "images/hero4.jpg" },
            { name: "کرم", hex: "#E8DFC8", image: "images/hero5.jpg" }
        ]
    },
    {
        id: "palto-pashmi-zeytooni",
        name: "پالتو پشمی زیتونی",
        category: "پالتو",
        price: 3800000,
        oldPrice: 4200000,
        rating: 5,
        reviews: 33,
        popularity: 82,
        dateAdded: 4,
        description: "پالتو پشمی گرم با رنگ زیتونی؛ برای فصل سرد، هم گرمای لازم رو می‌ده، هم ظاهر مرتبی داره.",
        images: ["images/hero5.jpg", "images/hero6.jpg", "images/hero1.jpg", "images/hero2.jpg"],
        sizes: ["36", "38", "40", "42", "44"],
        colors: [
            { name: "زیتونی", hex: "#6B7A4A", image: "images/hero5.jpg" },
            { name: "خاکی", hex: "#A79373", image: "images/hero6.jpg" }
        ]
    },
    {
        id: "manteau-linen-khaki",
        name: "مانتو لینن خاکی",
        category: "مانتو",
        price: 2450000,
        oldPrice: null,
        rating: 4,
        reviews: 21,
        popularity: 65,
        dateAdded: 3,
        description: "مانتو لینن سبک با رنگ خاکی؛ انتخابی راحت و خنک برای روزهای گرم سال.",
        images: ["images/hero6.jpg", "images/hero1.jpg", "images/hero2.jpg", "images/hero3.jpg"],
        sizes: ["36", "38", "40", "42", "44"],
        colors: [
            { name: "خاکی", hex: "#A79373", image: "images/hero6.jpg" },
            { name: "کرم", hex: "#E8DFC8", image: "images/hero1.jpg" }
        ]
    }
];

function getProductById(id) {
    return PRODUCTS.find((p) => p.id === id) || null;
}

function formatToman(amount) {
    return amount.toLocaleString("fa-IR") + " تومان";
}
