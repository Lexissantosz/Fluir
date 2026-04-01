const UserService = {
  getUser() {
    return Storage.get("fluir_user", null);
  },

  saveUser(user) {
    Storage.set("fluir_user", user);
    Storage.set("fluir_logged_user", user);
  },

  createDefaultUser() {
    const existingUser = this.getUser();

    if (existingUser) return;

    const defaultUser = {
      nome: "Alex",
      email: "alex@fluir.com",
      senha: "123456",
      foto: ""
    };

    Storage.set("fluir_user", defaultUser);
  }
};