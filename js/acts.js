import "./components.js";
import data from "../static-data/acts.js";

const itemsPerPage = 5;
let currentPage = 1;
let sortedColumn = null;
let sortOrder = null;
const paginationComponent = document.querySelector(
  "[data-id='acts-page-pagination']"
);

const formatDate = (date) => {
  return date
    .toLocaleString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .replace(" г.", "");
};

const formatTime = (date) => {
  return date.toLocaleString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const sortData = (acts) => {
  if (!sortedColumn || !sortOrder) return acts;

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

    return sortOrder === "asc"
      ? valueA > valueB
        ? 1
        : -1
      : valueA < valueB
      ? 1
      : -1;
  });
};

const renderTable = (acts, page) => {
  const tableBody = document.querySelector("[data-id='acts-page-table']");
  tableBody.innerHTML = "";

  const sortedData = sortData(acts);

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  paginatedData.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="acts-page__table-td acts-page__table-td--id">
        ${item.actId}
      </td>
      <td class="acts-page__table-td">
        ${formatDate(item.createdAt)} <br />
        ${formatTime(item.createdAt)}
      </td>
      <td class="acts-page__table-td">
        ${item.amountRub.toLocaleString("ru-RU")}₽
      </td>
      <td class="acts-page__table-td">
        $${item.amountUsd.toLocaleString("ru-RU")}
      </td>
      <td class="acts-page__table-td">
        ${item.commission.toLocaleString("ru-RU")}₽
      </td>
      <td class="acts-page__table-td">
        ${item.payoutRub.toLocaleString("ru-RU")}₽
      </td>
      <td class="acts-page__table-td">
        $${item.payoutUsd.toLocaleString("ru-RU")}
      </td>
      <td class="acts-page__table-td">
        <shared-status status="${item.status}"></shared-status>
      </td>
    `;

    tableBody.appendChild(row);
  });
};

const updatePagination = (acts) => {
  const totalPages = Math.ceil(acts.length / itemsPerPage);
  paginationComponent.setAttribute("total-pages", totalPages);
  paginationComponent.setAttribute("current-page", currentPage);
};

paginationComponent.addEventListener("page-change", (event) => {
  currentPage = event.detail.page;
  renderTable(data, currentPage);
  updatePagination(data);
});

document.querySelectorAll("shared-sort").forEach((sortElement, index) => {
  const columnMap = [
    "actId",
    "createdAt",
    "amountRub",
    "amountUsd",
    "commission",
    "payoutRub",
    "payoutUsd",
    "status",
  ];

  sortElement.addEventListener("sort-change", (event) => {
    sortedColumn = columnMap[index];
    sortOrder = event.detail.order;
    renderTable(data, currentPage);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  renderTable(data, currentPage);
  updatePagination(data);
});
