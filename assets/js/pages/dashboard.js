const user = requireAuth();

if (!user) {
  throw new Error("Usuário não autenticado.");
}

TaskService.createDefaults();

const logoutBtn = document.getElementById("logoutBtn");
const sidebarUserName = document.getElementById("sidebarUserName");
const welcomeTitle = document.getElementById("welcomeTitle");
const energyBadge = document.getElementById("energyBadge");
const currentEnergyText = document.getElementById("currentEnergyText");
const suggestionText = document.getElementById("suggestionText");
const bestTask = document.getElementById("bestTask");
const taskList = document.getElementById("taskList");
const doneCount = document.getElementById("doneCount");
const pendingCount = document.getElementById("pendingCount");
const productiveTime = document.getElementById("productiveTime");
const timeAvailable = document.getElementById("timeAvailable");
const reorganizeBtn = document.getElementById("reorganizeBtn");
const refreshSuggestionBtn = document.getElementById("refreshSuggestionBtn");
const energyButtons = document.querySelectorAll(".energy-btn");

let currentEnergy = localStorage.getItem("fluir_energy") || PreferencesService.get().energiaPadrao || "media";

function getSuggestionByEnergy(energy) {
  if (energy === "baixa") {
    return "Priorize tarefas leves e rápidas para não se sobrecarregar.";
  }

  if (energy === "alta") {
    return "Aproveite para avançar em tarefas mais intensas e importantes.";
  }

  return "Circule tarefas de esforço moderado.";
}

function scoreTask(task, energy, availableTime) {
  let score = 0;

  if (task.prioridade === "alta") score += 3;
  if (task.prioridade === "media") score += 2;
  if (task.prioridade === "baixa") score += 1;

  if (task.duracao <= availableTime) score += 2;
  else score -= 2;

  if (energy === "baixa" && task.esforco === "baixo") score += 3;
  if (energy === "media" && task.esforco === "medio") score += 3;
  if (energy === "alta" && task.esforco === "alto") score += 3;

  if (energy === "alta" && task.esforco === "medio") score += 2;
  if (energy === "media" && task.esforco === "baixo") score += 2;
  if (energy === "baixa" && task.esforco === "medio") score += 1;

  if (energy === "baixa" && task.esforco === "alto") score -= 3;

  return score;
}

function getBestTask(tasks, energy, availableTime) {
  const pendingTasks = tasks.filter((task) => !task.concluida);

  if (!pendingTasks.length) return null;

  const ordered = [...pendingTasks].sort(
    (a, b) => scoreTask(b, energy, availableTime) - scoreTask(a, energy, availableTime)
  );

  return ordered[0];
}

function updateEnergyUI() {
  const label = Utils.formatEnergyLabel(currentEnergy);

  energyBadge.textContent = label;
  currentEnergyText.textContent = label;
  suggestionText.textContent = getSuggestionByEnergy(currentEnergy);

  energyButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.energy === currentEnergy);
  });
}

function renderBestTask(task) {
  if (!task) {
    bestTask.innerHTML = `
      <h4>Nenhuma tarefa pendente</h4>
      <p>Você concluiu tudo por enquanto.</p>
    `;
    return;
  }

  bestTask.innerHTML = `
    <h4>${task.titulo}</h4>
    <p>${task.duracao} min · prioridade ${task.prioridade} · esforço ${task.esforco}</p>
  `;
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  if (!tasks.length) {
    taskList.innerHTML = `
      <div class="task-item">
        <div class="task-info">
          <h4>Nenhuma tarefa disponível</h4>
          <p>Crie novas tarefas para começar.</p>
        </div>
      </div>
    `;
    return;
  }

  tasks.forEach((task) => {
    const item = document.createElement("div");
    item.className = "task-item";

    item.innerHTML = `
      <div class="task-left">
        <input type="checkbox" ${task.concluida ? "checked" : ""} data-id="${task.id}" />
        <div class="task-info">
          <h4>${task.titulo}</h4>
          <p>${task.duracao} min</p>
        </div>
      </div>

      <div class="task-tags">
        <span class="task-tag">${task.prioridade}</span>
        <span class="task-tag">${task.esforco}</span>
      </div>
    `;

    taskList.appendChild(item);
  });

  document.querySelectorAll(".task-left input").forEach((input) => {
    input.addEventListener("change", function () {
      TaskService.toggle(Number(this.dataset.id));
      loadDashboard();
    });
  });
}

function updateSummary(tasks) {
  const completed = tasks.filter((task) => task.concluida).length;
  const pending = tasks.filter((task) => !task.concluida).length;
  const totalMinutes = tasks
    .filter((task) => task.concluida)
    .reduce((sum, task) => sum + task.duracao, 0);

  doneCount.textContent = completed;
  pendingCount.textContent = pending;
  productiveTime.textContent = `${totalMinutes} min`;
}

function loadDashboard() {
  const tasks = TaskService.getAll();
  const availableTime = Number(timeAvailable.value);

  updateEnergyUI();
  renderTasks(tasks);
  updateSummary(tasks);

  const best = getBestTask(tasks, currentEnergy, availableTime);
  renderBestTask(best);
}

function initDashboard() {
  sidebarUserName.textContent = user.nome;
  welcomeTitle.textContent = `Boa tarde, ${user.nome}`;

  const preferences = PreferencesService.get();
  timeAvailable.value = preferences.tempoPadrao || "60";

  updateEnergyUI();
  loadDashboard();
}

energyButtons.forEach((button) => {
  button.addEventListener("click", function () {
    currentEnergy = this.dataset.energy;
    localStorage.setItem("fluir_energy", currentEnergy);
    loadDashboard();
  });
});

timeAvailable.addEventListener("change", loadDashboard);

reorganizeBtn.addEventListener("click", () => {
  loadDashboard();
  Toast.show("Dia reorganizado com sucesso.");
});

refreshSuggestionBtn.addEventListener("click", () => {
  loadDashboard();
  Toast.show("Sugestões atualizadas.");
});

logoutBtn.addEventListener("click", () => {
  Session.logout();
});

initDashboard();