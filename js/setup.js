// =====================================================
// FLUIR — CONFIGURAÇÃO INICIAL
// JavaScript puro para controlar o setup em etapas
// =====================================================


// =====================================================
// 1. SELEÇÃO DOS ELEMENTOS PRINCIPAIS
// =====================================================

const body = document.body;

const themeBtn = document.getElementById("themeBtn");

const setupForm = document.getElementById("setupForm");
const setupSteps = document.querySelectorAll(".setup-step");

const stepLabel = document.getElementById("stepLabel");
const stepTitle = document.getElementById("stepTitle");
const progressFill = document.getElementById("progressFill");

const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");

const miniCards = document.querySelectorAll(".mini-card");

const moduleQuestions = document.getElementById("moduleQuestions");
const reviewBox = document.getElementById("reviewBox");

const userPronouns = document.getElementById("userPronouns");
const customPronounsField = document.getElementById("customPronounsField");

// =====================================================
// ELEMENTOS DE FEEDBACK E MODAL
// Se algum deles não existir no HTML, o JS não pode quebrar.
// =====================================================

const formMessage = document.getElementById("formMessage");

const successModal = document.getElementById("successModal");
const reviewSetupBtn = document.getElementById("reviewSetupBtn");
const closeSuccessModalBtn = document.getElementById("closeSuccessModalBtn");
// =====================================================
// 2. ESTADO PRINCIPAL DO SETUP
// Aqui ficam os dados preenchidos pelo usuário
// =====================================================

let currentStep = 1;
const totalSteps = 4;
let isFinishingSetup = false;

const setupData = {
  user: {
    name: "",
    nickname: "",
    sexAtBirth: "",
    pronouns: "",
    customPronouns: "",
    age: "",
    communicationTone: ""
  },

  modules: {
    timeline: true,
    tasks: false,
    habits: false,
    sleep: false,
    water: false,
    finances: false,
    diary: false,
    nutrition: false,
    physicalHealth: false,
    menstrualCycle: false,
    attachments: false
  },

  preferences: {}
};


// =====================================================
// 3. NOMES VISUAIS DOS MÓDULOS
// Usados na revisão final
// =====================================================

const moduleLabels = {
  timeline: "Timeline",
  tasks: "Tarefas",
  habits: "Hábitos",
  sleep: "Sono",
  water: "Água",
  finances: "Finanças",
  diary: "Diário emocional",
  nutrition: "Alimentação",
  physicalHealth: "Saúde física",
  menstrualCycle: "Ciclo menstrual",
  attachments: "Anexos"
};

// =====================================================
// FEEDBACK VISUAL
// Mostra mensagens elegantes sem quebrar se o elemento faltar.
// =====================================================

function showFormMessage(message, type = "error") {
  if (!formMessage) {
    alert(message);
    return;
  }

  formMessage.textContent = message;
  formMessage.className = `form-message show ${type}`;
}

function clearFormMessage() {
  if (!formMessage) {
    return;
  }

  formMessage.textContent = "";
  formMessage.className = "form-message";
}


// =====================================================
// LIMPAR / MARCAR CAMPOS INVÁLIDOS
// =====================================================

function clearInvalidFields() {
  document.querySelectorAll(".invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}

function markInvalidField(field) {
  if (field) {
    field.classList.add("invalid");
  }
}


// =====================================================
// VALIDAÇÃO DA ETAPA 1
// Impede avançar sem dados principais
// =====================================================

function validateStep1() {
  clearInvalidFields();
  clearFormMessage();

  const nameField = document.getElementById("userName");
  const nicknameField = document.getElementById("userNickname");
  const sexField = document.getElementById("sexAtBirth");
  const pronounsField = document.getElementById("userPronouns");
  const customPronounsInput = document.getElementById("customPronouns");
  const ageField = document.getElementById("userAge");
  const toneField = document.getElementById("communicationTone");

  let firstInvalidField = null;

  if (!nameField.value.trim()) {
    markInvalidField(nameField);
    firstInvalidField = firstInvalidField || nameField;
  }

  if (!nicknameField.value.trim()) {
    markInvalidField(nicknameField);
    firstInvalidField = firstInvalidField || nicknameField;
  }

  if (!sexField.value) {
    markInvalidField(sexField);
    firstInvalidField = firstInvalidField || sexField;
  }

  if (!pronounsField.value) {
    markInvalidField(pronounsField);
    firstInvalidField = firstInvalidField || pronounsField;
  }

  if (pronounsField.value === "personalizado" && !customPronounsInput.value.trim()) {
    markInvalidField(customPronounsInput);
    firstInvalidField = firstInvalidField || customPronounsInput;
  }

  // Validação da idade
// Aceita apenas entre 13 e 120 anos
const ageValue = Number(ageField.value);

if (!ageField.value || ageValue < 13 || ageValue > 120) {
  markInvalidField(ageField);
  firstInvalidField = firstInvalidField || ageField;
}

  if (!toneField.value) {
    markInvalidField(toneField);
    firstInvalidField = firstInvalidField || toneField;
  }

  if (firstInvalidField) {
    showFormMessage("Preencha os campos principais corretamente. A idade deve estar entre 13 e 120 anos.");
    firstInvalidField.focus();
    return false;
  }

  return true;
}


// =====================================================
// VALIDAÇÃO DA ETAPA 2
// Exige pelo menos 1 funcionalidade além da Timeline
// =====================================================

function validateStep2() {
  clearFormMessage();

  const selectedModules = Array.from(
    document.querySelectorAll('.module-option input:checked:not([disabled])')
  );

  if (selectedModules.length === 0) {
    showFormMessage("Escolha pelo menos uma funcionalidade para continuar.");
    return false;
  }

  return true;
}

// =====================================================
// 4. TÍTULOS DAS ETAPAS
// =====================================================

const stepTitles = {
  1: "Sobre você",
  2: "Funcionalidades",
  3: "Preferências",
  4: "Revisão final"
};


// =====================================================
// 5. TEMA CLARO / ESCURO
// Agora o setup apenas aplica o tema salvo.
// A troca principal de tema fica em settings.html.
// =====================================================

function applySavedTheme() {
  const savedTheme = localStorage.getItem("fluir-theme");

  if (savedTheme === "dark") {
    body.classList.add("dark");

    if (themeBtn) {
      themeBtn.innerHTML = "<span>☼</span> Claro";
    }
  } else {
    body.classList.remove("dark");

    if (themeBtn) {
      themeBtn.innerHTML = "<span>☾</span> Escuro";
    }
  }
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    const isDarkMode = body.classList.contains("dark");

    themeBtn.innerHTML = isDarkMode
      ? "<span>☼</span> Claro"
      : "<span>☾</span> Escuro";

    localStorage.setItem("fluir-theme", isDarkMode ? "dark" : "light");
  });
}

