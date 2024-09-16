import { HackerNewsVirtualList } from "./hacker-news-virtual-list.js";

const root = document.querySelector("#virtual-list");
const template = document.getElementById("article__template");
const scrollUpObserver = document.querySelector("#scroll-up-observer");
const scrollDownObserver = document.querySelector("#scroll-down-observer");

new HackerNewsVirtualList(root, template, scrollUpObserver, scrollDownObserver);
