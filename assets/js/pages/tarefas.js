const user = requireAuth();
if (!user) return;

const sidebarUserName = document.getElementById("sidebarUserName");
const logoutBtn = document.getElementById("logoutBtn");

const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskDuration = document.getElementById("taskDuration");
const taskPriority = document.getElementById("taskPriority");
const taskEffort = document.getElementById("taskEffort");
const taskDeadline = document.getElementById("taskDeadline");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const searchTask = document.getElementById("searchTask");
const filterPriority = document.getElementById("filterPriority");
const filterEffort = document.getElementById("filterEffort");
const filterStatus = document.getElementById("filterStatus");

const tasksContainer = document.getElementById("tasksContainer");
const taskCounter = document.getElementById("taskCounter");

let editingTaskId = null;

sidebarUserName.textContent = user.nome;

function buildTag(text) {
  return `<span class="task-tag">${text}</span>`;
}

function clearForm() {
  taskForm.reset();
  taskDuration.value = 30;
  taskPriority.value = "media";
  taskEffort.value = "medio";
  taskDeadline.value = "";
  editingTaskId = null;
}

function fillForm(task) {
  taskTitle.value = task.titulo;
  taskDescription.value = task.descricao || "";
  taskDuration.value = task.duracao;
  taskPriority.value = task.prioridade;
  taskEffort.value = task.esforco;
  taskDeadline.value = task.prazo || "";
  editingTaskId = task.id;
}

function getFilteredTasks() {
  const tasks = TaskService.getAll();

  const search = searchTask.value.trim().toLowerCase();
  const priority = filterPriority.value;
  const effort = filterEffort.value;
  const status = filterStatus.value;

  return tasks.filter((task) => {
    const matchesSearch =
      task.titulo.toLowerCase().includes(search) ||
      (task.descricao || "").toLowerCase().includes(search);

    const matchesPriority =
      priority === "todas" || task.prioridade === priority;

    const matchesEffort =
      effort === "todos" || task.esforco === effort;

    const matchesStatus =
      status === "todas" ||
      (status === "pendentes" && !task.concluida) ||
      (status === "concluidas" && task.concluida);

    return matchesSearch && matchesPriority && matchesEffort && matchesStatus;
  });
}

function renderTasks() {
  const tasks = getFilteredTasks();

  taskCounter.textContent = `${tasks.length} tarefa${tasks.length !== 1 ? "s" : ""}`;

  if (!tasks.length) {
    tasksContainer.innerHTML = `
      <div class="empty-state">
        <h4>Nenhuma tarefa encontrada</h4>
        <p>Tente ajustar os filtros ou criar uma nova tarefa.</p>
      </div>
    `;
    return;
  }

  tasksContainer.innerHTML = tasks.map((task) => `
    <div class="task-item-page ${task.concluida ? "task-status-done" : ""}">
      <div class="task-main">
        <div class="task-top">
          <h4>${task.titulo}</h4>
          ${task.concluida ? buildTag("concluída") : buildTag("pendente")}
        </div>

        <p class="task-description">${task.descricao || "Sem descrição."}</p>

        <div class="task-meta">
          ${buildTag(`${task.duracao} min`)}
          ${buildTag(`prioridade ${task.prioridade}`)}
          ${buildTag(`esforço ${task.esforco}`)}
          ${buildTag(Utils.formatDate(task.prazo))}
        </div>
      </div>

      <div class="task-actions">
        <button class="btn-action" data-toggle="${task.id}">
          ${task.concluida ? "Desmarcar" : "Concluir"}
        </button>
        <button class="btn-action" data-edit="${task.id}">
          Editar
        </button>
        <button class="btn-action btn-danger" data-delete="${task.id}">
          Excluir
        </button>
      </div>
    </div>
  `).join("");

  bindTaskEvents();
}

function bindTaskEvents() {
  document.querySelectorAll("[data-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      TaskService.toggle(Number(button.dataset.toggle));
      Toast.show("Status da tarefa atualizado");
      renderTasks();
    });
  });

  document.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = TaskService.findById(Number(button.dataset.edit));
      if (!task) return;

      fillForm(task);
      window.scrollTo({ top: 0, behavior: "smooth" });
      Toast.show("Modo de edição ativado");
    });
  });

  document.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      TaskService.delete(Number(button.dataset.delete));
      Toast.show("Tarefa removida");
      renderTasks();
    });
  });
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const payload = {
    titulo: taskTitle.value.trim(),
    descricao: taskDescription.value.trim(),
    duracao: Number(taskDuration.value),
    prioridade: taskPriority.value,
    esforco: taskEffort.value,
    prazo: taskDeadline.value
  };

  if (!payload.titulo) {
    Toast.show("Digite o título da tarefa", "error");
    return;
  }

  if (!payload.duracao || payload.duracao < 5) {
    Toast.show("A duração deve ser de pelo menos 5 minutos", "error");
    return;
  }

  if (editingTaskId) {
    const oldTask = TaskService.findById(editingTaskId);

    TaskService.update(editingTaskId, {
      ...oldTask,
      ...payload
    });

    Toast.show("Tarefa atualizada com sucesso");
  } else {
    TaskService.add(payload);
    Toast.show("Tarefa criada com sucesso");
  }

  clearForm();
  renderTasks();
});

cancelEditBtn.addEventListener("click", () => {
  clearForm();
  Toast.show("Edição cancelada");
});

searchTask.addEventListener("input", renderTasks);
filterPriority.addEventListener("change", renderTasks);
filterEffort.addEventListener("change", renderTasks);
filterStatus.addEventListener("change", renderTasks);

logoutBtn.addEventListener("click", () => {
  Session.logout();
});

renderTasks();