window.addEventListener("load", () => {
  applySavedTheme();
});


// =====================================================
// MOSTRAR CAMPO DE PRONOME PERSONALIZADO
// Só roda se os elementos realmente existirem no HTML.
// =====================================================

if (userPronouns && customPronounsField) {
  userPronouns.addEventListener("change", () => {
    const selectedPronoun = userPronouns.value;
    const customPronounsInput = document.getElementById("customPronouns");

    if (selectedPronoun === "personalizado") {
      customPronounsField.classList.add("active");
    } else {
      customPronounsField.classList.remove("active");

      if (customPronounsInput) {
        customPronounsInput.value = "";
      }
    }
  });
}


// =====================================================
// 7. ATUALIZAR VISUAL DOS MÓDULOS SELECIONADOS
// Quando marca um checkbox, o card ganha destaque
// =====================================================

function updateModuleCardsVisual() {
  const moduleOptions = document.querySelectorAll(".module-option");

  moduleOptions.forEach((option) => {
    const checkbox = option.querySelector("input");

    if (checkbox && checkbox.checked) {
      option.classList.add("selected");
    } else {
      option.classList.remove("selected");
    }
  });
}

document.querySelectorAll(".module-option input").forEach((checkbox) => {
  checkbox.addEventListener("change", updateModuleCardsVisual);
});

updateModuleCardsVisual();


// =====================================================
// 8. ATUALIZAR ETAPA VISUAL
// Mostra etapa atual, progresso, botão voltar e texto do botão
// =====================================================

function updateStepView() {
  setupSteps.forEach((step) => {
    const stepNumber = Number(step.dataset.step);

    if (stepNumber === currentStep) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });

  stepLabel.textContent = `Etapa ${currentStep} de ${totalSteps}`;
  stepTitle.textContent = stepTitles[currentStep];

  const progressPercentage = (currentStep / totalSteps) * 100;
  progressFill.style.width = `${progressPercentage}%`;

  backBtn.disabled = currentStep === 1;

  if (currentStep === totalSteps) {
    nextBtn.textContent = "Finalizar";
  } else {
    nextBtn.textContent = "Continuar";
  }

  updateMiniCards();
}


// =====================================================
// 9. ATUALIZAR MINI CARDS DA ESQUERDA
// Como existem 3 mini cards e 4 etapas, a revisão mantém o 3 ativo
// =====================================================

function updateMiniCards() {
  miniCards.forEach((card) => {
    card.classList.remove("active");
  });

  if (currentStep === 1) {
    document.querySelector('[data-mini-step="1"]').classList.add("active");
  }

  if (currentStep === 2) {
    document.querySelector('[data-mini-step="2"]').classList.add("active");
  }

  if (currentStep === 3 || currentStep === 4) {
    document.querySelector('[data-mini-step="3"]').classList.add("active");
  }
}


// =====================================================
// 10. COLETAR DADOS DA ETAPA 1
// =====================================================

