export function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
}

export function getQueryParam(paramName) {
  const params = new URLSearchParams(window.location.search);
  return params.get(paramName);
}

export function setQueryParams(params) {
  const searchParams = new URLSearchParams(window.location.search);

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
  }

  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  window.history.pushState({}, "", newUrl);
}

export function formatDate(date) {
  return date
    .toLocaleString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .replace(" г.", "");
}

export function formatDateShort(date) {
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatTime(date) {
  return date.toLocaleString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimeSeconds(date) {
  return date.toLocaleString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatAmount(amount, format = "ru-RU") {
  return amount.toLocaleString(format);
}

export async function loadStyles() {
  if (isDev()) {
    const cssModule = await import("/src/styles/main.scss?inline");
    return cssModule.default;
  } else {
    const res = await fetch("styles/style.css");
    return await res.text();
  }
}

function isDev() {
  return window.location.hostname === "localhost";
}
