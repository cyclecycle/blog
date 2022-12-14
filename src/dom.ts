export function makeTableOfContents(
  body: HTMLElement | string,
  excludeHeaders: string[] = []
) {
  if (typeof body === "string") {
    const div = document.createElement("div");
    div.innerHTML = body;
    body = div;
  }
  const toc = document.createElement("div");
  let headerTags = ["h1", "h2", "h3", "h4", "h5", "h6"];
  headerTags = headerTags.filter((tag) => !excludeHeaders.includes(tag));
  const headers = Array.from(body.querySelectorAll(headerTags.join(",")));

  headers.forEach((header) => {
    const div = document.createElement("div");
    const a = document.createElement("a");
    const text = header.textContent!.toLowerCase();
    // Make link indent based on header level
    const headerLevel = parseInt(header.tagName[1]);
    const indent = headerLevel - 1;
    div.style.marginLeft = `${indent * 20}px`;
    a.href = "#" + text.replace(/ /g, "").replace(/[^\w-]+/g, "");
    a.textContent = header.textContent;
    div.appendChild(a);
    toc.appendChild(div);
  });
  return toc;
}
