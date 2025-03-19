import "./components.js";

document.addEventListener("DOMContentLoaded", () => {
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

  const requiredFields = [
    "orderNumber",
    "amountRub",
    "amountUsd",
    "clientName",
    "clientPhone",
    "clientEmail",
  ];

  const elements = {
    paymentType: "payment-type",
    orderNumber: "order-number",
    amountRub: "amount-rub",
    amountUsd: "amount-usd",
    clientName: "client-name",
    clientPhone: "client-phone",
    clientEmail: "client-email",
    productInfo: "product-info",
    recurringPayment: "recurring-payment",
  };

  const refs = Object.fromEntries(
    Object.entries(elements).map(([key, id]) => [
      key,
      document.querySelector(`[data-id="${id}"]`),
    ])
  );

  const formGroup = document.querySelector('[data-id="form-group"]');
  const listElement = document.querySelector('[data-id="list"]');
  const radios = document.querySelectorAll(
    'ui-radio[data-id="recurring-frequency"]'
  );
  const handleCreate = document.querySelector('[data-id="create"]');

  function updateFormData(key, value) {
    formData[key] = value;
    console.log("Обновлено:", key, formData);

    if (key === "paymentType") {
      formGroup.classList.add("payment-link-page__group--visible");
    }

    if (key === "recurringPayment") {
      listElement.classList.toggle("payment-link-page__list--visible", value);
    }
  }

  function validateForm() {
    let isValid = true;

    requiredFields.forEach((field) => {
      const input = refs[field];

      if (input) {
        const value = formData[field]?.trim();
        const isEmpty = !value;

        if (isEmpty) {
          input.setAttribute("error", "Поле обязательно");
          isValid = false;
        } else {
          input.removeAttribute("error");
        }
      }
    });

    if (!isValid) {
      console.log("Форма содержит ошибки, исправьте их перед отправкой.");
    }

    return isValid;
  }

  Object.entries(refs).forEach(([key, element]) => {
    element?.addEventListener("update", (event) => {
      updateFormData(key, event.detail);

      if (requiredFields.includes(key)) {
        element.removeAttribute("error");
      }
    });
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

    if (validateForm()) {
      console.log("Форма успешно отправлена с данными:", formData);
    }
  });
});
