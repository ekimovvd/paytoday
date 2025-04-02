import "./components.js";
import { formatDate, formatTime, getQueryParams } from "./utils.js";
import data from "../static-data/invoice-details.js";

let email = "";
let amount = "";

document.addEventListener("DOMContentLoaded", () => {
  function getInvoiceIdFromHash() {
    return getQueryParams().id;
  }

  const id = getInvoiceIdFromHash();
  const invoice = data[id];

  if (!invoice) {
    return;
  }

  function getElement(id) {
    return document.querySelector(`[data-id="${id}"]`);
  }

  const heading = getElement("heading");
  const statusElement = getElement("status");
  const linkElement = getElement("link");
  const linkLink = getElement("link-link");
  const trash = getElement("trash");
  const actions = getElement("actions");
  const returnElement = getElement("return");
  const mailElement = getElement("mail");

  const emailAlert = getElement("email-alert");
  const emailInput = getElement("email-input");
  const emailButton = getElement("email-button");

  const amountAlert = getElement("amount-alert");
  const amountField = getElement("amount-field");
  const amountInput = getElement("amount-input");
  const amountButton = getElement("amount-button");
  const amountReturn = getElement("amount-return");
  const amountLabel = getElement("amount-label");

  heading.innerHTML = `Информация о счете на оплату №${invoice.invoiceId}`;

  const invoiceAmount = invoice.amountRub;
  amountLabel.textContent = `максимум ${invoiceAmount}₽`;

  if (statusElement) {
    statusElement.setAttribute("status", invoice.status);
  }

  if (invoice.status === "pending") {
    trash.classList.add("invoice-details-page__trash--visible");
    linkElement.classList.add("invoice-details-page__item--visible");
    linkLink.href = invoice.link;
  } else if (invoice.status === "paid") {
    actions.classList.add("invoice-details-page__actions--visible");
  }

  const elements = {
    orderNumber: "order-number",
    invoiceId: "invoice-id",
    paymentType: "payment-type",
    subscriptionId: "subscription-id",
    amountRub: "amount-rub",
    amountUsd: "amount-usd",
    clientName: "client-name",
    clientPhone: "client-phone",
    clientEmail: "client-email",
    productInfo: "product-info",
    creationDate: "creation-date",
    actNumber: "act-number",
    paymentDate: "payment-date",
  };

  Object.entries(elements).forEach(([key, id]) => {
    const element = getElement(id);
    const value = invoice[key];

    switch (key) {
      case "paymentDate":
        if (key === "paymentDate") {
          if (value === "") {
            element.innerHTML = `<span class="invoice-details-page__item-empty">-</span>`;
          } else {
            element.textContent = `${formatDate(value)} ${formatTime(value)}`;
          }
        }

        break;
      case "creationDate":
        element.textContent = `${formatDate(value)} ${formatTime(value)}`;

        break;
      case "amountRub":
        element.textContent = `${value}₽`;

        break;
      default:
        element.textContent = value;
        break;
    }
  });

  trash?.addEventListener("click", () => {
    openModal(
      "delete",
      "assets/icons/delete.svg",
      "Вы точно хотите удалить этот счет?",
      "Удалить",
      "Оставить"
    );
  });

  returnElement?.addEventListener("click", () => {
    amountAlert.open();
  });

  mailElement?.addEventListener("click", () => {
    emailAlert.open();
  });

  function openModal(type, icon, title, confirmText, cancelText = "") {
    document.getElementById("modal").open({
      type,
      icon,
      title,
      confirmText,
      cancelText,
    });
  }

  emailButton.addEventListener("click", () => {
    emailAlert.close();

    openModal(
      "mail",
      "assets/icons/mail.svg",
      "Письмо успешно отправлено",
      "Отлично"
    );
  });

  emailInput.addEventListener("update", (event) => {
    email = event.detail;
  });

  amountButton.addEventListener("click", () => {
    amountAlert.close();

    openModal(
      "return",
      "assets/icons/return.svg",
      "Возврат осуществлен",
      "Отлично"
    );
  });

  amountReturn.addEventListener("click", () => {
    amountInput.value = invoiceAmount;
    amount = invoiceAmount;
  });

  amountInput.addEventListener("input", () => {
    if (parseFloat(amountInput.value) > invoiceAmount) {
      amountInput.value = invoiceAmount;
    }

    amount = amountInput.value;
  });

  amountInput.addEventListener("focus", () => {
    amountField.classList.add("invoice-details-page__amount-field--focus");
  });

  amountInput.addEventListener("blur", () => {
    amountField.classList.remove("invoice-details-page__amount-field--focus");
  });

  amountInput.addEventListener("mouseenter", () => {
    amountField.classList.add("invoice-details-page__amount-field--hover");
  });

  amountInput.addEventListener("mouseleave", () => {
    amountField.classList.remove("invoice-details-page__amount-field--hover");
  });
});
