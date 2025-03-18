import "./components.js";
import data from "../static-data/act.js";

const formatDate = (date) => {
  const formattedDate = date
    .toLocaleString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .replace(" г.", "");

  return formattedDate;
};

const formatTime = (date) => {
  return date.toLocaleString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const renderTable = () => {
  const tableBody = document.querySelector("[data-id='act-page-table']");
  tableBody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="act-page__table-td act-page__table-td--id">
        ${item.orderId}
      </td>
      <td class="act-page__table-td">
        ${item.amountRub.toLocaleString("ru-RU")}₽
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
        ${item.commission.toLocaleString("ru-RU")}₽
      </td>
      <td class="act-page__table-td">
        ${item.payout.toLocaleString("ru-RU")}₽
      </td>
    `;

    tableBody.appendChild(row);
  });
};

document.addEventListener("DOMContentLoaded", renderTable);