function collectUserData() {
  setupData.user.name = document.getElementById("userName").value.trim();
  setupData.user.nickname = document.getElementById("userNickname").value.trim();
  setupData.user.sexAtBirth = document.getElementById("sexAtBirth").value;
  setupData.user.pronouns = document.getElementById("userPronouns").value;
  setupData.user.customPronouns = document.getElementById("customPronouns").value.trim();
  setupData.user.age = document.getElementById("userAge").value;
  setupData.user.communicationTone = document.getElementById("communicationTone").value;
}


// =====================================================
// 11. COLETAR FUNCIONALIDADES ESCOLHIDAS
// =====================================================

function collectSelectedModules() {
  Object.keys(setupData.modules).forEach((moduleKey) => {
    setupData.modules[moduleKey] = moduleKey === "timeline";
  });

  const selectedCheckboxes = document.querySelectorAll(".module-option input:checked");

  selectedCheckboxes.forEach((checkbox) => {
    const moduleName = checkbox.value;

    if (moduleName && setupData.modules.hasOwnProperty(moduleName)) {
      setupData.modules[moduleName] = true;
    }
  });
}


// =====================================================
// 12. PEGAR LISTA DE MÓDULOS ATIVOS
// =====================================================

function getActiveModules() {
  return Object.keys(setupData.modules).filter((moduleKey) => {
    return setupData.modules[moduleKey] === true;
  });
}


// =====================================================
// 13. GERAR PERGUNTAS DA ETAPA 3
// Essa função cria perguntas de acordo com os módulos escolhidos
// =====================================================

function generateModuleQuestions() {
  collectUserData();
  collectSelectedModules();

  moduleQuestions.innerHTML = "";

  const activeModules = getActiveModules().filter((moduleKey) => {
    return moduleKey !== "timeline";
  });

  if (activeModules.length === 0) {
    moduleQuestions.innerHTML = `
      <div class="soft-note">
        Você deixou apenas a Timeline ativa. Tudo bem — ela será usada para registrar os eventos principais.
        Se quiser, volte e escolha mais funcionalidades para personalizar melhor o seu dashboard.
      </div>
    `;

    return;
  }

  activeModules.forEach((moduleKey) => {
    if (moduleKey === "tasks") {
      moduleQuestions.innerHTML += createTasksQuestions();
    }

    if (moduleKey === "habits") {
      moduleQuestions.innerHTML += createHabitsQuestions();
    }

    if (moduleKey === "sleep") {
      moduleQuestions.innerHTML += createSleepQuestions();
    }

    if (moduleKey === "water") {
      moduleQuestions.innerHTML += createWaterQuestions();
    }

    if (moduleKey === "finances") {
      moduleQuestions.innerHTML += createFinancesQuestions();
    }

    if (moduleKey === "diary") {
      moduleQuestions.innerHTML += createDiaryQuestions();
    }

    if (moduleKey === "nutrition") {
      moduleQuestions.innerHTML += createNutritionQuestions();
    }

    if (moduleKey === "physicalHealth") {
      moduleQuestions.innerHTML += createPhysicalHealthQuestions();
    }

    if (moduleKey === "menstrualCycle") {
      moduleQuestions.innerHTML += createMenstrualCycleQuestions();
    }

    if (moduleKey === "attachments") {
      moduleQuestions.innerHTML += createAttachmentsQuestions();
    }
  });
}


// =====================================================
// 14. PERGUNTAS — TAREFAS
// =====================================================

function createTasksQuestions() {
  return `
    <div class="question-block" data-module="tasks">
      <h4>Tarefas</h4>
      <p class="question-block-description">
        Vamos ajustar como você quer organizar pendências, prioridades e lembretes.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Como prefere visualizar suas tarefas?</span>
          <select data-pref="tasks.preferredView">
            <option value="">Selecione</option>
            <option value="hoje">Hoje</option>
            <option value="semana">Semana</option>
            <option value="prioridade">Prioridade</option>
            <option value="projeto">Projeto</option>
          </select>
        </label>

        <label class="field">
          <span>Quer receber lembretes?</span>
          <select data-pref="tasks.reminders">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="talvez">Talvez depois</option>
          </select>
        </label>

        <div class="field question-full">
          <span>Categorias de tarefas</span>

          <div class="checkbox-list">
            ${createChoicePill("tasks.categories", "Trabalho")}
            ${createChoicePill("tasks.categories", "Estudos")}
            ${createChoicePill("tasks.categories", "Casa")}
            ${createChoicePill("tasks.categories", "Pessoal")}
            ${createChoicePill("tasks.categories", "Saúde")}
            ${createChoicePill("tasks.categories", "Projetos")}
          </div>
        </div>
      </div>
    </div>
  `;
}


// =====================================================
// 15. PERGUNTAS — HÁBITOS
// =====================================================

