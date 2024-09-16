import { getArticles, timeAgo } from "./utils.js";

const MARGIN = 16;
const MAX_NUMBER_OF_NODES = 40;

export class VirtualScrollHackerList {
  data = {};
  pool = [];
  poolMaxLength = MAX_NUMBER_OF_NODES;

  constructor(listContainer, template, scrollUpObserver, scrollDownObserver) {
    this.listContainer = listContainer;
    this.template = template;
    this.observer = this.createObserver();
    this.scrollUpObserver = scrollUpObserver;
    this.scrollDownObserver = scrollDownObserver;
    this.observe(scrollUpObserver, scrollDownObserver);
  }

  get firstVisibleElement() {
    return this.pool[0];
  }

  get lastVisibleElement() {
    return this.pool.at(-1);
  }

  setYPosDataAttribute(element, value) {
    element.dataset.yPos = value;
    return value;
  }

  getYPosDataAttribute(element) {
    if (element?.dataset?.yPos !== undefined) {
      return +element.dataset.yPos;
    }
    return undefined;
  }

  getPageDataAttribute(element) {
    if (element?.dataset?.page) {
      return +element.dataset.page;
    }
    return undefined;
  }

  intersectionHandler(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        if (id === "scroll-up-observer") {
          this.handleScrollUp();
        } else if (id === "scroll-down-observer") {
          this.handleScrollDown();
        }
      }
    });
  }

  async handleScrollUp() {
    if (
      !this.firstVisibleElement ||
      !this.getPageDataAttribute(this.firstVisibleElement)
    ) {
      return;
    }

    const currentFirstPage = this.getPageDataAttribute(
      this.firstVisibleElement
    );
    const nextFirstPage = currentFirstPage - 1;
    const articles = await this.getData(nextFirstPage);

    const toRecycle = this.pool.slice(this.data[currentFirstPage].length);
    const unchanged = this.pool.slice(0, this.data[currentFirstPage].length);

    while (toRecycle.length > articles.length) {
      toRecycle.pop();
    }

    articles.forEach((article, idx) => {
      if (toRecycle[idx]) {
        this.populateArticleElement(toRecycle[idx], article, nextFirstPage);
      } else {
        const articleElement = this.createArticleElement(
          article,
          nextFirstPage
        );
        toRecycle.push(articleElement);
      }
    });

    this.pool = toRecycle.concat(unchanged);
    this.render("up", nextFirstPage);
  }

  async handleScrollDown() {
    const lastPage = this.getPageDataAttribute(this.lastVisibleElement);
    const nextPage = lastPage === undefined ? 0 : lastPage + 1;
    const articles = await this.getData(nextPage);

    this.data[nextPage] = articles;

    if (this.pool.length + articles.length <= this.poolMaxLength) {
      const fragment = new DocumentFragment();
      const elements = articles.map((article) =>
        this.createArticleElement(article, nextPage)
      );
      this.pool = this.pool.concat(elements);
      elements.forEach((el) => fragment.appendChild(el));
      this.listContainer.appendChild(fragment);
    } else {
      const toRecycle = this.pool.slice(0, articles.length);
      const unchanged =
        lastPage === undefined || !this.data[lastPage]
          ? this.pool.slice(articles.length)
          : this.pool.slice(this.data[lastPage].length);

      while (toRecycle.length > articles.length) {
        const discarded = toRecycle.pop();
        if (discarded) {
          discarded.remove();
        }
      }

      articles.forEach((article, idx) => {
        if (toRecycle[idx]) {
          this.populateArticleElement(toRecycle[idx], article, nextPage);
        } else {
          const articleElement = this.createArticleElement(article, nextPage);
          toRecycle.push(articleElement);
        }
      });

      this.pool = unchanged.concat(toRecycle);
    }

    this.render("down");
  }

  async getData(page) {
    if (page !== undefined && this.data[page]) {
      return this.data[page];
    } else {
      return getArticles(page);
    }
  }

  createObserver() {
    return new IntersectionObserver(this.intersectionHandler.bind(this), {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    });
  }

  observe(...elements) {
    elements.forEach((e) => this.observer.observe(e));
  }

  createArticleElement(data, page) {
    const element = this.template.content.firstElementChild.cloneNode(true);
    return this.populateArticleElement(element, data, page);
  }

  populateArticleElement(element, article, page) {
    if (!element || !article) {
      console.error({ element, article });
      throw new Error("populateArticleTemplate - Element or article missing.");
    }

    const { title, createdAt, points, numComments } = article;

    const titleElement = element.querySelector(".article__title");
    titleElement.textContent = `${title}`;
    titleElement.setAttribute(
      "href",
      article.url ?? `https://news.ycombinator.com/item?id=${article.id}`
    );

    const details = element.querySelector(".article__details");
    const ago = timeAgo(createdAt);
    details.textContent = `Page ${
      page + 1
    } | ${points} points | ${ago} | ${numComments} comments`;

    element.dataset.page = page;

    return element;
  }

  render(direction, page) {
    const list = document.querySelector("#virtual-list");
    console.log(
      `There are ${list.childElementCount} elements in the virtual list.`
    );

    if (direction === "down") {
      for (let i = 0; i < this.pool.length; i++) {
        const [prev, current] = [this.pool.at(i - 1), this.pool[i]];

        if (this.getYPosDataAttribute(prev) === undefined) {
          this.setYPosDataAttribute(current, 0);
        } else {
          const previousY = this.getYPosDataAttribute(prev);
          const previousHeight = prev.getBoundingClientRect().height;
          const yPos = previousY + (previousHeight + 2 * MARGIN);
          this.setYPosDataAttribute(current, yPos);
          current.style.transform = `translateY(${yPos}px)`;
        }
      }
    } else if (direction === "up") {
      for (let i = this.data[page].length - 1; i >= 0; i--) {
        const [prev, current] = [this.pool.at(i + 1), this.pool[i]];
        const prevPosition = this.getYPosDataAttribute(prev);

        if (prevPosition === undefined) {
          this.setYPosDataAttribute(current, 0);
        } else {
          const prevY = prevPosition;
          const prevHeight = prev.getBoundingClientRect().height;
          const yPos = prevY - (prevHeight + 2 * MARGIN);
          this.setYPosDataAttribute(current, yPos);
          current.style.transform = `translateY(${yPos}px)`;
        }
      }
    }

    const firstYPos = this.getYPosDataAttribute(this.firstVisibleElement);
    const lastYPos = this.getYPosDataAttribute(this.lastVisibleElement);

    if (firstYPos !== undefined) {
      this.scrollUpObserver.style.transform = `translateY(${firstYPos}px)`;
    }

    if (lastYPos !== undefined) {
      const scrollDownObserverYPos =
        lastYPos +
        this.lastVisibleElement.getBoundingClientRect().height +
        MARGIN * 2;
      this.scrollDownObserver.style.transform = `translateY(${scrollDownObserverYPos}px)`;
    }
  }
}
