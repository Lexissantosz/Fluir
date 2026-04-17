const welcomeTitle = document.getElementById("welcomeTitle");
const sidebarName = document.getElementById("sidebarName");
const sidebarPronoun = document.getElementById("sidebarPronoun");
const sidebarAvatar = document.getElementById("sidebarAvatar");
const sidebarFocus = document.getElementById("sidebarFocus");
const sidebarEnergy = document.getElementById("sidebarEnergy");
const sidebarSoftText = document.getElementById("sidebarSoftText");

const focusTitle = document.getElementById("focusTitle");
const focusText = document.getElementById("focusText");
const calmPhrase = document.getElementById("calmPhrase");

const energyValue = document.getElementById("energyValue");
const mainFocusValue = document.getElementById("mainFocusValue");
const availableTimeValue = document.getElementById("availableTimeValue");

const nextTaskTitle = document.getElementById("nextTaskTitle");
const nextTaskPeriod = document.getElementById("nextTaskPeriod");

const tasksToday = document.getElementById("tasksToday");
const tasksDone = document.getElementById("tasksDone");
const mentalState = document.getElementById("mentalState");

const summaryPriority = document.getElementById("summaryPriority");
const summaryPeriod = document.getElementById("summaryPeriod");
const summaryRhythm = document.getElementById("summaryRhythm");

const taskList = document.getElementById("taskList");

const newTaskBtn = document.getElementById("newTaskBtn");
const notificationBtn = document.getElementById("notificationBtn");

const changeEnergyBtn = document.getElementById("changeEnergyBtn");
const changeFocusBtn = document.getElementById("changeFocusBtn");
const changeTimeBtn = document.getElementById("changeTimeBtn");
const openContextModalBtn = document.getElementById("openContextModalBtn");

const notificationPanel = document.getElementById("notificationPanel");
const notificationList = document.getElementById("notificationList");

const taskModal = document.getElementById("taskModal");
const closeTaskModalBtn = document.getElementById("closeTaskModal");
const cancelTaskModalBtn = document.getElementById("cancelTaskModal");
const taskForm = document.getElementById("taskForm");
const modalTaskTitle = document.getElementById("modalTaskTitle");
const modalTaskPeriod = document.getElementById("modalTaskPeriod");
const modalTaskTag = document.getElementById("modalTaskTag");
const taskModalMessage = document.getElementById("taskModalMessage");
const taskToast = document.getElementById("taskToast");
const toastTitle = document.getElementById("toastTitle");
const toastText = document.getElementById("toastText");

const contextModal = document.getElementById("contextModal");
const closeContextModalBtn = document.getElementById("closeContextModal");
const cancelContextModalBtn = document.getElementById("cancelContextModal");
const contextForm = document.getElementById("contextForm");
const contextEnergy = document.getElementById("contextEnergy");
const contextFocus = document.getElementById("contextFocus");
const contextAvailableTime = document.getElementById("contextAvailableTime");
const contextModalMessage = document.getElementById("contextModalMessage");

/* ========================================
   LABELS E TEXTOS AUXILIARES
======================================== */
function getEnergyLabel(energy) {
  if (energy === "baixa") return "Baixa";
  if (energy === "media") return "Média";
  if (energy === "alta") return "Alta";
  if (energy === "varia bastante") return "Variável";
  return "Não definida";
}

function getMentalState(energy) {
  if (energy === "alta") return "Produtivo";
  if (energy === "media") return "Estável";
  if (energy === "baixa") return "Mais leve";
  if (energy === "varia bastante") return "Oscilando";
  return "Neutro";
}

function getPeriodLabel(period) {
  if (period === "manha") return "Manhã";
  if (period === "tarde") return "Tarde";
  if (period === "noite") return "Noite";
  if (period === "sem horario fixo") return "Sem horário fixo";
  return "Não definido";
}

