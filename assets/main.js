"use strict";
document.documentElement.classList.add("js");
document.querySelectorAll("[data-switch]").forEach(group => {
  const buttons = Array.from(group.querySelectorAll("[data-panel]"));
  const panels = Array.from(group.querySelectorAll("[data-part]"));
  function activate(index) {
    buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
  }
  buttons.forEach((button, i) => button.addEventListener("click", () => activate(i)));
  activate(0);
});
const projectCards = document.getElementById("projectcards");
if (projectCards) {
  const grid = document.getElementById("viewgrid");
  const list = document.getElementById("viewlist");
  function selectView(showList) {
    projectCards.classList.toggle("listview", showList);
    list.setAttribute("aria-pressed", String(showList));
    grid.setAttribute("aria-pressed", String(!showList));
  }
  grid.addEventListener("click", () => selectView(false));
  list.addEventListener("click", () => selectView(true));
}
const features = Array.from(document.querySelectorAll("[data-feature]"));
if (features.length) {
  let current = 0;
  const live = document.createElement("span");
  live.className = "a11ynote";
  live.setAttribute("role", "status");
  features[0].parentNode.append(live);
  function nextFeature(delta) {
    current = (features.length + current + delta) % features.length;
    features.forEach((feature, i) => { feature.hidden = i !== current; });
    live.textContent = features[current].textContent;
  }
  document.getElementById("featureprev").addEventListener("click", () => nextFeature(-1));
  document.getElementById("featurenext").addEventListener("click", () => nextFeature(1));
}
document.addEventListener("DOMContentLoaded", () => {
  const explorer = document.getElementById("explorer");
  if (explorer && window.PyMExplorer) window.PyMExplorer.mount(explorer, explorer.dataset.project);
});
