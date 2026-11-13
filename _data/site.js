// Site-wide settings (was _config.yml). Available in templates as `site`.
export default {
  title: "System Administrator Musings",
  description:
    "Notes from managing macOS and iOS devices, plus the open-source tools that came out of them, like macOSLAPS.",
  url: "https://www.joshua-d-miller.com",
  baseurl: "", // kept so old posts' {{ site.baseurl }} links still work
  lang: "en-US",
  postsPerPage: 10,
  author: {
    name: "Joshua D. Miller",
    image: "/assets/img/author.jpg",
    bio: "Husband, father, and avid administrator of devices.",
  },
  social: {
    github: "joshua-d-miller",
    linkedin: "millerjoshuad",
    email: "josh.miller@outlook.com",
    // mastodon: "https://mastodon.social/@you",
    // twitter: "joshuadmiller_",
  },
  twitterHandle: "joshuadmiller_", // for social-card meta tags
  time: new Date(),
};
