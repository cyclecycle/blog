import { Route, Router } from "./router";
import showdown from "showdown";
import * as yaml from "yaml";
import postPreviewHtml from "./post-preview.html?raw";
import testPost from "../posts/test.md?raw";
import testPost2 from "../posts/test-2.md?raw";

interface Post {
  name: string;
  md: string;
  article: HTMLDivElement;
  preview: HTMLSpanElement;
  url: string;
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

const postsList = [testPost, testPost2];
const posts: { [name: string]: Post } = {};
const converter = new showdown.Converter();
const previewLimit = 500;
postsList.forEach((post) => {
  const metaData = parseFrontMatter(post);
  const url = "#/post/" + metaData["name"];
  const date = new Date(metaData["date"]);
  metaData["date"] = date.toLocaleDateString();
  post = stripFrontMatter(post);
  const previewContentMd =
    post.substring(0, previewLimit) + "..." + `<a href="${url}">Read more</a>`;
  const previewContentHtml = converter.makeHtml(previewContentMd);
  const tagHtml = metaData["tags"]
    .map((tag: string) => `<span class="tag">${tag}</span>`)
    .join("");
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
  const name = metaData["name"];
  posts[name] = {
    name,
    md: post,
    article,
    preview,
    url,
  };
  addPreviewHeadingLink(posts[name]);
});

const contentContainer = document.getElementById("content") as HTMLDivElement;

const routes = [
  new Route("/post/(.*)", (path) => {
    const postName = path.split("/")[2];
    const post = posts[postName];
    contentContainer.innerHTML = "";
    contentContainer.append(post.article);
  }),
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