function getTagLabel(tag) {
  if (!tag) return "Sem tag";
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

function getRhythmText(energy, availableTime) {
  if (energy === "alta" && (availableTime === "2 horas" || availableTime === "3 horas")) {
    return "Sua energia e seu tempo estão favoráveis. Aproveite para avançar com profundidade.";
  }

  if (energy === "media" && (availableTime === "45 min" || availableTime === "1 hora")) {
    return "Mantenha constância com pausas curtas e foco no essencial.";
  }

  if (energy === "baixa" && (availableTime === "15 min" || availableTime === "30 min")) {
    return "Hoje vale mais leveza do que pressão. Escolha passos simples.";
  }

  if (energy === "baixa") {
    return "Prefira começar com algo leve e possível para o seu momento.";
  }

  if (availableTime === "15 min" || availableTime === "30 min") {
    return "Pouco tempo ainda pode render bons passos.";
  }

  return "Avance em pequenos passos com constância.";
}

function getCalmPhrase(energy, availableTime) {
  if (energy === "baixa" && (availableTime === "15 min" || availableTime === "30 min")) {
    return "Hoje você não precisa fazer tudo. Só o que cabe com gentileza.";
  }

  if (energy === "baixa") {
    return "Pegue leve com você. Começar pequeno já conta.";
  }

  if (energy === "media" && availableTime === "45 min") {
    return "Um ritmo tranquilo e consistente pode render mais do que pressa.";
  }

  if (energy === "alta" && (availableTime === "2 horas" || availableTime === "3 horas")) {
    return "Sua energia está boa. Use esse momento com intenção, não com cobrança.";
  }

  if (availableTime === "15 min") {
    return "Mesmo pouco tempo pode virar um avanço bonito.";
  }

  if (availableTime === "1 hora" || availableTime === "1h30") {
    return "Você tem espaço para construir com calma e clareza.";
  }

  return "Respire. Um passo de cada vez já é progresso.";
}

function getCompletionPhrase() {
  const phrases = [
    "Você concluiu uma atividade com calma e constância.",
    "Parabéns. Um passo feito com presença vale muito.",
    "Seu ritmo também é progresso. Continue com leveza.",
    "Você avançou mais um pouco, e isso importa.",
    "Mais uma tarefa finalizada. Com gentileza, você segue.",
    "Pequenos avanços constroem dias mais leves."
  ];

  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
}

function showTaskToast() {
  if (!taskToast || !toastTitle || !toastText) return;

  toastTitle.textContent = "Parabéns!";
  toastText.textContent = getCompletionPhrase();

  taskToast.classList.add("show");

  setTimeout(() => {
    taskToast.classList.remove("show");
  }, 3200);
}

function getSidebarSoftPhrase(energy) {
  if (energy === "baixa") {
    return "Hoje, vá com gentileza. O pouco feito com calma já vale.";
  }

  if (energy === "media") {
    return "Seu ritmo pode ser tranquilo e ainda assim produtivo.";
  }

  if (energy === "alta") {
    return "Use sua energia com intenção, não com pressão.";
  }

  return "Seu ritmo também é cuidado.";
}

function normalizeDate(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString + "T00:00:00");
  date.setHours(0, 0, 0, 0);
  return date;
}

function getTodayDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function getTaskTimingStatus(task) {
  if (!task.deadline) {
    return {
      key: "no-date",
      label: "Sem data"
    };
  }

  const today = getTodayDate();
  const deadline = normalizeDate(task.deadline);

  if (!deadline) {
    return {
      key: "no-date",
      label: "Sem data"
    };
  }

  if (deadline < today) {
    return {
      key: "overdue",
      label: "Atrasada"
    };
  }

  if (deadline.getTime() === today.getTime()) {
    return {
      key: "today",
      label: "Hoje"
    };
  }

  return {
    key: "upcoming",
    label: "Próxima"
  };
}

function formatDeadlineLabel(deadline) {
  if (!deadline) return "Sem data";

  const date = normalizeDate(deadline);
  if (!date) return "Sem data";

  return date.toLocaleDateString("pt-BR");
}