function createHabitsQuestions() {
  return `
    <div class="question-block" data-module="habits">
      <h4>Hábitos</h4>
      <p class="question-block-description">
        Escolha hábitos que você quer acompanhar com constância.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Como prefere acompanhar?</span>
          <select data-pref="habits.trackingType">
            <option value="">Selecione</option>
            <option value="sequencia">Por sequência</option>
            <option value="porcentagem">Por porcentagem</option>
            <option value="ambos">Sequência e porcentagem</option>
          </select>
        </label>

        <label class="field">
          <span>Meta semanal geral</span>
          <select data-pref="habits.weeklyGoal">
            <option value="">Selecione</option>
            <option value="3">3 vezes por semana</option>
            <option value="5">5 vezes por semana</option>
            <option value="7">Todos os dias</option>
            <option value="personalizado">Personalizado depois</option>
          </select>
        </label>

        <div class="field question-full">
          <span>Hábitos que deseja acompanhar</span>

          <div class="checkbox-list">
            ${createChoicePill("habits.selectedHabits", "Beber água")}
            ${createChoicePill("habits.selectedHabits", "Meditar")}
            ${createChoicePill("habits.selectedHabits", "Treinar")}
            ${createChoicePill("habits.selectedHabits", "Ler")}
            ${createChoicePill("habits.selectedHabits", "Dormir cedo")}
            ${createChoicePill("habits.selectedHabits", "Estudar")}
            ${createChoicePill("habits.selectedHabits", "Organizar o quarto")}
          </div>
        </div>
      </div>
    </div>
  `;
}


// =====================================================
// 16. PERGUNTAS — SONO
// =====================================================

function createSleepQuestions() {
  return `
    <div class="question-block" data-module="sleep">
      <h4>Sono</h4>
      <p class="question-block-description">
        Defina sua meta de sono e como deseja acompanhar sua rotina noturna.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Meta de sono por noite</span>
          <input type="text" data-pref="sleep.sleepGoal" placeholder="Ex: 7h30" />
        </label>

        <label class="field">
          <span>Horário em que costuma dormir</span>
          <input type="time" data-pref="sleep.usualSleepTime" />
        </label>

        <label class="field">
          <span>Horário em que costuma acordar</span>
          <input type="time" data-pref="sleep.usualWakeTime" />
        </label>

        <label class="field">
          <span>Quer registrar qualidade do sono?</span>
          <select data-pref="sleep.trackQuality">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </label>

        <label class="field">
          <span>Você tem dificuldade para dormir?</span>
          <select data-pref="sleep.sleepDifficulty">
            <option value="">Selecione</option>
            <option value="frequentemente">Frequentemente</option>
            <option value="as-vezes">Às vezes</option>
            <option value="raramente">Raramente</option>
            <option value="nao">Não</option>
          </select>
        </label>

        <label class="field">
          <span>Quer lembrete para dormir?</span>
          <select data-pref="sleep.sleepReminder">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="talvez">Talvez depois</option>
          </select>
        </label>
      </div>
    </div>
  `;
}


// =====================================================
// 17. PERGUNTAS — ÁGUA
// =====================================================

function createWaterQuestions() {
  return `
    <div class="question-block" data-module="water">
      <h4>Água</h4>
      <p class="question-block-description">
        Configure sua meta diária de hidratação.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Meta diária de água</span>
          <input type="text" data-pref="water.dailyGoal" placeholder="Ex: 2 litros" />
        </label>

        <label class="field">
  <span>Como você prefere registrar?</span>

  <select data-pref="water.unit">
    <option value="ml" selected>Mililitros</option>
    <option value="litros">Litros</option>
    <option value="copos">Copos, futuramente</option>
    <option value="garrafas">Garrafas, futuramente</option>
  </select>
</label>

        <label class="field">
          <span>Quer lembretes?</span>
          <select data-pref="water.reminders">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="talvez">Talvez depois</option>
          </select>
        </label>

        <label class="field">
          <span>Frequência do lembrete</span>
          <select data-pref="water.reminderFrequency">
            <option value="">Selecione</option>
            <option value="1h">A cada 1 hora</option>
            <option value="2h">A cada 2 horas</option>
            <option value="3h">A cada 3 horas</option>
            <option value="personalizado">Personalizar depois</option>
          </select>
        </label>
      </div>
    </div>
  `;
}


// =====================================================
// 18. PERGUNTAS — FINANÇAS
// =====================================================

function createFinancesQuestions() {
  return `
    <div class="question-block" data-module="finances">
      <h4>Finanças</h4>
      <p class="question-block-description">
        Informe dados básicos para organizar renda, gastos, dívidas e metas.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Renda mensal aproximada</span>
          <input type="number" data-pref="finances.monthlyIncome" placeholder="Ex: 2500" />
        </label>

        <label class="field">
          <span>Você quer controlar gastos?</span>
          <select data-pref="finances.trackExpenses">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </label>

        <label class="field">
          <span>Você quer controlar dívidas?</span>
          <select data-pref="finances.trackDebts">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </label>

        <label class="field">
          <span>Meta financeira principal</span>
          <input type="text" data-pref="finances.financialGoal" placeholder="Ex: juntar dinheiro, quitar dívidas..." />
        </label>

        <div class="field question-full">
          <span>Categorias financeiras</span>

          <div class="checkbox-list">
            ${createChoicePill("finances.categories", "Alimentação")}
            ${createChoicePill("finances.categories", "Transporte")}
            ${createChoicePill("finances.categories", "Casa")}
            ${createChoicePill("finances.categories", "Lazer")}
            ${createChoicePill("finances.categories", "Saúde")}
            ${createChoicePill("finances.categories", "Estudos")}
            ${createChoicePill("finances.categories", "Dívidas")}
            ${createChoicePill("finances.categories", "Investimentos")}
          </div>
        </div>
      </div>
    </div>
  `;
}


