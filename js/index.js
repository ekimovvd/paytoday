import "./components.js";
import data from "../static-data/index.js";
import { formatDateShort, formatTime, formatAmount } from "./utils.js";

const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let searchQuery = "";
let sortConfig = { key: null, order: null };
let activeFilters = {
  paymentStatus: "all",
  payoutStatus: "all",
  paymentType: "all",
  dateRange: null,
};

const refs = {
  searchDesktop: document.querySelector("[data-id='main-search']"),
  searchMobile: document.querySelector("[data-id='main-search-mobile']"),
  tableBody: document.querySelector("[data-id='main-page-table-body']"),
  pagination: document.querySelector("[data-id='main-pagination']"),
  download: document.querySelector("[data-id='main-download']"),
  modal: document.getElementById("modal"),
  statistics: document.querySelector("[data-id='main-statistics']"),
};

function handleSearch(event) {
  searchQuery = event.detail.trim().toLowerCase();
  currentPage = 1;
  renderData();
}

refs.searchDesktop.addEventListener("search", handleSearch);
refs.searchMobile.addEventListener("search", handleSearch);

document.querySelectorAll("shared-sort").forEach((sortElement, index) => {
  const columns = ["accountId", "id", "createdDate", "paymentDate"];
  sortElement.addEventListener("sort-change", (event) => {
    sortConfig = { key: columns[index], order: event.detail.order };
    renderData();
  });
});

refs.statistics.addEventListener("filter-change", (event) => {
  activeFilters = event.detail;
  currentPage = 1;
  renderData();
});

function filterData() {
  return data.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery) ||
      item.accountId.toLowerCase().includes(searchQuery) ||
      item.client.name.toLowerCase().includes(searchQuery) ||
      item.client.phone.includes(searchQuery) ||
      item.client.email.toLowerCase().includes(searchQuery);

    const matchesPaymentStatus =
      activeFilters.paymentStatus === "all" ||
      activeFilters.paymentStatus === item.status;

    const matchesPayoutStatus =
      activeFilters.payoutStatus === "all" ||
      (activeFilters.payoutStatus === "not_paid" && item.payout !== "paid") ||
      (activeFilters.payoutStatus === "paid" && item.payout === "paid");

    const matchesPaymentType =
      activeFilters.paymentType === "all" ||
      activeFilters.paymentType === item.paymentType;

    const matchesDateRange =
      !activeFilters.dateRange ||
      (new Date(activeFilters.dateRange.start) <= new Date(item.createdDate) &&
        new Date(activeFilters.dateRange.end) >= new Date(item.createdDate));

    return (
      matchesSearch &&
      matchesPaymentStatus &&
      matchesPayoutStatus &&
      matchesPaymentType &&
      matchesDateRange
    );
  });
}

function sortData(filteredData) {
  if (!sortConfig.key || !sortConfig.order) return filteredData;

  return [...filteredData].sort((a, b) => {
    let valueA = a[sortConfig.key];
    let valueB = b[sortConfig.key];

    if (!valueA || !valueB) return 0;

    if (!isNaN(Date.parse(valueA)) && !isNaN(Date.parse(valueB))) {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    } else {
      valueA = valueA.toString().toLowerCase();
      valueB = valueB.toString().toLowerCase();
    }

    return sortConfig.order === "asc"
      ? valueA > valueB
        ? 1
        : -1
      : valueA < valueB
      ? 1
      : -1;
  });
}

function paginateData(filteredData) {
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  refs.pagination.setAttribute("total-pages", totalPages);
  refs.pagination.setAttribute("current-page", currentPage);
}

refs.pagination.addEventListener("page-change", (event) => {
  currentPage = event.detail.page;
  renderData();
});

function renderData() {
  const filteredData = filterData();
  renderPagination(filteredData.length);

  const paginatedData = paginateData(sortData(filteredData));

  refs.tableBody.innerHTML = paginatedData
    .map(
      (item) => `
    <tr class="main-page__table-tr" data-id="${item.id}">
      <td class="main-page__table-td"><a class="main-page__table-link" href="#">${
        item.id
      }</a></td>
      <td class="main-page__table-td"><a class="main-page__table-link" href="#">${
        item.accountId
      }</a></td>
      <td class="main-page__table-td main-page__table-td--nowrap">
        ${item.client.name} <br>
        ${item.client.phone} <br>
        ${item.client.email}
      </td>
      <td class="main-page__table-td main-page__table-td--nowrap">
        ${formatDateShort(item.createdDate)} ${formatTime(item.createdDate)}
      </td>
      <td class="main-page__table-td main-page__table-td--nowrap">
        ${formatDateShort(item.paymentDate)}
      </td>
      <td class="main-page__table-td"><shared-status status="${
        item.status
      }"></shared-status></td>
      <td class="main-page__table-td">
        $${formatAmount(item.amountUsd, "en-US")} <br />
        +$${formatAmount(item.vatUsd, "en-US")} VAT
      </td>
      <td class="main-page__table-td">${formatAmount(item.amountRub)}₽</td>
      <td class="main-page__table-td">
        <div class="main-page__table-actions">
          <shared-copy class="main-page__table-action" copy-text="${
            item.id
          }"></shared-copy>
          <shared-redirect href="${item.id}"></shared-redirect>
          <shared-remove class="main-page__table-remove" data-remove-id="${
            item.id
          }"></shared-remove>
        </div>
      </td>
    </tr>`
    )
    .join("");

  attachRemoveListeners();
}

function attachRemoveListeners() {
  document.querySelectorAll("[data-remove-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const removeId = event.currentTarget.dataset.removeId;
      showDeleteModal(removeId);
    });
  });
}

function showDeleteModal(id) {
  refs.modal.open({
    type: "delete",
    icon: "assets/icons/delete.svg",
    title: "Вы точно хотите удалить этот счет?",
    confirmText: "Удалить",
    cancelText: "Оставить",
  });

  refs.modal.addEventListener("confirm", () => removeRow(id), { once: true });
}

function removeRow(id) {
  const index = data.findIndex((item) => item.id === id);
  if (index !== -1) {
    data.splice(index, 1);
    renderData();
  }
}

refs.download.addEventListener("click", () => {
  console.log("Скачивание данных...");
});

renderData();
