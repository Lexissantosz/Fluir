const Storage = {
  get(key, fallback = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (error) {
      console.error(`Erro ao ler a chave "${key}" do storage.`, error);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar a chave "${key}" no storage.`, error);
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  }
};