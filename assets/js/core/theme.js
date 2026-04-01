const Theme = {
  getCurrent() {
    return localStorage.getItem("fluir_theme") || "claro";
  },

  apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("fluir_theme", theme);
  },

  init() {
    this.apply(this.getCurrent());
  }
};