import "./components.js";
import { promoCodes } from "../static-data/partner-program.js";

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
  const tableBody = document.querySelector(
    "[data-id='partner-program-page-codes-table']"
  );

  withdrawButton.addEventListener("click", () => {
    alert("Вывод средств временно недоступен");
  });

  detailsButton.addEventListener("click", () => {
    alert("Подробности о программе");
  });

  createPromoButton.addEventListener("click", () => {
    alert("Создание промокода");
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) =>
        t.classList.remove("partner-program-page__tab--active")
      );
      tab.classList.add("partner-program-page__tab--active");

      if (tab.textContent.trim() === "Промокоды") {
        codesSection.style.display = "flex";
        actsSection.style.display = "none";
      } else {
        codesSection.style.display = "none";
        actsSection.style.display = "block";
      }
    });
  });

  tableBody.innerHTML = promoCodes
    .map(
      (promo) => `
      <tr class="partner-program-page__table-tr">
        <td class="partner-program-page__table-td">${promo.code}</td>
        <td class="partner-program-page__table-td">${promo.activations}</td>
      </tr>
    `
    )
    .join("");

  codesSection.style.display = "flex";
  actsSection.style.display = "none";
});
