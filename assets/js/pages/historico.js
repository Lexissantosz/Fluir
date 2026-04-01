const user = requireAuth();
if (!user) {
  throw new Error("Usuário não autenticado.");
}

TaskService.createDefaults();

const sidebarUserName = document.getElementById("sidebarUserName");
const logoutBtn = document.getElementById("logoutBtn");

const statTotal = document.getElementById("statTotal");
const statDone = document.getElementById("statDone");
const statPending = document.getElementById("statPending");
const statMinutes = document.getElementById("statMinutes");

const prioritySummary = document.getElementById("prioritySummary");
const effortSummary = document.getElementById("effortSummary");

const doneCounter = document.getElementById("doneCounter");
const pendingCounter = document.getElementById("pendingCounter");
const doneTasksList = document.getElementById("doneTasksList");
const pendingTasksList = document.getElementById("pendingTasksList");

sidebarUserName.textContent = user.nome;

function buildTag(text) {
  return `<span class="task-tag">${text}</span>`;
}

function renderStats() {
  const stats = TaskService.getStats();

  statTotal.textContent = stats.total;
  statDone.textContent = stats.completed;
  statPending.textContent = stats.pending;
  statMinutes.textContent = `${stats.totalMinutes} min`;

  doneCounter.textContent = String(stats.completed);
  pendingCounter.textContent = String(stats.pending);
}

function renderPrioritySummary() {
  const grouped = TaskService.getGroupedStats();

  prioritySummary.innerHTML = `
    <div class="summary-item">
      <span>Prioridade alta</span>
      <strong>${grouped.prioridade.alta}</strong>
    </div>
    <div class="summary-item">
      <span>Prioridade média</span>
      <strong>${grouped.prioridade.media}</strong>
    </div>
    <div class="summary-item">
      <span>Prioridade baixa</span>
      <strong>${grouped.prioridade.baixa}</strong>
    </div>
  `;
}

function renderEffortSummary() {
  const grouped = TaskService.getGroupedStats();

  effortSummary.innerHTML = `
    <div class="summary-item">
      <span>Esforço alto</span>
      <strong>${grouped.esforco.alto}</strong>
    </div>
    <div class="summary-item">
      <span>Esforço médio</span>
      <strong>${grouped.esforco.medio}</strong>
    </div>
    <div class="summary-item">
      <span>Esforço baixo</span>
      <strong>${grouped.esforco.baixo}</strong>
    </div>
  `;
}

function renderTaskList(container, tasks, emptyText) {
  if (!tasks.length) {
    container.innerHTML = `<div class="empty-history">${emptyText}</div>`;
    return;
  }

  container.innerHTML = tasks
    .map((task) => {
      return `
        <div class="history-task">
          <div class="history-task-top">
            <h4>${task.titulo}</h4>
            ${task.concluida ? buildTag("concluída") : buildTag("pendente")}
          </div>

          <p>${task.descricao || "Sem descrição."}</p>

          <div class="history-task-meta">
            ${buildTag(`${task.duracao} min`)}
            ${buildTag(`prioridade ${task.prioridade}`)}
            ${buildTag(`esforço ${task.esforco}`)}
            ${buildTag(Utils.formatDate(task.prazo))}
            ${task.periodo ? buildTag(task.periodo) : ""}
          </div>
        </div>
      `;
    })
    .join("");
}

function renderHistory() {
  renderStats();
  renderPrioritySummary();
  renderEffortSummary();

  renderTaskList(
    doneTasksList,
    TaskService.getCompleted(),
    "Nenhuma tarefa concluída ainda."
  );

  renderTaskList(
    pendingTasksList,
    TaskService.getPending(),
    "Nenhuma tarefa pendente no momento."
  );
}

logoutBtn.addEventListener("click", () => {
  Session.logout();
});

renderHistory();