import "./components.js";

const mockSubscriptionData = {
  id: "182227",
  status: "Не активен",
  amountRub: "2 345 ₽",
  amountUsd: "$23",
  frequency: "Еженедельно",
  totalRub: "2 345 ₽",
  totalUsd: "$23",
  paymentsCount: "1",
  nextPayment: "02.02.2025",
};

const mockInvoiceData = [
  {
    id: "123456",
    client: {
      name: "ANTON",
      phone: "+7 923 23-23-23",
      email: "ANTON@MAIL.COM",
    },
    createdDate: "29.12.2024 15:45",
    paymentDate: "29.12.2024",
    status: "paid",
    amountUsd: "$1 000.234",
    vatUsd: "+$1 000 VAT",
    amountRub: "10 000₽",
  },
  {
    id: "123457",
    client: {
      name: "SERGEY",
      phone: "+7 911 11-11-11",
      email: "SERGEY@MAIL.COM",
    },
    createdDate: "28.12.2024 14:30",
    paymentDate: "28.12.2024",
    status: "pending",
    amountUsd: "$2 500.567",
    vatUsd: "+$2 000 VAT",
    amountRub: "15 000₽",
  },
];

function getElement(id) {
  return document.querySelector(`[data-id="${id}"]`);
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  let searchQuery = "";
  let sortConfig = { key: null, order: null };

  const handleStop = getElement("stop");
  const handleSearch = getElement("search");

  document.querySelectorAll("shared-sort").forEach((sortElement, index) => {
    const columns = ["id", "createdDate", "paymentDate"];
    const key = columns[index];

    sortElement.addEventListener("sort-change", (event) => {
      sortConfig = { key, order: event.detail.order };
      renderInvoices();
    });
  });

  function sortData(filteredData) {
    if (!sortConfig.key || !sortConfig.order) return filteredData;

    return [...filteredData].sort((a, b) => {
      let valueA = a[sortConfig.key];
      let valueB = b[sortConfig.key];

      if (!valueA || !valueB) return 0;

      if (!isNaN(Date.parse(valueA)) && !isNaN(Date.parse(valueB))) {
        valueA = new Date(valueA);
        valueB = new Date(valueB);
      }

      if (typeof valueA === "string") valueA = valueA.toLowerCase();
      if (typeof valueB === "string") valueB = valueB.toLowerCase();

      if (sortConfig.order === "asc") return valueA > valueB ? 1 : -1;
      if (sortConfig.order === "desc") return valueA < valueB ? 1 : -1;
      return 0;
    });
  }

  function renderSubscriptionData() {
    getElement("subscription-id").textContent = mockSubscriptionData.id;

    const tableBody = getElement("invoice-page-table-subscription");
    tableBody.innerHTML = `
      <tr>
        <td class="invoice-page__table-td"><span class="invoice-page__table-status">${mockSubscriptionData.status}</span></td>
        <td class="invoice-page__table-td">${mockSubscriptionData.amountRub}</td>
        <td class="invoice-page__table-td">${mockSubscriptionData.amountUsd}</td>
        <td class="invoice-page__table-td">${mockSubscriptionData.frequency}</td>
        <td class="invoice-page__table-td">${mockSubscriptionData.totalRub}</td>
        <td class="invoice-page__table-td">${mockSubscriptionData.totalUsd}</td>
        <td class="invoice-page__table-td">${mockSubscriptionData.paymentsCount}</td>
        <td class="invoice-page__table-td">${mockSubscriptionData.nextPayment}</td>
      </tr>
    `;
  }

  function filterInvoices() {
    return mockInvoiceData.filter((invoice) => {
      const query = searchQuery.toLowerCase();
      return (
        invoice.id.includes(query) ||
        invoice.client.name.toLowerCase().includes(query) ||
        invoice.client.phone.includes(query) ||
        invoice.client.email.toLowerCase().includes(query)
      );
    });
  }

  function renderInvoices() {
    const tableBody = getElement("invoice-page-table-invoices");
    const filteredInvoices = sortData(filterInvoices());

    tableBody.innerHTML = filteredInvoices
      .map((invoice) => {
        return `
        <tr class="invoice-page__table-tr">
          <td class="invoice-page__table-td"><a class="invoice-page__table-link" href="#">${invoice.id}</a></td>
          <td class="invoice-page__table-td">
            ${invoice.client.name} <br>
            ${invoice.client.phone} <br>
            ${invoice.client.email}
          </td>
          <td class="invoice-page__table-td">${invoice.createdDate}</td>
          <td class="invoice-page__table-td">${invoice.paymentDate}</td>
          <td class="invoice-page__table-td"><shared-status status="${invoice.status}"></shared-status></td>
          <td class="invoice-page__table-td">${invoice.amountUsd} <br> ${invoice.vatUsd}</td>
          <td class="invoice-page__table-td">${invoice.amountRub}</td>
          <td class="invoice-page__table-td">
            <div class="invoice-page__table-actions">
              <shared-copy class="invoice-page__table-action" copy-text="${invoice.id}"></shared-copy>
  
              <shared-redirect href="${invoice.id}"></shared-redirect>

              <shared-remove data-id="remove" class="invoice-page__table-remove" data-remove-id="${invoice.id}"></shared-remove>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");
  }

  renderSubscriptionData();
  renderInvoices();

  handleStop.addEventListener("click", () => {
    console.log("Остановить подписку!");
  });

  handleSearch.addEventListener("search", (event) => {
    searchQuery = event.detail.trim();

    renderInvoices();
  });

  function handleCopyLink(event) {
    const button = event.target.closest("[data-id='copy-link']");
    if (!button) return;

    const link = button.getAttribute("data-link");
    if (!link) return;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        console.log(`Скопировано: ${link}`);
      })
      .catch((err) => {
        console.error("Ошибка копирования:", err);
      });
  }

  document.addEventListener("click", handleCopyLink);

  function handleRemoveInvoice(event) {
    const button = event.target.closest("[data-id='remove']");
    if (!button) return;

    const row = button.closest("tr");
    if (!row) return;

    modal.open({
      type: "delete",
      icon: "assets/icons/delete.svg",
      title: "Вы точно хотите удалить этот счет?",
      confirmText: "Удалить",
      cancelText: "Оставить",
    });

    modal.addEventListener("confirm", () => {
      row.remove();
    });
  }

  document.addEventListener("click", handleRemoveInvoice);
});
