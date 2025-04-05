if (process.env.MODE === "development") {
  import("./src/styles/main.scss");
} else {
  import("assets/main.css");
}
