# joshua-d-miller.com

Source for [www.joshua-d-miller.com](https://www.joshua-d-miller.com), built with [Eleventy](https://www.11ty.dev/)
(Node.js, no Ruby) and published to GitHub Pages by `.github/workflows/pages.yml` on every push to `master`.
Pull requests are built too, so a broken build shows up before you merge. Dependabot opens a PR once a month when
Eleventy, a plugin or a workflow action has an update.

**One-time setup:** in the repo's Settings → Pages → Build and deployment, set Source to **GitHub Actions**.

## Build it

Needs Node.js 20 or newer.

```bash
npm install
npm start          # preview at http://localhost:8080, rebuilds as you edit
npm run build      # writes the finished site to _site/
```

## Where things are

| Path | What it is |
| --- | --- |
| `_data/site.js` | Site title, author, social links |
| `_data/projects.yml` | Projects in the sidebar, on the home page and on `/projects/` |
| `projects/*.md` | One page per project (uses `_layouts/project.html`) |
| `_posts/` | Blog posts. The URL is the file name without the date. Front matter: `title`, `date`, `img`, `tags` |
| `_layouts/`, `_includes/` | The theme (Liquid templates) |
| `assets/css/site.css` | All styles, including the light and dark colors at the top |
| `assets/js/site.js` | Theme switch, search, and keyboard-scrollable tables and code |
| `assets/img/thumbs/` | Small copies of post images used in lists and post headers |
| `eleventy.config.js` | Build settings: Markdown, code highlighting, filters, the post/tag/year lists |

## Writing a post

Copy `_templates/post_template.md` to `_posts/YYYY-MM-DD-your-title.md`. Code blocks can be fenced Markdown
(```` ```bash ````) or `{% highlight bash %} … {% endhighlight %}`.

## Adding a project

1. Add an entry to `_data/projects.yml` (set `page:` if it gets a page here, `featured: true` to show it on the home page).
2. Copy `projects/macoslaps.md` to `projects/<name>.md` and edit the front matter (`title`, `permalink`, `icon`, `tagline`,
   `actions`, `facts`, `toc`). Posts whose titles contain `related_title` are listed at the bottom of the page.

## Adding a post image

Put the image in `assets/img/` and a 160×160 (or smaller) copy with the same name in `assets/img/thumbs/`.

## Light and dark mode

The colors are CSS custom properties at the top of `assets/css/site.css`. "Auto" follows the reader's system setting;
the switch in the sidebar can pin light or dark, which is remembered in the browser. Every text color meets WCAG AA
contrast in both themes. If you change a color, check it with a contrast checker.
