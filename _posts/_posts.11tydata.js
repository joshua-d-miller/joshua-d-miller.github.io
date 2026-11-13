// Settings shared by every blog post.
export default {
  layout: "post",
  isPost: true,
  // Same URLs as the old Jekyll site: /<file name without the date>/
  permalink: (data) => `/${data.page.fileSlug.replace(/-+/g, "-")}/`,
};