function getPriorityWeight(priority) {
  if (priority === "alta") return 3;
  if (priority === "media") return 2;
  if (priority === "baixa") return 1;
  return 0;
}

function getTimingWeight(task) {
  const status = getTaskTimingStatus(task).key;

  if (status === "overdue") return 4;
  if (status === "today") return 3;
  if (status === "upcoming") return 2;
  return 1;
}

function sortTasksForHome(tasks) {
  return [...tasks].sort((a, b) => {
    const timingDiff = getTimingWeight(b) - getTimingWeight(a);
    if (timingDiff !== 0) return timingDiff;

    const priorityDiff = getPriorityWeight(b.priority) - getPriorityWeight(a.priority);
    if (priorityDiff !== 0) return priorityDiff;

    const aDate = normalizeDate(a.deadline);
    const bDate = normalizeDate(b.deadline);

    if (aDate && bDate) {
      return aDate - bDate;
    }

    if (aDate && !bDate) return -1;
    if (!aDate && bDate) return 1;

    return 0;
  });
}
/* ========================================
   LOCALSTORAGE - PERFIL E TAREFAS
======================================== */
function getStoredProfile() {
  const raw = localStorage.getItem("fluir_user_profile");

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Erro ao ler perfil:", error);
    return null;
  }
}

function saveProfile(profile) {
  localStorage.setItem("fluir_user_profile", JSON.stringify(profile));
}

function getStoredTasks(profileData) {
  const rawTasks = localStorage.getItem("fluir_tasks");

  if (rawTasks) {
    try {
      return JSON.parse(rawTasks);
    } catch (error) {
      console.error("Erro ao ler tarefas:", error);
    }
  }

  if (profileData && profileData.firstTask) {
    return [profileData.firstTask];
  }

  return [];
}

function saveTasks(tasks) {
  localStorage.setItem("fluir_tasks", JSON.stringify(tasks));
}

/* ========================================
   TAREFAS PENDENTES PARA A HOME
======================================== */
function getVisibleHomeTasks(tasks) {
  const pendingTasks = tasks.filter((task) => !task.completed);
  return sortTasksForHome(pendingTasks);
}

/* ========================================
   ESTATÍSTICAS
======================================== */
function updateStats(allTasks, visibleTasks) {
  const completedCount = allTasks.filter((task) => task.completed).length;

  if (tasksToday) tasksToday.textContent = String(visibleTasks.length);
  if (tasksDone) tasksDone.textContent = String(completedCount);
}

