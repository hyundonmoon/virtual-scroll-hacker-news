import { fetchArticles } from "./api.js";

export async function getArticles(page) {
  const res = await fetchArticles(page);
  return res.hits?.map((a) => extractArticleInfo(a));
}

export function extractArticleInfo(article) {
  return {
    author: article.author,
    title: article.title,
    numComments: article.num_comments ?? 0,
    createdAt: article.created_at,
    points: article.points ?? 0,
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

export function timeAgo(timestamp) {
  const now = new Date(); // Current time
  const time = new Date(timestamp); // Input timestamp
  const seconds = Math.floor((now - time) / 1000); // Difference in seconds

  // Time intervals in seconds
  const intervals = {
    year: 365 * 24 * 60 * 60,
    month: 30 * 24 * 60 * 60,
    day: 24 * 60 * 60,
    hour: 60 * 60,
    minute: 60,
  };

  if (seconds < intervals.minute) {
    return `${
      seconds < 10
        ? "just now"
        : `${seconds} second${seconds > 1 ? "s" : ""} ago`
    }`;
  } else if (seconds < intervals.hour) {
    const minutes = Math.floor(seconds / intervals.minute);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (seconds < intervals.day) {
    const hours = Math.floor(seconds / intervals.hour);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (seconds < intervals.month) {
    const days = Math.floor(seconds / intervals.day);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (seconds < intervals.year) {
    const months = Math.floor(seconds / intervals.month);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(seconds / intervals.year);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
}
