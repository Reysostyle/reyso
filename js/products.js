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
        soldOutSizes: [], // e.g. ["36", "44"] — mark a size sold out by adding it here
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
        soldOutSizes: [], // e.g. ["36", "44"] — mark a size sold out by adding it here
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
        soldOutSizes: [], // e.g. ["36", "44"] — mark a size sold out by adding it here
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
        soldOutSizes: [], // e.g. ["36", "44"] — mark a size sold out by adding it here
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
        soldOutSizes: [], // e.g. ["36", "44"] — mark a size sold out by adding it here
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
        soldOutSizes: [], // e.g. ["36", "44"] — mark a size sold out by adding it here
        colors: [
            { name: "خاکی", hex: "#A79373", image: "images/hero6.jpg" },
            { name: "کرم", hex: "#E8DFC8", image: "images/hero1.jpg" }
        ]
    },

    /* ---------- New photos (placeholder names/prices — adjust freely) ---------- */

    {
        id: "manteau-krem-haashie",
        name: "مانتو کرم حاشیه مشکی",
        category: "مانتو",
        price: 3100000,
        oldPrice: null,
        rating: 5,
        reviews: 8,
        popularity: 68,
        dateAdded: 10,
        description: "مانتو بلند کرم با حاشیه‌دوزی مشکی و پارچه‌ای سبک و ریزشی؛ طرحی ساده و شیک برای پوشش روزانه.",
        images: ["images/manto.jpg"],
        sizes: ["36", "38", "40", "42", "44"],
        soldOutSizes: [],
        colors: [
            { name: "کرم", hex: "#E8DFC8", image: "images/manto.jpg" }
        ]
    },
    {
        id: "shomiz-saten-sabz",
        name: "شومیز ساتن سبز سالویا",
        category: "شومیز",
        price: 2250000,
        oldPrice: null,
        rating: 4,
        reviews: 6,
        popularity: 60,
        dateAdded: 11,
        description: "شومیز ساتن با سطحی براق و رنگ سبز سالویا؛ آستین بلند و یقه پیراهنی، مناسب ست کردن با شلوار پارچه‌ای.",
        images: ["images/coat.jpg"],
        sizes: ["36", "38", "40", "42", "44"],
        soldOutSizes: [],
        colors: [
            { name: "سبز سالویا", hex: "#9CAF88", image: "images/coat.jpg" }
        ]
    },
    {
        id: "palto-guipure-shatuti",
        name: "ژاکت گیپور شاتوتی",
        category: "پالتو",
        price: 2950000,
        oldPrice: null,
        rating: 5,
        reviews: 5,
        popularity: 63,
        dateAdded: 12,
        description: "ژاکت زیپ‌دار گیپوردوزی‌شده با رنگ شاتوتی؛ لایه‌ای سبک و ظریف برای روی تاپ یا پیراهن.",
        images: ["images/caroll-1.jpg"],
        sizes: ["36", "38", "40", "42", "44"],
        soldOutSizes: [],
        colors: [
            { name: "شاتوتی", hex: "#4A2C2A", image: "images/caroll-1.jpg" }
        ]
    },
    {
        id: "shalvar-pili-beige",
        name: "شلوار پیلی‌دار بژ",
        category: "کت و شلوار",
        price: 1850000,
        oldPrice: null,
        rating: 4,
        reviews: 7,
        popularity: 55,
        dateAdded: 13,
        description: "شلوار پارچه‌ای پیلی‌دار با کمربند و فاق بلند؛ برشی راحت و شیک برای پوشش روزمره یا اداری.",
        images: ["images/Pants-1.jpg"],
        sizes: ["36", "38", "40", "42", "44"],
        soldOutSizes: [],
        colors: [
            { name: "بژ", hex: "#D8C9AE", image: "images/Pants-1.jpg" }
        ]
    },

    /* ---------- ست فصلی (new collection) ---------- */

    {
        id: "set-linen-beige",
        name: "ست کژوال لینن بژ",
        category: "ست",
        price: 3450000,
        oldPrice: null,
        rating: 5,
        reviews: 4,
        popularity: 72,
        dateAdded: 14,
        description: "ست دو تکه لینن شامل ژاکت بلند و شلوار راحتی؛ ترکیبی راحت و شیک برای استفاده روزمره.",
        images: ["images/set-1.jpg"],
        sizes: ["36", "38", "40", "42", "44"],
        soldOutSizes: [],
        colors: [
            { name: "بژ", hex: "#D8C9AE", image: "images/set-1.jpg" }
        ]
    },
    {
        id: "set-boho-sefid",
        name: "ست بوهو سفید",
        category: "ست",
        price: 3600000,
        oldPrice: null,
        rating: 4,
        reviews: 3,
        popularity: 66,
        dateAdded: 15,
        description: "ست سفید بلوز و شلوار گشاد با پارچه‌ای سبک؛ حال‌وهوای بوهو و راحتی مطلق برای سفر و مسافرت.",
        images: ["images/set-2.jpg"],
        sizes: ["36", "38", "40", "42", "44"],
        soldOutSizes: [],
        colors: [
            { name: "سفید", hex: "#F7F3EA", image: "images/set-2.jpg" }
        ]
    },
    {
        id: "set-kamarbandi-cream",
        name: "ست کمربندی کرم",
        category: "ست",
        price: 3750000,
        oldPrice: null,
        rating: 5,
        reviews: 3,
        popularity: 69,
        dateAdded: 16,
        description: "ست کرم با کمربند برجسته در قسمت کمر و شلوار گشاد؛ برشی مدرن با ظاهری منظم و اداری.",
        images: ["images/set-3.jpg"],
        sizes: ["36", "38", "40", "42", "44"],
        soldOutSizes: [],
        colors: [
            { name: "کرم", hex: "#E8DFC8", image: "images/set-3.jpg" }
        ]
    },
    {
        id: "set-goldoozi-sefid",
        name: "ست گلدوزی سفید",
        category: "ست",
        price: 3950000,
        oldPrice: null,
        rating: 5,
        reviews: 5,
        popularity: 75,
        dateAdded: 17,
        description: "ست کیمونووار سفید با گلدوزی ظریف شکوفه؛ برای مجالس نیمه‌رسمی و مهمانی‌های بهاری.",
        images: ["images/set-4.jpg"],
        sizes: ["36", "38", "40", "42", "44"],
        soldOutSizes: [],
        colors: [
            { name: "سفید", hex: "#F7F3EA", image: "images/set-4.jpg" }
        ]
    },
    {
        id: "set-lounge-doodi",
        name: "ست لانژ دودی‌آبی",
        category: "ست",
        price: 3300000,
        oldPrice: null,
        rating: 4,
        reviews: 2,
        popularity: 58,
        dateAdded: 18,
        description: "ست لانژ با رنگ دودی‌آبی آرام و بافتی نرم؛ برای خانه یا بیرون‌رفتن‌های غیررسمی، هر دو مناسبه.",
        images: ["images/set-5.jpg"],
        sizes: ["36", "38", "40", "42", "44"],
        soldOutSizes: [],
        colors: [
            { name: "دودی‌آبی", hex: "#4E5A66", image: "images/set-5.jpg" }
        ]
    }
];

