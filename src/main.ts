import { Route, Router } from "./router";
import showdown from "showdown";
import * as yaml from "yaml";
import testPost from "../posts/test.md?raw";
import testPost2 from "../posts/test-2.md?raw";

interface Post {
  name: string;
  md: string;
  article: HTMLDivElement;
  preview: HTMLDivElement;
}

const frontMatterRegex = /---(.|\n)*---/;

function stripFrontMatter(post: string): string {
  return post.replace(frontMatterRegex, "");
}

function parseFrontMatter(post: string): { [key: string]: string } {
  const frontMatter = post.match(frontMatterRegex);
  if (!frontMatter) {
    throw new Error("No front matter provided.");
  }
  const frontMatterString = frontMatter[0];
  const frontMatterJson = frontMatterString
    .replace("---", "")
    .replace("---", "")
    .trim();
  try {
    return yaml.parse(frontMatterJson);
  } catch (e) {
    throw new Error(`Invalid front matter: ${e}`);
  }
}

function addPreviewHeadingLink(post: Post) {
  const heading = post.preview.querySelector("h1") as HTMLHeadingElement;
  const headingUrl = "#/post/" + post.name;
  heading.innerHTML = `<a class="heading" href="${headingUrl}">${heading.innerHTML}</a>`;
}

const postsList = [testPost, testPost2];
const posts: { [name: string]: Post } = {};
const converter = new showdown.Converter();
const previewLimit = 500;
postsList.forEach((post) => {
  const metaData = parseFrontMatter(post);
  post = stripFrontMatter(post);
  const previewMd = post.substring(0, previewLimit) + "...";
  const previewHtml = converter.makeHtml(previewMd);
  const preview = document.createElement("div");
  preview.innerHTML = previewHtml;
  const article = document.createElement("div");
  article.innerHTML = converter.makeHtml(post);
  const name = metaData["name"];
  posts[name] = {
    name,
    md: post,
    article,
    preview,
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
    contentContainer.append(...previewPostElements);
  }),
];

const router = new Router(window, routes);
router.navigateTo(window.location.hash || "#/");
