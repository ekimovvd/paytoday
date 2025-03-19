import "./components.js";
import { subscriptionData, invoiceData } from "../static-data/invoice.js";
import { formatDateShort, formatTime, formatAmount } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  let searchQuery = "";
  let sortConfig = { key: null, order: null };

  const refs = {
    handleStop: document.querySelector("[data-id='stop']"),
    handleSearch: document.querySelector("[data-id='search']"),
    subscriptionId: document.querySelector("[data-id='subscription-id']"),
    tableSubscription: document.querySelector(
      "[data-id='invoice-page-table-subscription']"
    ),
    tableInvoices: document.querySelector(
      "[data-id='invoice-page-table-invoices']"
    ),
  };

  document.querySelectorAll("shared-sort").forEach((sortElement, index) => {
    const columns = ["id", "createdDate", "paymentDate"];
    sortElement.addEventListener("sort-change", (event) => {
      sortConfig = { key: columns[index], order: event.detail.order };
      renderInvoices();
    });
  });

  function sortData(data) {
    if (!sortConfig.key || !sortConfig.order) return data;

    return [...data].sort((a, b) => {
      let [valueA, valueB] = [a[sortConfig.key], b[sortConfig.key]];

      if (!valueA || !valueB) return 0;

      if (!isNaN(Date.parse(valueA)) && !isNaN(Date.parse(valueB))) {
        return sortConfig.order === "asc"
          ? new Date(valueA) - new Date(valueB)
          : new Date(valueB) - new Date(valueA);
      }

      if (typeof valueA === "string") valueA = valueA.toLowerCase();
      if (typeof valueB === "string") valueB = valueB.toLowerCase();

      return sortConfig.order === "asc"
        ? valueA > valueB
          ? 1
          : -1
        : valueA < valueB
        ? 1
        : -1;
    });
  }

  function renderSubscriptionData() {
    refs.subscriptionId.textContent = subscriptionData.id;
    refs.tableSubscription.innerHTML = `
      <tr>
        <td class="invoice-page__table-td"><shared-status status="${
          subscriptionData.status
        }"></shared-status></td>
        <td class="invoice-page__table-td">
          ${formatAmount(subscriptionData.amountRub)} ₽
        </td>
        <td class="invoice-page__table-td">
          $${formatAmount(subscriptionData.amountUsd, "en-US")}
        </td>
        <td class="invoice-page__table-td">${subscriptionData.frequency}</td>
        <td class="invoice-page__table-td">
          ${formatAmount(subscriptionData.totalRub)} ₽
        </td>
        <td class="invoice-page__table-td">
          $${formatAmount(subscriptionData.totalUsd, "en-US")}
        </td>
        <td class="invoice-page__table-td">${
          subscriptionData.paymentsCount
        }</td>
        <td class="invoice-page__table-td">${formatDateShort(
          subscriptionData.nextPayment
        )}</td>
      </tr>
    `;
  }

  function filterInvoices() {
    const query = searchQuery.toLowerCase();
    return invoiceData.filter(
      ({ id, client }) =>
        id.includes(query) ||
        client.name.toLowerCase().includes(query) ||
        client.phone.includes(query) ||
        client.email.toLowerCase().includes(query)
    );
  }

  function renderInvoices() {
    const filteredInvoices = sortData(filterInvoices());
    refs.tableInvoices.innerHTML = filteredInvoices
      .map(
        (invoice) => `
      <tr class="invoice-page__table-tr">
        <td class="invoice-page__table-td">
          <a class="invoice-page__table-link" href="#">${invoice.id}</a>
        </td>
        <td class="invoice-page__table-td">
          ${invoice.client.name} <br>
          ${invoice.client.phone} <br>
          ${invoice.client.email}
        </td>
        <td class="invoice-page__table-td">
          ${formatDateShort(invoice.createdDate)}
          ${formatTime(invoice.createdDate)}
        </td>
        <td class="invoice-page__table-td">
          ${formatDateShort(invoice.paymentDate)}
        </td>
        <td class="invoice-page__table-td">
          <shared-status status="${invoice.status}"></shared-status>
        </td>
        <td class="invoice-page__table-td">
          $${formatAmount(invoice.amountUsd, "en-US")} <br>
          +$${formatAmount(invoice.vatUsd)} VAT
        </td>
        <td class="invoice-page__table-td">
          ${formatAmount(invoice.amountRub)} ₽
        </td>
        <td class="invoice-page__table-td">
          <div class="invoice-page__table-actions">
            <shared-copy class="invoice-page__table-action" copy-text="${
              invoice.id
            }"></shared-copy>
            <shared-redirect href="${invoice.id}"></shared-redirect>
            <shared-remove class="invoice-page__table-remove" data-id="remove" data-remove-id="${
              invoice.id
            }"></shared-remove>
          </div>
        </td>
      </tr>
    `
      )
      .join("");
  }

  renderSubscriptionData();
  renderInvoices();

  refs.handleStop?.addEventListener("click", () =>
    console.log("Остановить подписку!")
  );

  refs.handleSearch?.addEventListener("search", (event) => {
    searchQuery = event.detail.trim();
    renderInvoices();
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest(
      "[data-id='remove'], [data-id='copy-link']"
    );

    if (!target) return;

    if (target.dataset.id === "remove") {
      const row = target.closest("tr");
      if (!row) return;

      modal.open({
        type: "delete",
        icon: "assets/icons/delete.svg",
        title: "Вы точно хотите удалить этот счет?",
        confirmText: "Удалить",
        cancelText: "Оставить",
      });

      modal.addEventListener("confirm", () => row.remove());
    }
  });
});
