import { fetchArticles } from "./api.js";

export async function getArticles(page) {
  const res = await fetchArticles(page);
  return res.hits?.map((a) => extractArticleInfo(a));
}

export function extractArticleInfo(article) {
  return {
    author: article.author,
    title: article.title,
    numComments: article.num_comments,
    updatedAt: article.updated_at,
    points: article.points,
    url: article.url,
    id: article.story_id,
  };
}

export function updateTemplateElement(element, article) {
  if (!element || !article) return;

  const title = element.querySelector(".article__title");
  title.textContent = article.title;
  title.setAttribute("href", article.url);

  const details = element.querySelector(".article__details");
  details.textContent = ``;
}

export function getTemplateElement(template, article) {
  const element = template.content.firstElementChild.cloneNode(true);
  updateTemplateElement(element, article);
  return element;
}

export function getObservers() {
  return [
    document.body.querySelector("#top-observer"),
    document.body.querySelector("#bottom-observer"),
  ];
}