// =====================================================
// 19. PERGUNTAS — DIÁRIO EMOCIONAL
// =====================================================

function createDiaryQuestions() {
  return `
    <div class="question-block" data-module="diary">
      <h4>Diário emocional</h4>
      <p class="question-block-description">
        Configure como deseja registrar pensamentos, sentimentos e humor.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Com que frequência quer escrever?</span>
          <select data-pref="diary.frequency">
            <option value="">Selecione</option>
            <option value="todos-os-dias">Todos os dias</option>
            <option value="algumas-vezes">Algumas vezes por semana</option>
            <option value="quando-eu-quiser">Só quando eu quiser</option>
          </select>
        </label>

        <label class="field">
          <span>Quer registrar humor?</span>
          <select data-pref="diary.trackMood">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </label>

        <label class="field">
          <span>Quer perguntas reflexivas?</span>
          <select data-pref="diary.dailyPrompt">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="talvez">Talvez depois</option>
          </select>
        </label>

        <label class="field">
          <span>Quer acompanhar ansiedade/estresse?</span>
          <select data-pref="diary.trackStress">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="talvez">Talvez depois</option>
          </select>
        </label>
      </div>
    </div>
  `;
}


// =====================================================
// 20. PERGUNTAS — ALIMENTAÇÃO
// =====================================================

function createNutritionQuestions() {
  return `
    <div class="question-block" data-module="nutrition">
      <h4>Alimentação</h4>
      <p class="question-block-description">
        Essas informações ajudam a montar uma área alimentar mais útil para sua rotina.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Altura</span>
          <input type="text" data-pref="nutrition.height" placeholder="Ex: 1,70m" />
        </label>

        <label class="field">
          <span>Peso atual</span>
          <input type="text" data-pref="nutrition.weight" placeholder="Ex: 65kg" />
        </label>

        <label class="field">
          <span>Objetivo alimentar</span>
          <select data-pref="nutrition.goal">
            <option value="">Selecione</option>
            <option value="melhorar-alimentacao">Melhorar alimentação</option>
            <option value="ganhar-massa">Ganhar massa</option>
            <option value="perder-peso">Perder peso</option>
            <option value="manter-peso">Manter peso</option>
            <option value="mais-energia">Ter mais energia</option>
            <option value="organizar-refeicoes">Organizar refeições</option>
          </select>
        </label>

        <label class="field">
          <span>Refeições por dia</span>
          <select data-pref="nutrition.mealsPerDay">
            <option value="">Selecione</option>
            <option value="2">2 refeições</option>
            <option value="3">3 refeições</option>
            <option value="4">4 refeições</option>
            <option value="5">5 refeições</option>
            <option value="6">6 ou mais</option>
          </select>
        </label>

        <label class="field question-full">
          <span>Restrições ou observações alimentares</span>
          <textarea data-pref="nutrition.restrictions" placeholder="Ex: lactose, glúten, vegetariano, alergias..."></textarea>
        </label>
      </div>
    </div>
  `;
}


// =====================================================
// 21. PERGUNTAS — SAÚDE FÍSICA
// =====================================================

function createPhysicalHealthQuestions() {
  return `
    <div class="question-block" data-module="physicalHealth">
      <h4>Saúde física</h4>
      <p class="question-block-description">
        Configure acompanhamento de treinos, dores, disposição e evolução.
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Você pratica atividade física?</span>
          <select data-pref="physicalHealth.exercises">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="quero-comecar">Quero começar</option>
          </select>
        </label>

        <label class="field">
          <span>Frequência semanal</span>
          <select data-pref="physicalHealth.weeklyFrequency">
            <option value="">Selecione</option>
            <option value="1-2">1 a 2 vezes</option>
            <option value="3-4">3 a 4 vezes</option>
            <option value="5+">5 ou mais vezes</option>
            <option value="ainda-nao-sei">Ainda não sei</option>
          </select>
        </label>

        <label class="field">
          <span>Tipo principal de treino</span>
          <select data-pref="physicalHealth.trainingType">
            <option value="">Selecione</option>
            <option value="musculacao">Musculação</option>
            <option value="cardio">Cardio</option>
            <option value="corrida">Corrida</option>
            <option value="caminhada">Caminhada</option>
            <option value="alongamento">Alongamento</option>
            <option value="outro">Outro</option>
          </select>
        </label>

        <label class="field">
          <span>Quer registrar dores ou disposição?</span>
          <select data-pref="physicalHealth.trackPainEnergy">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="talvez">Talvez depois</option>
          </select>
        </label>

        <label class="field question-full">
          <span>Limitações físicas ou observações</span>
          <textarea data-pref="physicalHealth.limitations" placeholder="Ex: dor no joelho, lesão, restrição médica..."></textarea>
        </label>
      </div>
    </div>
  `;
}


