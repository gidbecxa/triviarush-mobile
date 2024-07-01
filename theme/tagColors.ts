import categories from "~/assets/content/categories-all.json";

const uniqueTags = new Set();
categories.forEach((category) => {
    category.subCategories.forEach((subCategory) => {
        subCategory.tags.forEach((tag) => {
            uniqueTags.add(tag);
        })
    });
});

// A mapping of colors to tags
const tagColors = {};
const palette = ['ff006e', '8338ec', '3a86ff', 'ffbe0b', 'fb5607',];

// Generate rgba color with alpha 0.55
const getRgba = (hex, alpha = 0.55) => {
    const bigInt = parseInt(hex, 16);
    const r = (bigInt >> 16) & 255;
    const g = (bigInt >> 8) & 255;
    const b = bigInt & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Assigning colors to tags for light/dark modes
Array.from(uniqueTags).forEach((tag: string, index) => {
    const color = palette[index % palette.length];
    tagColors[tag] = {
        light: getRgba(color, 0.45),
        dark: getRgba(color, 0.75),
    };
});

export { tagColors };