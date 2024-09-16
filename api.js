const BASE_URL = "https://hn.algolia.com/api/v1/search_by_date";
const url = new URL(BASE_URL);

export async function fetchArticles(page) {
  const searchParams = new URLSearchParams("tags=story");
  searchParams.set("page", page);
  url.search = searchParams.toString();
  const response = await fetch(url);
  return response.json();
}