/* ========================================
   RENDERIZAÇÃO DAS TAREFAS
======================================== */
function renderTaskList(tasks) {
  if (!taskList) return;

  if (!tasks.length) {
    taskList.innerHTML = `
      <div class="task-item">
        <div class="task-main">
          <strong>Nenhuma atividade cadastrada</strong>
          <span>Comece criando uma tarefa</span>
        </div>
        <div class="task-status no-date">Vazio</div>
      </div>
    `;
    return;
  }

  taskList.innerHTML = tasks
    .map((task) => {
      const safeTitle = task.title ? task.title : "Tarefa sem nome";
      const periodText = getPeriodLabel(task.period || "");
      const tagText = getTagLabel(task.tag || "");
      const deadlineText = formatDeadlineLabel(task.deadline);
      const timingStatus = getTaskTimingStatus(task);

      return `
        <div class="task-item">
          <div class="task-main">
            <strong>${safeTitle}</strong>
            <span>${periodText}</span>

            <div class="task-details">
              <span class="task-detail-badge">${tagText}</span>
              <span class="task-detail-badge">${deadlineText}</span>
            </div>
          </div>

          <div class="task-item-actions">
            <button
              type="button"
              class="task-action-btn"
              onclick="toggleTaskStatus(${task.originalIndex})"
            >
              Concluir
            </button>

            <div class="task-status ${timingStatus.key}">
              ${timingStatus.label}
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

/* ========================================
   NOTIFICAÇÕES
======================================== */
function getNotifications(tasks) {
  const notifications = [];
  const pendingTasks = tasks.filter((task) => !task.completed);

  if (!pendingTasks.length) {
    return notifications;
  }

  notifications.push({
    title: "Tarefas pendentes",
    text: `Você tem ${pendingTasks.length} tarefa(s) pendente(s) no momento.`,
    time: "Agora"
  });

  return notifications;
}

function renderNotifications(tasks) {
  if (!notificationList) return;

  const notifications = getNotifications(tasks);

  if (!notifications.length) {
    notificationList.innerHTML = `
      <div class="notification-empty">
        <div class="notification-empty-icon">
          <i class="bi bi-bell"></i>
        </div>
        <strong>Nenhuma notificação por enquanto</strong>
        <p>Quando houver lembretes, avisos ou atualizações, eles aparecerão aqui.</p>
      </div>
    `;
    return;
  }

  notificationList.innerHTML = notifications
    .map((notification) => {
      return `
        <div class="notification-item">
          <strong>${notification.title}</strong>
          <p>${notification.text}</p>
          <span>${notification.time}</span>
        </div>
      `;
    })
    .join("");
}

function toggleNotifications() {
  if (!notificationPanel) return;
  notificationPanel.classList.toggle("active");
}

function closeNotifications() {
  if (!notificationPanel) return;
  notificationPanel.classList.remove("active");
}

/* ========================================
   MENSAGENS DOS MODAIS
======================================== */
function showTaskModalMessage(message, type = "error") {
  if (!taskModalMessage) return;
  taskModalMessage.textContent = message;
  taskModalMessage.className = `modal-message show ${type}`;
}

function clearTaskModalMessage() {
  if (!taskModalMessage) return;
  taskModalMessage.textContent = "";
  taskModalMessage.className = "modal-message";
}

function showContextModalMessage(message, type = "error") {
  if (!contextModalMessage) return;
  contextModalMessage.textContent = message;
  contextModalMessage.className = `modal-message show ${type}`;
}

function clearContextModalMessage() {
  if (!contextModalMessage) return;
  contextModalMessage.textContent = "";
  contextModalMessage.className = "modal-message";
}

/* ========================================
   MODAL DE NOVA TAREFA
======================================== */
function openTaskModal() {
  if (!taskModal) return;

  closeNotifications();
  taskModal.classList.add("active");
  clearTaskModalMessage();

  if (modalTaskTitle) modalTaskTitle.value = "";
  if (modalTaskPeriod) modalTaskPeriod.value = "";
  if (modalTaskTag) modalTaskTag.value = "";

  setTimeout(() => {
    if (modalTaskTitle) modalTaskTitle.focus();
  }, 100);
}

function closeTaskModal() {
  if (!taskModal) return;
  taskModal.classList.remove("active");
  clearTaskModalMessage();
}

function createTaskFromModal(event) {
  event.preventDefault();

  if (!modalTaskTitle || !modalTaskPeriod || !modalTaskTag) return;

  const title = modalTaskTitle.value.trim();
  const period = modalTaskPeriod.value;
  const tag = modalTaskTag.value;

  if (!title) {
    showTaskModalMessage("Digite o nome da tarefa.");
    return;
  }

  if (!period) {
    showTaskModalMessage("Selecione o período da tarefa.");
    return;
  }

  if (!tag) {
    showTaskModalMessage("Selecione a tag/foco da tarefa.");
    return;
  }

  const currentTasks = getStoredTasks(getStoredProfile());

  currentTasks.push({
    title,
    period,
    tag,
    completed: false,
    createdAt: new Date().toISOString()
  });

  saveTasks(currentTasks);
  closeTaskModal();
  loadHomeData();
}

/* ========================================
   MODAL DE CONTEXTO
======================================== */
function openContextModal() {
  if (!contextModal) return;

  const profile = getStoredProfile();

  closeNotifications();
  contextModal.classList.add("active");
  clearContextModalMessage();

  if (contextEnergy) contextEnergy.value = profile?.energy || "";
  if (contextFocus) contextFocus.value = profile?.focus || "";
  if (contextAvailableTime) contextAvailableTime.value = profile?.availableTime || "";

  setTimeout(() => {
    if (contextEnergy) contextEnergy.focus();
  }, 100);
}

function closeContextModal() {
  if (!contextModal) return;
  contextModal.classList.remove("active");
  clearContextModalMessage();
}

function saveContextFromModal(event) {
  event.preventDefault();

  if (!contextEnergy || !contextFocus || !contextAvailableTime) return;

  const energy = contextEnergy.value;
  const focus = contextFocus.value.trim();
  const availableTime = contextAvailableTime.value;

  if (!energy) {
    showContextModalMessage("Selecione sua energia atual.");
    return;
  }

  if (!focus) {
    showContextModalMessage("Digite seu foco atual.");
    return;
  }

  if (!availableTime) {
    showContextModalMessage("Selecione seu tempo disponível.");
    return;
  }

  const profile = getStoredProfile();
  if (!profile) return;

  profile.energy = energy;
  profile.focus = focus;
  profile.availableTime = availableTime;

  saveProfile(profile);
  closeContextModal();
  loadHomeData();
}

/* ========================================
   CARREGAR DADOS NA HOME
======================================== */
function loadHomeData() {
  const profileData = getStoredProfile();

  if (!profileData) {
    window.location.href = "onboarding.html";
    return;
  }

  const allTasks = getStoredTasks(profileData).map((task, index) => ({
    ...task,
    originalIndex: index
  }));

  saveTasks(allTasks.map(({ originalIndex, ...task }) => task));

  const visibleTasks = getVisibleHomeTasks(allTasks);
  const userName = profileData.name || "Usuário";
  const pronoun = profileData.pronoun || "Pronome";
  const focus = profileData.focus || "Organização geral";
  const energy = profileData.energy || "";
  const availableTime = profileData.availableTime || "Não definido";
  const firstTask = visibleTasks.length ? visibleTasks[0] : null;

  if (welcomeTitle) welcomeTitle.textContent = `Olá, ${userName}.`;
  if (sidebarName) sidebarName.textContent = userName;
  if (sidebarPronoun) sidebarPronoun.textContent = pronoun;
  if (sidebarFocus) sidebarFocus.textContent = `Foco: ${focus}`;
if (sidebarEnergy) sidebarEnergy.textContent = `Energia: ${getEnergyLabel(energy)}`;
if (sidebarSoftText) sidebarSoftText.textContent = getSidebarSoftPhrase(energy);

  if (energyValue) energyValue.textContent = getEnergyLabel(energy);
  if (mainFocusValue) mainFocusValue.textContent = focus;
  if (availableTimeValue) availableTimeValue.textContent = availableTime;
  if (mentalState) mentalState.textContent = getMentalState(energy);
  if (summaryRhythm) summaryRhythm.textContent = getRhythmText(energy, availableTime);

  if (focusTitle) focusTitle.textContent = `Seu foco principal hoje é ${focus}.`;
  if (focusText) {
    focusText.textContent =
      "Organize o que importa agora e avance com clareza, respeitando sua energia.";
  }
  if (calmPhrase) {
    calmPhrase.textContent = getCalmPhrase(energy, availableTime);
  }

  if (firstTask) {
    if (nextTaskTitle) nextTaskTitle.textContent = firstTask.title || "Tarefa sem nome";
   if (nextTaskPeriod) {
  const timingStatus = getTaskTimingStatus(firstTask);
  nextTaskPeriod.textContent = `${timingStatus.label} • ${getPeriodLabel(firstTask.period || "")} • ${getTagLabel(firstTask.tag || "")}`;
}

    if (summaryPriority) {
      summaryPriority.textContent = firstTask.title || "Tarefa sem nome";
    }

    if (summaryPeriod) {
  const timingStatus = getTaskTimingStatus(firstTask);
  summaryPeriod.textContent = `${timingStatus.label} • ${getPeriodLabel(firstTask.period || "")}`;
}

  } else {
    if (nextTaskTitle) nextTaskTitle.textContent = "Nenhuma tarefa definida";
    if (nextTaskPeriod) {
      nextTaskPeriod.textContent = "Adicione sua primeira atividade para começar.";
    }

    if (summaryPriority) {
      summaryPriority.textContent = "Começar sua primeira atividade.";
    }

    if (summaryPeriod) {
  summaryPeriod.textContent = "Nenhuma atividade pendente no momento.";
}
  }

  if (profileData.photo && sidebarAvatar) {
    sidebarAvatar.innerHTML = `<img src="${profileData.photo}" alt="Foto de perfil">`;
  }

  updateStats(allTasks, visibleTasks);
  renderTaskList(visibleTasks);
  renderNotifications(visibleTasks);
}

/* ========================================
   AÇÕES DAS TAREFAS
======================================== */
function toggleTaskStatus(index) {
  const currentTasks = getStoredTasks(getStoredProfile());

  if (!currentTasks[index]) return;

  const wasCompleted = currentTasks[index].completed;
  currentTasks[index].completed = !currentTasks[index].completed;

  saveTasks(currentTasks);
  loadHomeData();

  if (!wasCompleted && currentTasks[index].completed) {
    showTaskToast();
  }
}

window.toggleTaskStatus = toggleTaskStatus;

/* ========================================
   EVENTOS DOS BOTÕES
======================================== */
if (newTaskBtn) {
  newTaskBtn.addEventListener("click", openTaskModal);
}

if (changeEnergyBtn) {
  changeEnergyBtn.addEventListener("click", openContextModal);
}

if (changeFocusBtn) {
  changeFocusBtn.addEventListener("click", openContextModal);
}

if (changeTimeBtn) {
  changeTimeBtn.addEventListener("click", openContextModal);
}

if (openContextModalBtn) {
  openContextModalBtn.addEventListener("click", openContextModal);
}

if (notificationBtn) {
  notificationBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleNotifications();
  });
}

if (closeTaskModalBtn) {
  closeTaskModalBtn.addEventListener("click", closeTaskModal);
}

if (cancelTaskModalBtn) {
  cancelTaskModalBtn.addEventListener("click", closeTaskModal);
}

if (taskForm) {
  taskForm.addEventListener("submit", createTaskFromModal);
}

if (closeContextModalBtn) {
  closeContextModalBtn.addEventListener("click", closeContextModal);
}

if (cancelContextModalBtn) {
  cancelContextModalBtn.addEventListener("click", closeContextModal);
}

if (contextForm) {
  contextForm.addEventListener("submit", saveContextFromModal);
}

/* ========================================
   FECHAR MODAIS CLICANDO FORA
======================================== */
if (taskModal) {
  taskModal.addEventListener("click", (event) => {
    if (event.target === taskModal) {
      closeTaskModal();
    }
  });
}

if (contextModal) {
  contextModal.addEventListener("click", (event) => {
    if (event.target === contextModal) {
      closeContextModal();
    }
  });
}

/* ========================================
   FECHAR NOTIFICAÇÕES CLICANDO FORA
======================================== */
document.addEventListener("click", (event) => {
  if (!notificationPanel || !notificationBtn) return;

  const clickedInsidePanel = notificationPanel.contains(event.target);
  const clickedButton = notificationBtn.contains(event.target);

  if (!clickedInsidePanel && !clickedButton) {
    closeNotifications();
  }
});

/* ========================================
   FECHAR COM ESC
======================================== */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (taskModal && taskModal.classList.contains("active")) {
      closeTaskModal();
    }

    if (contextModal && contextModal.classList.contains("active")) {
      closeContextModal();
    }

    if (notificationPanel && notificationPanel.classList.contains("active")) {
      closeNotifications();
    }
  }
});

loadHomeData();