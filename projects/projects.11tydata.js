// Settings shared by every project page.
// A project marked `hidden: true` in _data/projects.yml gets no page at all
// (and so is left out of the sitemap and search), until the flag is removed.
const isHidden = (data) =>
  (data.projects || []).some((p) => p.hidden && p.page === data.permalink);

export default {
  layout: "project",
  eleventyComputed: {
    permalink: (data) => (isHidden(data) ? false : data.permalink),
    eleventyExcludeFromCollections: (data) => isHidden(data) || data.eleventyExcludeFromCollections,
  },
};
