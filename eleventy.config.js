// Eleventy configuration for joshua-d-miller.com
// Build: `npm run build` (writes _site/). Preview: `npm start`.
import yaml from "js-yaml";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { DateTime } from "luxon";

const TZ = "America/New_York";

// Heading ids the way the old site (kramdown) made them, so existing #links keep working
const slugifyId = (s) =>
  String(s).trim().toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s+/g, "-");

// Tag anchors on /tags/ (lowercase, anything else becomes a dash)
const slugifyTag = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const toDate = (d) => (d instanceof Date ? d : new Date(d));
const inTz = (d) => DateTime.fromJSDate(toDate(d), { zone: TZ });

export default function (eleventyConfig) {
  // ---- Data, assets, ignores ----
  eleventyConfig.addDataExtension("yml,yaml", (contents) => yaml.load(contents));
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("_drafts/**");
  eleventyConfig.ignores.add("_templates/**");

  // ---- Markdown & code ----
  const md = markdownIt({ html: true, typographer: true }).use(markdownItAnchor, {
    slugify: slugifyId,
    tabIndex: false,
  });
  eleventyConfig.setLibrary("md", md);
  eleventyConfig.addExtension("markdown", { key: "md" }); // older posts use .markdown
  eleventyConfig.addPlugin(syntaxHighlight);

  // ---- Liquid: accept Jekyll-style includes ({% include icon.html name="x" %}) ----
  eleventyConfig.setLiquidOptions({ jekyllInclude: true, dynamicPartials: false });

  // ---- Filters (the handful of Jekyll ones the templates use) ----
  eleventyConfig.addFilter("relative_url", (u) => u);
  eleventyConfig.addFilter("absolute_url", function (u) {
    return new URL(u, this.ctx?.site?.url || "https://www.joshua-d-miller.com").href;
  });
  eleventyConfig.addFilter("date_to_xmlschema", (d) => inTz(d).toISO({ suppressMilliseconds: true }));
  eleventyConfig.addFilter("date_to_rfc822", (d) => inTz(d).toRFC2822());
  eleventyConfig.addFilter("date_fmt", (d, fmt) => inTz(d).toFormat(fmt)); // Luxon tokens, e.g. "LLLL d, yyyy"
  eleventyConfig.addFilter("year", (d) => inTz(d).year);
  eleventyConfig.addFilter("jsonify", (v) => JSON.stringify(v ?? null));
  eleventyConfig.addFilter("xml_escape", (s) =>
    String(s ?? "").replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]));
  eleventyConfig.addFilter("tag_slug", slugifyTag);
  eleventyConfig.addFilter("text", (html) =>
    String(html ?? "").replace(/<\/?(p|div|h\d|li|br|pre|tr|td|th|figure|blockquote)[^>]*>/gi, " $&")
      .replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
  eleventyConfig.addFilter("words", (html) =>
    String(html ?? "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length);
  eleventyConfig.addFilter("reading_minutes", (html) =>
    Math.max(1, Math.floor(String(html ?? "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 220)));
  eleventyConfig.addFilter("truncate_words", (s, n) => {
    const w = String(s ?? "").split(/\s+/);
    return w.length > n ? w.slice(0, n).join(" ") + "…" : w.join(" ");
  });
  // On-page table of contents built from the h2/h3 ids in a page's HTML
  eleventyConfig.addFilter("toc", (html) => {
    const items = [...String(html).matchAll(/<h([23]) id="([^"]+)"[^>]*>(.*?)<\/h\1>/g)];
    let out = "<ul>", inSub = false, any = false;
    for (const [, level, id, inner] of items) {
      const link = `<a href="#${id}">${inner.replace(/<[^>]+>/g, "")}</a>`;
      if (level === "2") {
        if (inSub) { out += "</ul>"; inSub = false; }
        if (any) out += "</li>";
        out += `<li>${link}`; any = true;
      } else {
        if (!inSub) { out += "<ul>"; inSub = true; }
        out += `<li>${link}</li>`;
      }
    }
    if (inSub) out += "</ul>";
    if (any) out += "</li>";
    return out + "</ul>";
  });

  // ---- Collections ----
  // Blog posts, oldest first (templates reverse where they need newest first)
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("_posts/*.{md,markdown,html}").sort((a, b) => a.date - b.date));

  // Posts grouped by year, newest year first
  eleventyConfig.addCollection("postsByYear", (api) => {
    const groups = new Map();
    for (const p of api.getFilteredByGlob("_posts/*").sort((a, b) => b.date - a.date)) {
      const y = inTz(p.date).year;
      if (!groups.has(y)) groups.set(y, []);
      groups.get(y).push(p);
    }
    return [...groups].map(([year, posts]) => ({ year, posts }));
  });

  // Every tag with its posts (newest first), sorted by name
  eleventyConfig.addCollection("tagList", (api) => {
    const tags = new Map();
    for (const p of api.getFilteredByGlob("_posts/*").sort((a, b) => b.date - a.date)) {
      for (const t of p.data.tags || []) {
        if (!tags.has(t)) tags.set(t, []);
        tags.get(t).push(p);
      }
    }
    return [...tags].map(([name, posts]) => ({ name, slug: slugifyTag(name), posts }))
      .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
  });

  return {
    dir: { input: ".", includes: "_includes", layouts: "_layouts", data: "_data", output: "_site" },
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",
    templateFormats: ["md", "markdown", "html", "liquid"],
  };
}
