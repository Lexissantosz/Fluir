const PreferencesService = {
  get() {
    return Storage.get("fluir_preferences", {
      tema: "claro",
      energiaPadrao: "media",
      tempoPadrao: "60"
    });
  },

  save(preferences) {
    Storage.set("fluir_preferences", preferences);
  }
};