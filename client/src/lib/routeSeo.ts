import pages from "@shared/route-seo.json";

export function normalizeSeoPath(path: string): string {
  return path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
}

export function routeSeo(path: string) {
  const normalized = normalizeSeoPath(path);
  const page = (pages as Record<string, { title: string; description: string; canonical: string }>)[normalized];
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    canonical: page.canonical,
    jsonLdKey: `route-seo:${normalized}`,
  };
}
