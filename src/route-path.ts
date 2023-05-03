// file: src/route-path.ts

const hrefFromPostSlug = (slug: string) => '/blog/post/' + slug;
const hrefFromTagSlug = (slug: string) => '/tag/' + slug;

export { hrefFromPostSlug, hrefFromTagSlug };
