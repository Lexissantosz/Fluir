const Session = {
  isLogged() {
    return localStorage.getItem("fluir_logged") === "true";
  },

  getLoggedUser() {
    return Storage.get("fluir_logged_user", null);
  },

  login(user) {
    localStorage.setItem("fluir_logged", "true");
    Storage.set("fluir_logged_user", user);
  },

  logout() {
    localStorage.removeItem("fluir_logged");
    Storage.remove("fluir_logged_user");
    window.location.href = "index.html";
  }
};