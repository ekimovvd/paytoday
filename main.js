import "./components/shared/back/component.js";
import "./components/shared/header/component.js";
import "./components/shared/sidebar/component.js";
import "./components/shared/modal/component.js";
import "./components/shared/trash/component.js";
import "./components/shared/search/component.js";
import "./components/shared/menu/component.js";
import "./components/shared/support/component.js";
import "./components/shared/collapse/component.js";

import "./components/ui/button/component.js";
import "./components/ui/input/component.js";
import "./components/ui/textarea/component.js";
import "./components/ui/radio/component.js";
import "./components/ui/switch/component.js";
import "./components/ui/select/component.js";
import "./components/ui/option/component.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  function loadPageStyles(page) {
    const oldLink = document.getElementById("styles");
    if (oldLink) {
      oldLink.remove();
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.id = "styles";
    link.href = `pages/${page}/index.css`;

    document.head.appendChild(link);
  }

  function loadPageScript(page) {
    const oldScript = document.getElementById("page-script");
    if (oldScript) {
      oldScript.remove();
    }

    const script = document.createElement("script");
    script.type = "module";
    script.id = "page-script";
    script.src = `pages/${page}/index.js`;

    script.onerror = () => console.warn(`Script for page ${page} not found.`);

    document.body.appendChild(script);
  }

  function loadContent(page) {
    fetch(`pages/${page}/index.html`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load the page");
        }
        return response.text();
      })
      .then((html) => {
        app.innerHTML = html;
        loadPageScript(page);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function parseRoute() {
    const hash = location.hash.slice(1) || "/";

    const routes = [
      { path: "/", page: "main" },
      { path: "/invoice", page: "invoice" },
      { path: "/invoice/:id", page: "invoice-details" },
      { path: "/payment-link", page: "payment-link" },
    ];

    for (const route of routes) {
      const regex = new RegExp(`^${route.path.replace(/:id/, "([^/]+)")}$`);
      const match = hash.match(regex);

      if (match) {
        loadPageStyles(route.page);
        loadContent(route.page);

        return;
      }
    }

    loadContent(routes[0].page);
  }

  window.addEventListener("hashchange", parseRoute);
  parseRoute();

  console.log("Paytoday started");
});

window.addEventListener("hashchange", () => {
  location.reload();
});
