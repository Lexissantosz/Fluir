const TaskService = {
  getAll() {
    return Storage.get("fluir_tasks", []);
  },

  saveAll(tasks) {
    Storage.set("fluir_tasks", tasks);
  },

  createDefaults() {
    const existingTasks = this.getAll();
    if (existingTasks.length > 0) return;

    const defaultTasks = [
      {
        id: 1,
        titulo: "Responder mensagens importantes",
        descricao: "Resolver respostas curtas e rápidas.",
        duracao: 10,
        prioridade: "baixa",
        esforco: "baixo",
        prazo: "",
        periodo: null,
        concluida: false
      },
      {
        id: 2,
        titulo: "Estudar lógica de programação",
        descricao: "Fazer revisão de estruturas condicionais.",
        duracao: 45,
        prioridade: "alta",
        esforco: "medio",
        prazo: "",
        periodo: null,
        concluida: false
      },
      {
        id: 3,
        titulo: "Organizar materiais",
        descricao: "Separar conteúdos e pendências do dia.",
        duracao: 20,
        prioridade: "media",
        esforco: "baixo",
        prazo: "",
        periodo: null,
        concluida: false
      },
      {
        id: 4,
        titulo: "Revisar tarefas",
        descricao: "Rever prioridades antes de encerrar o dia.",
        duracao: 30,
        prioridade: "media",
        esforco: "medio",
        prazo: "",
        periodo: null,
        concluida: false
      }
    ];

    this.saveAll(defaultTasks);
  },

  generateId() {
    return Date.now();
  },

  add(task) {
    const tasks = this.getAll();

    const newTask = {
      id: this.generateId(),
      titulo: task.titulo,
      descricao: task.descricao || "",
      duracao: Number(task.duracao),
      prioridade: task.prioridade,
      esforco: task.esforco,
      prazo: task.prazo || "",
      periodo: task.periodo || null,
      concluida: false
    };

    tasks.push(newTask);
    this.saveAll(tasks);

    return newTask;
  },

  update(taskId, updatedTask) {
    const tasks = this.getAll().map((task) =>
      task.id === taskId ? { ...task, ...updatedTask } : task
    );

    this.saveAll(tasks);
  },

  delete(taskId) {
    const tasks = this.getAll().filter((task) => task.id !== taskId);
    this.saveAll(tasks);
  },

  toggle(taskId) {
    const tasks = this.getAll().map((task) =>
      task.id === taskId ? { ...task, concluida: !task.concluida } : task
    );

    this.saveAll(tasks);
  },

  findById(taskId) {
    return this.getAll().find((task) => task.id === taskId);
  },

  getPending() {
    return this.getAll().filter((task) => !task.concluida);
  },

  getCompleted() {
    return this.getAll().filter((task) => task.concluida);
  },

  getByPeriod(periodo) {
    return this.getAll().filter((task) => task.periodo === periodo);
  },

  getUnplanned() {
    return this.getAll().filter((task) => !task.periodo);
  },

  setPeriod(taskId, periodo) {
    const tasks = this.getAll().map((task) =>
      task.id === taskId ? { ...task, periodo: periodo || null } : task
    );

    this.saveAll(tasks);
  },

  clearPeriod(taskId) {
    const tasks = this.getAll().map((task) =>
      task.id === taskId ? { ...task, periodo: null } : task
    );

    this.saveAll(tasks);
  },

  countBy(field, value) {
    return this.getAll().filter((task) => task[field] === value).length;
  },

  getGroupedStats() {
    return {
      prioridade: {
        alta: this.countBy("prioridade", "alta"),
        media: this.countBy("prioridade", "media"),
        baixa: this.countBy("prioridade", "baixa")
      },
      esforco: {
        alto: this.countBy("esforco", "alto"),
        medio: this.countBy("esforco", "medio"),
        baixo: this.countBy("esforco", "baixo")
      }
    };
  },

  getStats() {
    const tasks = this.getAll();

    return {
      total: tasks.length,
      completed: tasks.filter((task) => task.concluida).length,
      pending: tasks.filter((task) => !task.concluida).length,
      totalMinutes: tasks
        .filter((task) => task.concluida)
        .reduce((sum, task) => sum + Number(task.duracao || 0), 0)
    };
  },

  getTodayString() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  },

  getTomorrowString() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  },

  getCurrentPeriod() {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) return "manha";
    if (hour >= 12 && hour < 18) return "tarde";
    return "noite";
  },

  getPriorityScore(prioridade) {
    if (prioridade === "alta") return 4;
    if (prioridade === "media") return 2;
    return 1;
  },

  getEnergyScore(esforco, energia) {
    const mapa = {
      baixa: { baixo: 4, medio: 1, alto: -4 },
      media: { baixo: 2, medio: 4, alto: 1 },
      alta: { baixo: 1, medio: 3, alto: 4 }
    };

    return mapa[energia]?.[esforco] ?? 0;
  },

  getTimeScore(duracao, tempoDisponivel) {
    if (duracao <= tempoDisponivel) return 3;
    if (duracao <= tempoDisponivel + 15) return -1;
    return -4;
  },

  getDeadlineScore(prazo) {
    if (!prazo) return 0;

    const hoje = this.getTodayString();
    const amanha = this.getTomorrowString();

    if (prazo === hoje) return 4;
    if (prazo === amanha) return 2;
    return 0;
  },

  getPeriodScore(periodo) {
    if (!periodo) return 0;
    return periodo === this.getCurrentPeriod() ? 2 : 0;
  },

  scoreTask(task, energia, tempoDisponivel) {
    return (
      this.getPriorityScore(task.prioridade) +
      this.getEnergyScore(task.esforco, energia) +
      this.getTimeScore(task.duracao, tempoDisponivel) +
      this.getDeadlineScore(task.prazo) +
      this.getPeriodScore(task.periodo)
    );
  },

  getBestTaskForMoment(energia, tempoDisponivel) {
    const pendingTasks = this.getPending();

    if (!pendingTasks.length) return null;

    const ordered = [...pendingTasks].sort((a, b) => {
      const scoreA = this.scoreTask(a, energia, tempoDisponivel);
      const scoreB = this.scoreTask(b, energia, tempoDisponivel);
      return scoreB - scoreA;
    });

    return ordered[0];
  },

  getSuggestedTasks(energia, tempoDisponivel, limit = 3) {
    const pendingTasks = this.getPending();

    return [...pendingTasks]
      .sort((a, b) => {
        const scoreA = this.scoreTask(a, energia, tempoDisponivel);
        const scoreB = this.scoreTask(b, energia, tempoDisponivel);
        return scoreB - scoreA;
      })
      .slice(0, limit);
  }

};