import { loadStyles } from "../../../js/utils.js";

export class SharedStatus extends HTMLElement {
  static get observedAttributes() {
    return ["status"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const htmlRes = await fetch("./components/shared/status/component.html");
    const htmlText = await htmlRes.text();

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;

    const templateContent = templateDiv
      .querySelector("template")
      .content.cloneNode(true);

    const style = document.createElement("style");
    style.textContent = await loadStyles();

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.iconElement = this.shadowRoot.querySelector(".shared-status__icon");
    this.textElement = this.shadowRoot.querySelector(".shared-status__text");
    this.container = this.shadowRoot.querySelector(".shared-status");

    this.updateStatus();
  }

  updateStatus() {
    const status = this.getAttribute("status");

    let text = "";
    let icon = "";
    let statusClass = "";

    switch (status) {
      case "pending":
        text = "Ждет оплату";
        icon = "assets/icons/pending.svg";
        statusClass = "shared-status--pending";
        break;
      case "paid":
        text = "Оплачен";
        icon = "assets/icons/paid-for.svg";
        statusClass = "shared-status--paid";
        break;
      case "not-active":
        text = "Не активен";
        statusClass = "shared-status--not-active";
        break;
      case "error":
        text = "Ошибка";
        icon = "assets/icons/error.svg";
        statusClass = "shared-status--error";
        break;
      case "refund":
        text = "Возврат";
        icon = "assets/icons/refund.svg";
        statusClass = "shared-status--refund";
        break;
      case "active":
        text = "Активен";
        statusClass = "shared-status--active";
        break;
      case "published":
        text = "Опубликован";
        icon = "assets/icons/paid-for.svg";
        statusClass = "shared-status--active";
        break;
      case "not-published":
        text = "Отключено";
        icon = "assets/icons/pending.svg";
        statusClass = "shared-status--pending";
        break;
      default:
        return;
    }

    if (icon) {
      this.iconElement.src = icon;
      this.iconElement.alt = status;
      this.iconElement.style.display = "inline-block";
    } else {
      this.iconElement.style.display = "none";
    }

    this.textElement.textContent = text;
    this.container.className = `shared-status ${statusClass}`;
  }
}

customElements.define("shared-status", SharedStatus);
