export class SharedMonth extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();
  }

  async connectedCallback() {
    const [htmlRes, cssRes] = await Promise.all([
      fetch("/components/shared/month/component.html"),
      fetch("/components/shared/month/component.css"),
    ]);

    const [htmlText, cssText] = await Promise.all([
      htmlRes.text(),
      cssRes.text(),
    ]);

    const templateDiv = document.createElement("div");
    templateDiv.innerHTML = htmlText;
    const templateContent = templateDiv
      .querySelector("template")
      .content.cloneNode(true);
    const style = document.createElement("style");
    style.textContent = cssText;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(templateContent);

    this.label = this.shadowRoot.querySelector(".shared-month__label");
    this.toggleButton = this.shadowRoot.querySelector(".shared-month__toggle");
    this.dropdown = this.shadowRoot.querySelector(".shared-month__dropdown");

    this.toggleButton.addEventListener("click", () => this.toggleDropdown());

    this.shadowRoot.querySelectorAll(".shared-month__month").forEach((btn) => {
      btn.addEventListener("click", () => this.selectMonth(btn));
    });

    document.addEventListener("click", (event) =>
      this.handleClickOutside(event)
    );

    this.updateLabel();
  }

  toggleDropdown() {
    console.log("CLICK", this.dropdown);
    this.dropdown.classList.toggle("visible");
  }

  selectMonth(button) {
    this.currentMonth = parseInt(button.getAttribute("data-month"), 10);
    this.currentYear = parseInt(
      button.closest("[data-year]").getAttribute("data-year"),
      10
    );

    this.shadowRoot.querySelectorAll(".shared-month__month").forEach((btn) => {
      btn.classList.remove("selected");
    });

    button.classList.add("selected");

    this.updateLabel();
    this.toggleDropdown();

    this.dispatchEvent(
      new CustomEvent("month-selected", {
        detail: { month: this.currentMonth, year: this.currentYear },
        bubbles: true,
        composed: true,
      })
    );
  }

  updateLabel() {
    const months = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];
    this.label.textContent = `${months[this.currentMonth]} ${this.currentYear}`;
  }

  handleClickOutside(event) {
    if (!this.contains(event.target)) {
      // this.dropdown.classList.remove("visible");
    }
  }
}

customElements.define("shared-month", SharedMonth);
