const user = requireAuth();
if (!user) return;

TaskService.createDefaults();

const sidebarUserName = document.getElementById("sidebarUserName");
const logoutBtn = document.getElementById("logoutBtn");

const unplannedTasks = document.getElementById("unplannedTasks");
const unplannedCounter = document.getElementById("unplannedCounter");

const manhaList = document.getElementById("manhaList");
const tardeList = document.getElementById("tardeList");
const noiteList = document.getElementById("noiteList");

sidebarUserName.textContent = user.nome;

function buildTag(text) {
  return `<span class="task-tag">${text}</span>`;
}

function buildTaskCard(task) {
  return `
    <div class="plan-task ${task.concluida ? "task-status-done" : ""}">
      <div class="plan-task-main">
        <h4>${task.titulo}</h4>
        <p>${task.descricao || "Sem descrição."}</p>

        <div class="plan-task-meta">
          ${buildTag(`${task.duracao} min`)}
          ${buildTag(`prioridade ${task.prioridade}`)}
          ${buildTag(`esforço ${task.esforco}`)}
          ${task.prazo ? buildTag(Utils.formatDate(task.prazo)) : ""}
          ${task.concluida ? buildTag("concluída") : buildTag("pendente")}
        </div>
      </div>

      <div class="plan-task-actions">
        <select class="plan-select" data-period="${task.id}">
          <option value="" ${!task.periodo ? "selected" : ""}>Não planejada</option>
          <option value="manha" ${task.periodo === "manha" ? "selected" : ""}>Manhã</option>
          <option value="tarde" ${task.periodo === "tarde" ? "selected" : ""}>Tarde</option>
          <option value="noite" ${task.periodo === "noite" ? "selected" : ""}>Noite</option>
        </select>

        <button class="btn-action" data-toggle="${task.id}">
          ${task.concluida ? "Desmarcar" : "Concluir"}
        </button>

        <button class="btn-action btn-danger" data-remove="${task.id}">
          Remover do bloco
        </button>
      </div>
    </div>
  `;
}

function renderEmptyState(container, text, className) {
  container.innerHTML = `<div class="${className}">${text}</div>`;
}

function renderPlanning() {
  const notPlanned = TaskService.getUnplanned();
  const manha = TaskService.getByPeriod("manha");
  const tarde = TaskService.getByPeriod("tarde");
  const noite = TaskService.getByPeriod("noite");

  unplannedCounter.textContent = `${notPlanned.length} tarefa${notPlanned.length !== 1 ? "s" : ""}`;

  unplannedTasks.innerHTML = notPlanned.length
    ? notPlanned.map(buildTaskCard).join("")
    : "";

  manhaList.innerHTML = manha.length
    ? manha.map(buildTaskCard).join("")
    : "";

  tardeList.innerHTML = tarde.length
    ? tarde.map(buildTaskCard).join("")
    : "";

  noiteList.innerHTML = noite.length
    ? noite.map(buildTaskCard).join("")
    : "";

  if (!notPlanned.length) {
    renderEmptyState(
      unplannedTasks,
      "Todas as tarefas já foram distribuídas.",
      "unplanned-empty"
    );
  }

  if (!manha.length) {
    renderEmptyState(
      manhaList,
      "Nenhuma tarefa planejada para a manhã.",
      "period-empty"
    );
  }

  if (!tarde.length) {
    renderEmptyState(
      tardeList,
      "Nenhuma tarefa planejada para a tarde.",
      "period-empty"
    );
  }

  if (!noite.length) {
    renderEmptyState(
      noiteList,
      "Nenhuma tarefa planejada para a noite.",
      "period-empty"
    );
  }

  bindPlanningEvents();
}

function bindPlanningEvents() {
  document.querySelectorAll("[data-period]").forEach((select) => {
    select.addEventListener("change", () => {
      const taskId = Number(select.dataset.period);
      const periodo = select.value;

      TaskService.setPeriod(taskId, periodo || null);
      Toast.show("Planejamento atualizado");
      renderPlanning();
    });
  });

  document.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      const taskId = Number(button.dataset.remove);

      TaskService.clearPeriod(taskId);
      Toast.show("Tarefa removida do bloco");
      renderPlanning();
    });
  });

  document.querySelectorAll("[data-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const taskId = Number(button.dataset.toggle);

      TaskService.toggle(taskId);
      Toast.show("Status da tarefa atualizado");
      renderPlanning();
    });
  });
}

logoutBtn.addEventListener("click", () => {
  Session.logout();
});

renderPlanning();