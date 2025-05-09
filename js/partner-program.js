import "./components.js";
import { promoCodes, acts } from "../static-data/partner-program.js";
import { formatAmount, formatDateShort, formatTimeSeconds } from "./utils.js";

let sortedColumn = "createdAt";
let sortOrder = "asc";
let promoCode = "";
let outputAmount = "";

const sortActs = (acts) => {
  return acts.slice().sort((a, b) => {
    let valueA = a[sortedColumn];
    let valueB = b[sortedColumn];

    if (sortedColumn === "createdAt") {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    } else if (typeof valueA === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const withdrawButton = document.querySelector(
    ".partner-program-page__card-button"
  );
  const detailsButton = document.querySelector(
    ".partner-program-page__card--secondary .partner-program-page__card-button"
  );
  const createPromoButton = document.querySelector(
    ".partner-program-page__codes-button"
  );
  const tabs = document.querySelectorAll(".partner-program-page__tab");
  const codesSection = document.querySelector(".partner-program-page__codes");
  const actsSection = document.querySelector(".partner-program-page__acts");
  const codesTableBody = document.querySelector(
    "[data-id='partner-program-page-codes-table']"
  );
  const actsTableBody = document.querySelector(
    "[data-id='partner-program-page-table']"
  );
  const modal = document.querySelector("[data-id='partner-program-modal']");

  const modalCreate = document.querySelector(".partner-program-page__create");
  const modalCreateButton = document.querySelector(
    ".partner-program-page__create-button"
  );
  const modalCreateInput = document.querySelector(
    ".partner-program-page__create-input"
  );

  const modalOutput = document.querySelector(".partner-program-page__output");
  const modalOutputButton = document.querySelector(
    ".partner-program-page__output-button"
  );
  const modalOutputInput = document.querySelector(
    ".partner-program-page__output-input"
  );

  withdrawButton.addEventListener("click", () => {
    modalOutput.open();
  });

  detailsButton.addEventListener("click", () => {
    modal.open();
  });

  createPromoButton.addEventListener("click", () => {
    modalCreate.open();
  });

  modalCreateButton.addEventListener("click", () => {
    modalCreate.close();
  });

  modalCreateInput.addEventListener("update", (event) => {
    promoCode = event.detail;
  });

  modalOutputButton.addEventListener("click", () => {
    modalOutput.close();
  });

  modalOutputInput.addEventListener("update", (event) => {
    outputAmount = event.detail;
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) =>
        t.classList.remove("partner-program-page__tab--active")
      );
      tab.classList.add("partner-program-page__tab--active");

      if (tab.textContent.trim() === "Промокоды") {
        codesSection.style.display = "grid";
        actsSection.style.display = "none";
      } else {
        codesSection.style.display = "none";
        actsSection.style.display = "block";
      }
    });
  });

  codesTableBody.innerHTML = promoCodes
    .map(
      (promo) => `
      <tr class="partner-program-page__table-tr">
        <td class="partner-program-page__table-td">
          <div class="partner-program-page__table-group">
            <span class="partner-program-page__table-code">${promo.code}</span>
            <shared-replicate copy-text="${promo.code}"></shared-replicate>
          </div>
        </td>
        <td class="partner-program-page__table-td">${promo.activations}</td>
      </tr>
    `
    )
    .join("");

  const renderActs = () => {
    const sortedActs = sortActs(acts);
    actsTableBody.innerHTML = sortedActs
      .map(
        (act) => `
      <tr class="partner-program-page__table-tr">
        <td class="partner-program-page__table-td">${act.actId}</td>
        <td class="partner-program-page__table-td">
          ${formatDateShort(act.createdAt)} <br />
          ${formatTimeSeconds(act.createdAt)}
        </td>
        <td class="partner-program-page__table-td">
          ${formatAmount(act.amountRub)}₽
        </td>
        <td class="partner-program-page__table-td">
          $${formatAmount(act.amountUsd)}
        </td>
        <td class="partner-program-page__table-td">
          ${formatAmount(act.payoutRub)}₽
        </td>
        <td class="partner-program-page__table-td">
          $${formatAmount(act.payoutUsd)}
        </td>
      </tr>
    `
      )
      .join("");
  };

  document.querySelectorAll("shared-sort").forEach((sortElement, index) => {
    const columnMap = ["actId", "createdAt", "amountRub", "amountUsd"];

    sortElement.addEventListener("sort-change", (event) => {
      sortedColumn = columnMap[index];
      sortOrder = event.detail.order;
      renderActs();
    });
  });

  renderActs();

  codesSection.style.display = "grid";
  actsSection.style.display = "none";
});
