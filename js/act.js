import "./components.js";
import data from "../static-data/act.js";
import {
  formatAmount,
  formatDate,
  formatTime,
  getQueryParams,
} from "./utils.js";

const itemsPerPage = 5;
let currentPage = 1;
let sortedColumn = null;
let sortOrder = null;
const paginationComponent = document.querySelector(
  "[data-id='act-page-pagination']"
);

let selectedAct = null;

const getActFromQuery = () => {
  const params = getQueryParams();
  const { id } = params;
  return data[id] || null;
};

const sortData = (act) => {
  if (!sortedColumn || !sortOrder) return act;

  return act.slice().sort((a, b) => {
    let valueA = a[sortedColumn];
    let valueB = b[sortedColumn];

    if (sortedColumn === "createdAt" || sortedColumn === "paidAt") {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    } else if (typeof valueA === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    return sortOrder === "asc"
      ? valueA > valueB
        ? 1
        : -1
      : valueA < valueB
      ? 1
      : -1;
  });
};

const renderTable = (act, page) => {
  if (!act) return;

  const tableBody = document.querySelector("[data-id='act-page-table']");
  tableBody.innerHTML = "";

  const sortedData = sortData(act);

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  paginatedData.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="act-page__table-td act-page__table-td--id">
        ${item.orderId}
      </td>
      <td class="act-page__table-td">
        ${formatAmount(item.amountRub)}₽
      </td>
      <td class="act-page__table-td">
        ${item.client.name} <br />
        ${item.client.id} <br />
        ${item.client.email}
      </td>
      <td class="act-page__table-td">
        ${formatDate(item.createdAt)} <br />
        ${formatTime(item.createdAt)}
      </td>
      <td class="act-page__table-td">
        ${formatDate(item.paidAt)} <br />
        ${formatTime(item.paidAt)}
      </td>
      <td class="act-page__table-td">
        <shared-status status="${item.status}"></shared-status>
      </td>
      <td class="act-page__table-td">
        ${formatAmount(item.commission)}₽
      </td>
      <td class="act-page__table-td">
        ${formatAmount(item.payout)}₽
      </td>
    `;

    tableBody.appendChild(row);
  });
};

const updatePagination = (act) => {
  if (!act) return;

  const totalPages = Math.ceil(act.length / itemsPerPage);
  paginationComponent.setAttribute("total-pages", totalPages);
  paginationComponent.setAttribute("current-page", currentPage);
};

paginationComponent.addEventListener("page-change", (event) => {
  currentPage = event.detail.page;
  renderTable(selectedAct, currentPage);
  updatePagination(selectedAct);
});

document.querySelectorAll("shared-sort").forEach((sortElement, index) => {
  const columnMap = [
    "orderId",
    "amountRub",
    "client.name",
    "createdAt",
    "paidAt",
    "status",
    "commission",
    "payout",
  ];

  sortElement.addEventListener("sort-change", (event) => {
    sortedColumn = columnMap[index];
    sortOrder = event.detail.order;
    renderTable(selectedAct, currentPage);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  selectedAct = getActFromQuery();

  if (!selectedAct) {
    console.error("Акт не найден");
  } else {
    console.log("Данные акта:", selectedAct);
    renderTable(selectedAct, currentPage);
    updatePagination(selectedAct);
  }
});