/* =====================================================
   COLLECTIONS — metadata for the collection landing
   pages (collections.html tiles + collection-details.html
   banner). "slug" must match a PRODUCTS[].category value.
===================================================== */
const COLLECTIONS = [
    {
        slug: "مانتو",
        name: "مانتو",
        image: "images/manto.jpg",
        description: "مانتوهایی با برش‌های ساده و پارچه‌های لطیف، برای پوشش روزانه‌ای که هم راحت باشه هم شیک."
    },
    {
        slug: "پالتو",
        name: "پالتو",
        image: "images/hero5.jpg",
        description: "لایه‌های گرم و بیرونی از جنس پشم و گیپور؛ همراه‌های فصل سرد شما."
    },
    {
        slug: "کت و شلوار",
        name: "کت و شلوار",
        image: "images/hero3.jpg",
        description: "ست‌های رسمی با برش اصولی، برای محیط کار و مناسبت‌های رسمی."
    },
    {
        slug: "شومیز",
        name: "شومیز",
        image: "images/hero4.jpg",
        description: "شومیزهایی سبک و ریزشی که به‌راحتی با هر پایین‌تنه‌ای ست می‌شن."
    },
    {
        slug: "پیراهن",
        name: "پیراهن",
        image: "images/hero2.jpg",
        description: "پیراهن‌های مجلسی و روزمره با پارچه‌هایی که به‌آرامی روی بدن می‌افتن."
    },
    {
        slug: "ست",
        name: "ست فصلی",
        image: "images/set-4.jpg",
        description: "ست‌های دوتکه فصل جدید؛ ترکیبی از راحتی و ظرافت برای هر ساعت از روز."
    }
];

function getCollectionBySlug(slug) {
    return COLLECTIONS.find((c) => c.slug === slug) || null;
}

function getProductById(id) {
    return PRODUCTS.find((p) => p.id === id) || null;
}

function formatToman(amount) {
    return amount.toLocaleString("fa-IR") + " تومان";
}

/* Size guide (cm). Placeholder measurements — replace with
   ReySo's real measurements whenever they're ready; every
   product currently shares this table. */
const SIZE_GUIDE = [
    { size: "36", bust: 84, waist: 66, hip: 90 },
    { size: "38", bust: 88, waist: 70, hip: 94 },
    { size: "40", bust: 92, waist: 74, hip: 98 },
    { size: "42", bust: 96, waist: 78, hip: 102 },
    { size: "44", bust: 100, waist: 82, hip: 106 }
];
