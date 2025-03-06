const DESKTOP = 1440;

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

let isFormGroupShow = false;

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
const collapse = getElement("collapse");
const collapseContent = getElement("collapse-content");
const formGroup = getElement("form-group");

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

let isCollapse = false;

function handleResize() {
  const width = window.innerWidth;

  if (isCollapse) {
    isCollapse = false;

    handleCollapse();
  }

  if (width < DESKTOP) {
    collapse.classList.add("payment-link-page__collapse--visible");
    collapseContent.classList.add("payment-link-page__content--hide");
  } else {
    collapse.classList.remove("payment-link-page__collapse--visible");
    collapseContent.classList.remove("payment-link-page__content--hide");
  }
}

function handleCollapse() {
  if (isCollapse) {
    collapse.classList.add("payment-link-page__collapse--active");
    collapseContent.classList.remove("payment-link-page__content--hide");
  } else {
    collapse.classList.remove("payment-link-page__collapse--active");
    collapseContent.classList.add("payment-link-page__content--hide");
  }
}

Object.entries(elements).forEach(([key, element]) => {
  if (element) {
    element.addEventListener("update", (event) => {
      formData[key] = event.detail;

      if (key === "paymentType" && !isFormGroupShow) {
        isFormGroupShow = true;

        formGroup.classList.add("payment-link-page__group--visible");
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

collapse?.addEventListener("click", () => {
  isCollapse = !isCollapse;

  handleCollapse();
});

handleResize();

window.addEventListener("resize", handleResize);
