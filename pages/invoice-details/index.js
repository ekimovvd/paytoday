const mockInvoices = {
  1: {
    invoiceId: "182227",
    orderNumber: "123",
    paymentType: "Международный",
    subscriptionId: "182227",
    amountRub: "263₽",
    amountUsd: "$3.05 (+$0.00 VAT)",
    clientName: "test",
    clientPhone: "+7 (912) 123-45-67",
    clientEmail: "test@test.com",
    productInfo: "test",
    creationDate: "10 января 2025 23:48",
    paymentDate: "",
    status: "pending",
    actNumber: "182227",
    link: "#",
  },
  2: {
    invoiceId: "182228",
    orderNumber: "123",
    paymentType: "Международный",
    subscriptionId: "182228",
    amountRub: "263₽",
    amountUsd: "$3.05 (+$0.00 VAT)",
    clientName: "test",
    clientPhone: "+7 (912) 123-45-67",
    clientEmail: "test@test.com",
    productInfo: "test",
    creationDate: "10 января 2025 23:48",
    paymentDate: "11 июля 2024 13:50",
    status: "paid",
    actNumber: "182228",
    link: "#",
  },
};

function getInvoiceIdFromHash() {
  const hash = window.location.hash;
  const parts = hash.split("/");
  return parts.length > 2 ? parts[2] : null;
}

const id = getInvoiceIdFromHash();
const invoice = mockInvoices[id];

if (!invoice) {
  console.error("Invoice not found");
} else {
  console.log("Invoice data:", invoice);
}

function getElement(id) {
  return document.querySelector(`[data-id="${id}"]`);
}

const heading = getElement("heading");
const orderNumber = getElement("order-number");
const invoiceId = getElement("invoice-id");
const paymentType = getElement("payment-type");
const subscriptionId = getElement("subscription-id");
const amountRub = getElement("amount-rub");
const amountUsd = getElement("amount-usd");
const clientName = getElement("client-name");
const clientPhone = getElement("client-phone");
const clientEmail = getElement("client-email");
const productInfo = getElement("product-info");
const creationDate = getElement("creation-date");
const paymentDate = getElement("payment-date");
const actNumber = getElement("act-number");
const trash = getElement("trash");
const statusElement = getElement("status");
const linkElement = getElement("link");
const linkLink = getElement("link-link");
const modal = document.getElementById("modal");
const actions = getElement("actions");
const returnElement = getElement("return");
const mailElement = getElement("mail");

const elements = {
  orderNumber,
  invoiceId,
  paymentType,
  subscriptionId,
  amountRub,
  amountUsd,
  clientName,
  clientPhone,
  clientEmail,
  productInfo,
  creationDate,
  actNumber,
  paymentDate,
  statusElement,
};

heading.innerHTML = `Информация о счете на оплату №${invoice.invoiceId}`;

Object.entries(elements).forEach(([key, element]) => {
  if (element) {
    if (key === "statusElement") {
      if (invoice.status === "pending") {
        element.innerHTML =
          '<img src="../../assets/icons/pending.svg" alt="pending" /> Ждет оплату';
        element.classList.add("invoice-details-page__item-status--pending");

        trash.classList.add("invoice-details-page__trash--visible");
        linkElement.classList.add("invoice-details-page__item--visible");
        linkLink.href = invoice.link;
      } else if (invoice.status === "paid") {
        element.innerHTML =
          '<img src="../../assets/icons/paid-for.svg" alt="paid" /> Оплачен';
        element.classList.add("invoice-details-page__item-status--paid");

        actions.classList.add("invoice-details-page__actions--visible");
      }
    } else if (key === "paymentDate") {
      if (invoice[key] === "") {
        element.innerHTML = `<span class="invoice-details-page__item-empty">-</span>`;
      } else {
        element.textContent = invoice[key];
      }
    } else {
      element.textContent = invoice[key];
    }
  }
});

trash.addEventListener("click", () => {
  document.getElementById("modal").open({
    type: "delete",
    icon: "../../assets/icons/delete.svg",
    title: "Вы точно хотите удалить этот счет?",
    confirmText: "Удалить",
    cancelText: "Оставить",
  });
});

returnElement.addEventListener("click", () => {
  document.getElementById("modal").open({
    type: "return",
    icon: "../../assets/icons/return.svg",
    title: "Возврат осуществлен",
    confirmText: "Отлично",
  });
});

mailElement.addEventListener("click", () => {
  document.getElementById("modal").open({
    type: "mail",
    icon: "../../assets/icons/mail.svg",
    title: "Письмо успешно отправлено",
    confirmText: "Отлично",
  });
});
