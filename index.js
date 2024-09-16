import { VirtualScrollHackerList } from "./virtual-scroll-hacker-list.js";

const root = document.querySelector("#virtual-list");
const template = document.getElementById("article__template");
const scrollUpObserver = document.querySelector("#scroll-up-observer");
const scrollDownObserver = document.querySelector("#scroll-down-observer");

new VirtualScrollHackerList(
  root,
  template,
  scrollUpObserver,
  scrollDownObserver
);
