import "./components.js";

document.addEventListener("DOMContentLoaded", async function () {
  const formData = {
    paymentType: "",
    orderNumber: "",
    amountRub: "",
    amountUsd: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    productInfo: "",
    recurringPayment: false,
    recurringFrequency: "",
  };

  function getElement(id) {
    return document.querySelector(`[data-id="${id}"]`);
  }

  const paymentType = getElement("payment-type");
  const orderNumber = getElement("order-number");
  const amountRub = getElement("amount-rub");
  const amountUsd = getElement("amount-usd");
  const clientName = getElement("client-name");
  const clientPhone = getElement("client-phone");
  const clientEmail = getElement("client-email");
  const productInfo = getElement("product-info");
  const recurringPayment = getElement("recurring-payment");
  const handleCreate = getElement("create");
  const radios = document.querySelectorAll(
    'ui-radio[data-id="recurring-frequency"]'
  );
  const formGroup = getElement("form-group");
  const listElement = getElement("list");

  const elements = {
    paymentType,
    orderNumber,
    amountRub,
    amountUsd,
    clientName,
    clientPhone,
    clientEmail,
    productInfo,
    recurringPayment,
  };

  Object.entries(elements).forEach(([key, element]) => {
    if (element) {
      element.addEventListener("update", (event) => {
        formData[key] = event.detail;

        if (key === "paymentType") {
          formGroup.classList.add("payment-link-page__group--visible");
        }

        if (key === "recurringPayment") {
          if (formData.recurringPayment) {
            listElement.classList.add("payment-link-page__list--visible");
          } else {
            listElement.classList.remove("payment-link-page__list--visible");
          }
        }

        console.log("Обновлено:", key, formData);
      });
    }
  });

  radios.forEach((radio) => {
    radio.addEventListener("update", (event) => {
      formData.recurringFrequency = event.detail;

      radios.forEach((btn) => {
        btn.setAttribute("value", event.detail);
      });

      console.log("Обновлено значение radio:", formData);
    });
  });

  handleCreate?.addEventListener("click", (event) => {
    event.preventDefault();

    console.log("Форма отправлена с данными:", formData);
  });
});
