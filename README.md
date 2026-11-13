# joshua-d-miller.com

Source for [www.joshua-d-miller.com](https://www.joshua-d-miller.com), built by GitHub Pages with Jekyll.
The theme lives in this repo (no remote theme), so nothing changes unless it changes here.

## Run it locally

```bash
bundle install
bundle exec jekyll serve --livereload
```

Then open <http://localhost:4000>.

## Where things are

| Path | What it is |
| --- | --- |
| `_config.yml` | Site title, author, social links, plugins |
| `_data/projects.yml` | Projects in the sidebar, on the home page and on `/projects/` |
| `projects/*.md` | One page per project (uses `_layouts/project.html`) |
| `_posts/` | Blog posts. Front matter: `title`, `date`, `img` (a file in `assets/img/`), `tags` |
| `_layouts/`, `_includes/` | The theme |
| `assets/css/site.css` | All styles, including the light and dark colors at the top |
| `assets/js/site.js` | Theme switch, search, and keyboard-scrollable tables and code |
| `assets/img/thumbs/` | Small copies of post images used in lists and post headers |

## Adding a project

1. Add an entry to `_data/projects.yml` (set `page:` if it gets a page here, `featured: true` to show it on the home page).
2. Copy `projects/macoslaps.md` to `projects/<name>.md` and edit the front matter (`title`, `permalink`, `icon`, `tagline`, `actions`, `facts`).
   Posts whose titles contain `related_title` are listed at the bottom of the page.

## Adding a post image

Put the image in `assets/img/` and a 160×160 (or smaller) copy with the same name in `assets/img/thumbs/`.

## Light and dark mode

The colors are CSS custom properties at the top of `assets/css/site.css`. "Auto" follows the reader's system setting;
the switch in the sidebar can pin light or dark, which is remembered in the browser. Every text color meets WCAG AA contrast
in both themes. If you change a color, check it with a contrast checker.
