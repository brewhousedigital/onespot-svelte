import slugify from "slugify";

export default function slugURL(item) {
    return slugify(item, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: true
    });
}