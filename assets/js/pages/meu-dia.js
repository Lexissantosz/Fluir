const user = requireAuth();
if (!user) return;

TaskService.createDefaults();

const sidebarUserName = document.getElementById("sidebarUserName");
const logoutBtn = document.getElementById("logoutBtn");

const energyButtons = document.querySelectorAll(".energy-btn");
const timeButtons = document.querySelectorAll(".time-btn");

const suggestionContainer = document.getElementById("suggestionContainer");

let selectedEnergy = null;
let selectedTime = null;

sidebarUserName.textContent = user.nome;

function updateActiveButtons(buttons, selected, attr) {
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset[attr] === selected);
  });
}

energyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedEnergy = btn.dataset.energy;
    updateActiveButtons(energyButtons, selectedEnergy, "energy");
    generateSuggestion();
  });
});

timeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedTime = Number(btn.dataset.time);
    updateActiveButtons(timeButtons, String(selectedTime), "time");
    generateSuggestion();
  });
});

function buildTag(text) {
  return `<span class="task-tag">${text}</span>`;
}

function renderEmptySuggestion() {
  suggestionContainer.innerHTML = `
    <div class="empty-state">
      <h4>Nada ideal agora</h4>
      <p>Tente ajustar sua energia ou seu tempo disponível.</p>
    </div>
  `;
}

function renderSuggestion(bestTask, suggestions) {
  suggestionContainer.innerHTML = `
    <div class="task-item-page">
      <div class="task-main">
        <div class="task-top">
          <h4>${bestTask.titulo}</h4>
          ${buildTag("melhor escolha")}
        </div>

        <p class="task-description">${bestTask.descricao || "Sem descrição."}</p>

        <div class="task-meta">
          ${buildTag(`${bestTask.duracao} min`)}
          ${buildTag(`prioridade ${bestTask.prioridade}`)}
          ${buildTag(`esforço ${bestTask.esforco}`)}
          ${bestTask.prazo ? buildTag(Utils.formatDate(bestTask.prazo)) : ""}
          ${bestTask.periodo ? buildTag(bestTask.periodo) : ""}
        </div>
      </div>

      <div class="task-actions">
        <button class="btn-action" id="completeSuggestedTask">Concluir</button>
      </div>
    </div>

    <div class="card" style="margin-top: 16px;">
      <div class="card-header">
        <h3>Outras boas opções</h3>
      </div>

      <div class="task-list">
        ${suggestions
          .filter((task) => task.id !== bestTask.id)
          .map((task) => `
            <div class="task-item">
              <div class="task-info">
                <h4>${task.titulo}</h4>
                <p>${task.duracao} min · prioridade ${task.prioridade} · esforço ${task.esforco}</p>
              </div>

              <div class="task-tags">
                ${task.periodo ? `<span class="task-tag">${task.periodo}</span>` : ""}
              </div>
            </div>
          `)
          .join("")}
      </div>
    </div>
  `;

  const completeButton = document.getElementById("completeSuggestedTask");
  completeButton.addEventListener("click", () => {
    TaskService.toggle(bestTask.id);
    Toast.show("Tarefa concluída");
    generateSuggestion();
  });
}

function generateSuggestion() {
  if (!selectedEnergy || !selectedTime) {
    suggestionContainer.innerHTML = `
      <div class="empty-state">
        <h4>Escolha sua energia e seu tempo</h4>
        <p>Assim o Fluir encontra a melhor tarefa para agora.</p>
      </div>
    `;
    return;
  }

  const bestTask = TaskService.getBestTaskForMoment(selectedEnergy, selectedTime);
  const suggestions = TaskService.getSuggestedTasks(selectedEnergy, selectedTime, 4);

  if (!bestTask) {
    renderEmptySuggestion();
    return;
  }

  renderSuggestion(bestTask, suggestions);
}

logoutBtn.addEventListener("click", () => {
  Session.logout();
});

generateSuggestion();