// =====================================================
// 22. PERGUNTAS — CICLO MENSTRUAL
// =====================================================

function createMenstrualCycleQuestions() {
  const sexAtBirth = setupData.user.sexAtBirth;

  let introText = `
    Configure acompanhamento de menstruação, sintomas e saúde reprodutiva.
    Você pode pular qualquer pergunta que não quiser responder.
  `;

  if (sexAtBirth === "masculino") {
    introText = `
      Você selecionou sexo atribuído ao nascer masculino. 
      Ainda assim, deixamos esta área disponível caso você queira registrar informações relacionadas à saúde reprodutiva ou acompanhar alguém.
    `;
  }

  if (sexAtBirth === "prefiro-nao-informar" || sexAtBirth === "") {
    introText = `
      Como você preferiu não informar ou ainda não informou o sexo atribuído ao nascer,
      esta área será configurada de forma opcional e respeitosa.
    `;
  }

  return `
    <div class="question-block" data-module="menstrualCycle">
      <h4>Ciclo menstrual</h4>

      <p class="question-block-description">
        ${introText}
      </p>

      <div class="question-grid">
        <label class="field">
          <span>Você ainda menstrua?</span>
          <select data-pref="menstrualCycle.currentlyMenstruates">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="as-vezes">Às vezes / irregular</option>
            <option value="prefiro-nao-responder">Prefiro não responder</option>
          </select>
        </label>

        <label class="field">
          <span>Seu ciclo costuma ser regular?</span>
          <select data-pref="menstrualCycle.regularCycle">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="nao-sei">Não sei</option>
            <option value="prefiro-nao-responder">Prefiro não responder</option>
          </select>
        </label>

        <label class="field">
          <span>Data da última menstruação</span>
          <input type="date" data-pref="menstrualCycle.lastPeriodDate" />
        </label>

        <label class="field">
          <span>Duração média do ciclo</span>
          <input type="text" data-pref="menstrualCycle.cycleLength" placeholder="Ex: 28 dias" />
        </label>

        <label class="field">
          <span>Duração média do sangramento</span>
          <input type="text" data-pref="menstrualCycle.bleedingLength" placeholder="Ex: 5 dias" />
        </label>

        <label class="field">
          <span>Você sente cólicas?</span>
          <select data-pref="menstrualCycle.cramps">
            <option value="">Selecione</option>
            <option value="fortes">Fortes</option>
            <option value="moderadas">Moderadas</option>
            <option value="leves">Leves</option>
            <option value="nao">Não</option>
          </select>
        </label>

        <label class="field">
          <span>Está grávida atualmente?</span>
          <select data-pref="menstrualCycle.pregnant">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="nao-sei">Não sei</option>
            <option value="prefiro-nao-responder">Prefiro não responder</option>
          </select>
        </label>

        <label class="field">
          <span>Está amamentando?</span>
          <select data-pref="menstrualCycle.breastfeeding">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="prefiro-nao-responder">Prefiro não responder</option>
          </select>
        </label>

        <label class="field">
          <span>Usa método hormonal?</span>
          <select data-pref="menstrualCycle.hormonalMethod">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="prefiro-nao-responder">Prefiro não responder</option>
          </select>
        </label>

        <label class="field">
          <span>Quer receber previsões e lembretes?</span>
          <select data-pref="menstrualCycle.reminders">
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="talvez">Talvez depois</option>
          </select>
        </label>

        <div class="field question-full">
          <span>Sintomas que deseja acompanhar</span>

          <div class="checkbox-list">
            ${createChoicePill("menstrualCycle.symptoms", "Cólicas")}
            ${createChoicePill("menstrualCycle.symptoms", "Dor de cabeça")}
            ${createChoicePill("menstrualCycle.symptoms", "Inchaço")}
            ${createChoicePill("menstrualCycle.symptoms", "Alteração de humor")}
            ${createChoicePill("menstrualCycle.symptoms", "Cansaço")}
            ${createChoicePill("menstrualCycle.symptoms", "Acne")}
            ${createChoicePill("menstrualCycle.symptoms", "Desejos alimentares")}
          </div>
        </div>
      </div>
    </div>
  `;
}


// =====================================================
// 23. PERGUNTAS — ANEXOS
// =====================================================

