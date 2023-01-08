import { Route, Router } from "./router";
import showdown from "showdown";
import * as yaml from "yaml";
import postPreviewHtml from "./post-preview.html?raw";
import { postsList } from "./posts";
import { makeTableOfContents } from "./dom";
// import * as aiProblemMap from "./pages/ai-problem-map";
// import aiProblemMapHtml from "./ai-problem-map.html?raw";
// import aiProblemMapData from "./data/ai-problem-map.json";
// import infExtractOpporMapData from "./data/inf-extract-oppor-map.json";
// import * as sigmaGraph from "./pages/sigma-graph";

export interface Post {
  name: string;
  md: string;
  article: HTMLDivElement;
  preview: HTMLSpanElement;
  url: string;
  date: string;
}

const frontMatterRegex = /---(.|\n)*---/;

function stripFrontMatter(post: string): string {
  return post.replace(frontMatterRegex, "");
}

function parseFrontMatter(post: string): { [key: string]: any } {
  const frontMatter = post.match(frontMatterRegex);
  if (!frontMatter) {
    throw new Error("No front matter provided.");
  }
  const frontMatterString = frontMatter[0]
    .replace("---", "")
    .replace("---", "")
    .trim();
  try {
    return yaml.parse(frontMatterString);
  } catch (e) {
    throw new Error(`Invalid front matter: ${e}`);
  }
}

function addPreviewHeadingLink(post: Post) {
  const heading = post.preview.querySelector("h1") as HTMLHeadingElement;
  heading.innerHTML = `<a class="heading" href="${post.url}">${heading.innerHTML}</a>`;
}

function renderTemplate(template: string, props: { [key: string]: string }) {
  let result = template;
  Object.entries(props).forEach(([key, value]) => {
    result = result.replace(`{{${key}}}`, value);
  });
  return result;
}

function makePreviewText(post: string): string {
  // Stop at limit or at second heading
  const previewLimit = 500;
  const secondHeadingIndex = post.indexOf("##");
  if (secondHeadingIndex === -1) {
    return post.substring(0, previewLimit) + "...";
  }
  if (secondHeadingIndex > previewLimit) {
    return post.substring(0, previewLimit) + "...";
  }
  return post.substring(0, secondHeadingIndex);
}

const posts: { [name: string]: Post } = {};
const converter = new showdown.Converter();
postsList.forEach((post) => {
  const metaData = parseFrontMatter(post);
  const url = "#/post/" + metaData["name"];
  const date = new Date(metaData["date"]);
  metaData["date"] = date.toLocaleDateString();
  post = stripFrontMatter(post);
  const previewContentMd =
    makePreviewText(post) + `<a href="${url}">Read more</a>`;
  let previewContentHtml: string = converter.makeHtml(previewContentMd);
  const tagHtml = metaData["tags"]
    .map((tag: string) => `<span class="tag">${tag}</span>`)
    .join("");
  previewContentHtml = previewContentHtml.replace("{{ TOC }}", "");
  const preview = document.createElement("span");
  preview.innerHTML = renderTemplate(postPreviewHtml, {
    content: previewContentHtml,
    title: metaData["title"],
    postUrl: "#/post/" + metaData["name"],
    date: metaData["date"],
    tags: tagHtml,
  });
  const article = document.createElement("div");
  article.innerHTML = converter.makeHtml(post);
  // Replace {{ TOC }} with table of contents
  const toc = makeTableOfContents(article, ["h1"]);
  const tocHtml = toc.innerHTML;
  console.log(tocHtml);
  article.innerHTML = article.innerHTML.replace("{{ TOC }}", tocHtml);
  console.log(article);
  const name = metaData["name"];
  posts[name] = {
    name,
    md: post,
    article,
    preview,
    url,
    date: metaData["date"],
  };
  addPreviewHeadingLink(posts[name]);
});

const contentContainer = document.getElementById("content") as HTMLDivElement;

const routes = [
  new Route("/post/(.*)", (path) => {
    const postName = path.split("/")[2];
    const post = posts[postName];
    contentContainer.innerHTML = `
      <br />
      ${post.date}
      <br />
      ${post.article.innerHTML}`;
  }),
  // new Route("/ai-problem-map", () => {
  //   sigmaGraph.render(contentContainer, aiProblemMapData);
  // }),
  // new Route("/inf-extract-opportunity-map", () => {
  //   sigmaGraph.render(contentContainer, infExtractOpporMapData);
  // }),
  new Route("/", () => {
    contentContainer.innerHTML = "";
    const previewPostElements = Object.values(posts).map(
      (post) => post.preview
    );
    contentContainer.innerHTML = previewPostElements
      .map((preview) => preview.outerHTML)
      .join("<br /><hr />");
  }),
];

const router = new Router(window, routes);
router.navigateTo(window.location.hash || "#/");
