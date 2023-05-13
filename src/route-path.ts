// file: src/route-path.ts

const hrefFromPostSlug = (slug: string) => '/blog/post/' + slug;
const hrefFromTagSlug = (slug: string) => '/tag/' + slug;
const hrefFromWorkSlug = (slug: string) => '/work/' + slug;

export { hrefFromPostSlug, hrefFromTagSlug, hrefFromWorkSlug };