function createAttachmentsQuestions() {
  return `
    <div class="question-block" data-module="attachments">
      <h4>Anexos</h4>
      <p class="question-block-description">
        Escolha que tipos de arquivos pretende guardar no Fluir.
      </p>

      <div class="question-grid">
        <div class="field question-full">
          <span>Tipos de arquivo</span>

          <div class="checkbox-list">
            ${createChoicePill("attachments.fileTypes", "PDFs")}
            ${createChoicePill("attachments.fileTypes", "Imagens")}
            ${createChoicePill("attachments.fileTypes", "Comprovantes")}
            ${createChoicePill("attachments.fileTypes", "Documentos pessoais")}
            ${createChoicePill("attachments.fileTypes", "Relatórios")}
            ${createChoicePill("attachments.fileTypes", "Arquivos de estudo")}
          </div>
        </div>

        <div class="field question-full">
          <span>Deseja vincular anexos com quais áreas?</span>

          <div class="checkbox-list">
            ${createChoicePill("attachments.linkToModules", "Tarefas")}
            ${createChoicePill("attachments.linkToModules", "Finanças")}
            ${createChoicePill("attachments.linkToModules", "Diário")}
            ${createChoicePill("attachments.linkToModules", "Saúde")}
            ${createChoicePill("attachments.linkToModules", "Alimentação")}
          </div>
        </div>
      </div>
    </div>
  `;
}


// =====================================================
// 24. CRIAR CHECKBOX PILL
// Função auxiliar para montar opções clicáveis
// =====================================================

function createChoicePill(prefKey, label) {
  return `
    <label class="choice-pill">
      <input type="checkbox" data-pref-array="${prefKey}" value="${label}">
      ${label}
    </label>
  `;
}


// =====================================================
// 25. COLETAR PREFERÊNCIAS DA ETAPA 3
// Lê todos os inputs/selects/textarea gerados dinamicamente
// =====================================================

function collectPreferences() {
  setupData.preferences = {};

  const simpleFields = document.querySelectorAll("[data-pref]");

  simpleFields.forEach((field) => {
    const path = field.dataset.pref;
    const value = field.value;

    setNestedValue(setupData.preferences, path, value);
  });

  const arrayFields = document.querySelectorAll("[data-pref-array]");

  arrayFields.forEach((checkbox) => {
    const path = checkbox.dataset.prefArray;

    if (!getNestedValue(setupData.preferences, path)) {
      setNestedValue(setupData.preferences, path, []);
    }

    if (checkbox.checked) {
      const currentArray = getNestedValue(setupData.preferences, path);
      currentArray.push(checkbox.value);
      setNestedValue(setupData.preferences, path, currentArray);
    }
  });
}


// =====================================================
// 26. FUNÇÕES PARA SALVAR VALORES ANINHADOS
// Exemplo: sleep.sleepGoal dentro de preferences
// =====================================================

function setNestedValue(object, path, value) {
  const keys = path.split(".");
  let current = object;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      if (!current[key]) {
        current[key] = {};
      }

      current = current[key];
    }
  });
}

function getNestedValue(object, path) {
  const keys = path.split(".");
  let current = object;

  for (const key of keys) {
    if (!current || !current.hasOwnProperty(key)) {
      return undefined;
    }

    current = current[key];
  }

  return current;
}


// =====================================================
// 27. GERAR REVISÃO FINAL
// =====================================================

function generateReview() {
  collectUserData();
  collectSelectedModules();
  collectPreferences();

  const activeModules = getActiveModules();

  const displayName = setupData.user.nickname || setupData.user.name || "Você";

  const pronounsText = setupData.user.pronouns === "personalizado"
    ? setupData.user.customPronouns || "Personalizado"
    : setupData.user.pronouns || "Não informado";

  reviewBox.innerHTML = `
    <div class="review-section">
      <h4>Sobre você</h4>
      <p>
        Nome: <strong>${setupData.user.name || "Não informado"}</strong><br>
        Como quer ser chamado(a): <strong>${displayName}</strong><br>
        Sexo atribuído ao nascer: <strong>${formatText(setupData.user.sexAtBirth)}</strong><br>
        Pronomes: <strong>${formatText(pronounsText)}</strong><br>
        Idade: <strong>${setupData.user.age || "Não informada"}</strong><br>
        Comunicação: <strong>${formatText(setupData.user.communicationTone)}</strong>
      </p>
    </div>

    <div class="review-section">
      <h4>Funcionalidades ativadas</h4>
      <p>Essas áreas aparecerão no seu dashboard inicial.</p>

      <div class="review-list">
        ${activeModules.map((moduleKey) => {
          return `<span>${moduleLabels[moduleKey]}</span>`;
        }).join("")}
      </div>
    </div>

    <div class="review-section">
      <h4>Preferências configuradas</h4>
      <p>
        Suas respostas foram salvas localmente por enquanto. 
        Depois conectaremos isso ao backend Spring Boot do Fluir.
      </p>
    </div>
  `;
}


// =====================================================
// 28. FORMATAR TEXTO PARA EXIBIÇÃO
// =====================================================

function formatText(value) {
  if (!value) {
    return "Não informado";
  }

  return String(value)
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}


// =====================================================
// 29. AVANÇAR ETAPA
// =====================================================
nextBtn.addEventListener("click", () => {
  clearFormMessage();

  if (currentStep === 1) {
    if (!validateStep1()) {
      return;
    }

    collectUserData();
  }

  if (currentStep === 2) {
    if (!validateStep2()) {
      return;
    }

    collectSelectedModules();
    generateModuleQuestions();
  }

  if (currentStep === 3) {
    collectPreferences();
    generateReview();
  }

  if (currentStep < totalSteps) {
    currentStep++;
    updateStepView();
    return;
  }

  finishSetup();
});


// =====================================================
// 30. VOLTAR ETAPA
// =====================================================

backBtn.addEventListener("click", () => {
  clearFormMessage();
  clearInvalidFields();

  if (currentStep > 1) {
    currentStep--;
    updateStepView();
  }
});


// =====================================================
// 31. FINALIZAR SETUP
// Salva a configuração no localStorage
// Futuramente, aqui conectaremos com backend
// =====================================================

async function finishSetup() {
  let setupSaved = false;

  if (isFinishingSetup) {
    return;
  }

  isFinishingSetup = true;
  nextBtn.disabled = true;
  nextBtn.textContent = "Salvando...";

  collectUserData();
  collectSelectedModules();
  collectPreferences();

  clearFormMessage();

  try {
    const usuarioSalvo = sessionStorage.getItem("fluir-user");

    if (!usuarioSalvo) {
      showFormMessage("Sua sessão expirou. Faça login novamente.");
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    const pronomes =
      setupData.user.pronouns === "personalizado"
        ? setupData.user.customPronouns
        : setupData.user.pronouns;

    const payload = {
      usuarioId: usuario.id,
      nome: setupData.user.name,
      apelido: setupData.user.nickname,
      pronomes: pronomes,
      generoNascimento: setupData.user.sexAtBirth,
      modulos: setupData.modules
    };

    const response = await fetch(
      "https://fluir-sistema.onrender.com/api/onboarding/salvar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const text = await response.text();

    let data = {};

    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }

    if (!response.ok) {
      showFormMessage(
        data.mensagem || text || "Não foi possível salvar sua configuração."
      );
      return;
    }

    setupData.onboardingConcluido = true;
    setupData.atualizadoEm = new Date().toISOString();

    // Mantemos localmente porque outras telas ainda dependem disso.
    localStorage.setItem("fluir-setup", JSON.stringify(setupData));

    seedExampleContent();

    setupSaved = true;

    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Erro ao salvar onboarding:", error);

    showFormMessage(
      "Não foi possível salvar sua configuração. Tente novamente."
    );
  } finally {
    if (!setupSaved) {
      isFinishingSetup = false;
      nextBtn.disabled = false;
      nextBtn.textContent = "Finalizar";
    }
  }
}

// =====================================================
// 31.1 CRIAR EXEMPLOS PARA ENSINAR A USAR O SISTEMA
// Só cria se o módulo correspondente foi selecionado,
// e só na primeira vez (não duplica se já existir algo).
// =====================================================

function getTodayKeyForSeed() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function seedExampleContent() {
  if (setupData.modules.tasks) {
    const existingTasks = JSON.parse(localStorage.getItem("fluir-tasks") || "[]");

    if (existingTasks.length === 0) {
      const exampleTask = {
        id: Date.now(),
        title: "Toque aqui para concluir sua primeira tarefa",
        description: "Essa é só um exemplo — pode apagar quando quiser.",
        category: "Pessoal",
        priority: "medium",
        time: "",
        completed: false,
        date: getTodayKeyForSeed(),
        createdAt: new Date().toISOString()
      };

      existingTasks.unshift(exampleTask);
      localStorage.setItem("fluir-tasks", JSON.stringify(existingTasks));
    }
  }

  if (setupData.modules.habits) {
    const existingHabits = JSON.parse(localStorage.getItem("fluir-habits") || "[]");

    if (existingHabits.length === 0) {
      const exampleHabit = {
        id: Date.now() + 1,
        title: "Beber um copo de água",
        description: "Marque quando completar — esse hábito é só um exemplo.",
        category: "Saúde",
        weeklyGoal: 7,
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        streak: 0,
        completedDates: [],
        createdAt: new Date().toISOString()
      };

      existingHabits.unshift(exampleHabit);
      localStorage.setItem("fluir-habits", JSON.stringify(existingHabits));
    }
  }
}


// =====================================================
// 32. INICIALIZAR TELA
// =====================================================

updateStepView();

// =====================================================
// MODAL DE SUCESSO
// Versão segura: só funciona se o modal existir no HTML.
// =====================================================

function openSuccessModal() {
  if (!successModal) {
    alert("Configuração inicial salva! Depois vamos levar você para o dashboard.");
    return;
  }

  successModal.classList.add("active");
}

function closeSuccessModal() {
  if (!successModal) {
    return;
  }

  successModal.classList.remove("active");
}

if (reviewSetupBtn) {
  reviewSetupBtn.addEventListener("click", () => {
    closeSuccessModal();
    currentStep = 4;
    updateStepView();
  });
}

if (closeSuccessModalBtn) {
  closeSuccessModalBtn.addEventListener("click", () => {
    closeSuccessModal();
  });
}