/* =========================================================
   FLUIR - ONBOARDING EM ETAPAS
   Arquivo: onboarding.js

   Responsável por:
   - controlar as etapas do onboarding
   - validar os campos por etapa
   - atualizar badge e barra de progresso
   - montar o avatar/bonequinho em SVG
   - salvar o perfil completo no localStorage
========================================================= */

/* ========================================
   ELEMENTOS PRINCIPAIS DO ONBOARDING
======================================== */
const onboardingForm = document.getElementById("onboardingForm");
const onboardingMessage = document.getElementById("onboardingMessage");

const steps = document.querySelectorAll(".step");
const nextButtons = document.querySelectorAll(".next-step");
const prevButtons = document.querySelectorAll(".prev-step");

const stepBadge = document.getElementById("stepBadge");
const progressFill = document.getElementById("progressFill");

/* ========================================
   CAMPOS DA ETAPA 1 — IDENTIDADE
======================================== */
const fullNameInput = document.getElementById("fullName");
const userNameInput = document.getElementById("userName");
const userPronounInput = document.getElementById("userPronoun");

/* ========================================
   CAMPOS DA ETAPA 2 — CONTEXTO INICIAL
======================================== */
const mainFocusInput = document.getElementById("mainFocus");
const energyLevelInput = document.getElementById("energyLevel");

/* ========================================
   CAMPOS DA ETAPA 3 — TEMPO DISPONÍVEL
======================================== */
const availableTimeInput = document.getElementById("availableTime");

/* ========================================
   CAMPOS DA ETAPA 4 — PRIMEIRA TAREFA
======================================== */
const firstTaskInput = document.getElementById("firstTask");
const taskPeriodInput = document.getElementById("taskPeriod");

/* ========================================
   CAMPOS DA ETAPA 5 — AVATAR / BONEQUINHO
======================================== */
const avatarPreview = document.getElementById("avatarPreview");
const avatarChoiceButtons = document.querySelectorAll("[data-avatar-field]");
const avatarTabs = document.querySelectorAll(".avatar-tab");
const avatarPanels = document.querySelectorAll(".avatar-panel");
const randomAvatarBtn = document.getElementById("randomAvatarBtn");

/* ========================================
   CONTROLE DAS ABAS DO AVATAR
======================================== */
function switchAvatarTab(tabName) {
  avatarTabs.forEach((tab) => {
    const isActive = tab.getAttribute("data-tab") === tabName;
    tab.classList.toggle("active", isActive);
  });

  avatarPanels.forEach((panel) => {
    const isActive = panel.getAttribute("data-panel") === tabName;
    panel.classList.toggle("active", isActive);
  });
}

avatarTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const tabName = tab.getAttribute("data-tab");
    if (!tabName) return;
    switchAvatarTab(tabName);
  });
});

/* ========================================
   ESTADO DO ONBOARDING
======================================== */
let currentStep = 1;
const totalSteps = 5;

/* 
   Estado do avatar.
   Guardamos as escolhas para:
   - renderizar o preview
   - salvar no perfil
*/
let avatarState = {
  skin: "light",
  hair: "short",
  hairColor: "dark",
  eyeShape: "round",
  eyeColor: "darkBrown",
  noseShape: "short",
  noseColor: "soft",
  mouthShape: "smile",
  mouthColor: "softRose",
  shirt: "beige"
};

/* ========================================
   MENSAGENS
======================================== */
function showMessage(message, type = "error") {
  if (!onboardingMessage) return;

  onboardingMessage.textContent = message;
  onboardingMessage.className = `form-message show ${type}`;
}

function clearMessage() {
  if (!onboardingMessage) return;

  onboardingMessage.textContent = "";
  onboardingMessage.className = "form-message";
}

/* ========================================
   PRÉ-CARREGAR DADOS DO CADASTRO
   Se o usuário veio da tela de cadastro,
   puxamos o nome salvo temporariamente.
======================================== */
function preloadPendingUser() {
  const rawPendingUser = localStorage.getItem("fluir_pending_user");
  if (!rawPendingUser) return;

  try {
    const pendingUser = JSON.parse(rawPendingUser);

    if (pendingUser?.name && fullNameInput) {
      fullNameInput.value = pendingUser.name;
    }

    if (pendingUser?.name && userNameInput) {
      userNameInput.value = pendingUser.name;
    }
  } catch (error) {
    console.error("Erro ao carregar cadastro temporário:", error);
  }
}

/* ========================================
   CONTROLE DAS ETAPAS
======================================== */
function updateProgressUI() {
  if (stepBadge) {
    stepBadge.textContent = `Etapa ${currentStep} de ${totalSteps}`;
  }

  if (progressFill) {
    const percent = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${percent}%`;
  }
}

function showStep(stepNumber) {
  steps.forEach((step) => {
    const stepValue = Number(step.getAttribute("data-step"));
    step.classList.toggle("active", stepValue === stepNumber);
  });

  currentStep = stepNumber;
  updateProgressUI();
  clearMessage();
}

/* ========================================
   VALIDAÇÃO POR ETAPA
   Cada etapa valida apenas os campos dela.
======================================== */
function validateCurrentStep() {
  /* ETAPA 1 — IDENTIDADE */
  if (currentStep === 1) {
    const fullName = fullNameInput.value.trim();
    const userName = userNameInput.value.trim();
    const pronoun = userPronounInput.value;

    if (!fullName) {
      showMessage("Digite seu nome completo.");
      return false;
    }

    if (!userName) {
      showMessage("Digite como você quer ser chamado.");
      return false;
    }

    if (!pronoun) {
      showMessage("Selecione um pronome.");
      return false;
    }
  }

  /* ETAPA 2 — CONTEXTO INICIAL */
  if (currentStep === 2) {
    const focus = mainFocusInput.value;
    const energy = energyLevelInput.value;

    if (!focus) {
      showMessage("Selecione seu foco principal.");
      return false;
    }

    if (!energy) {
      showMessage("Selecione como está sua energia.");
      return false;
    }
  }

  /* ETAPA 3 — TEMPO DISPONÍVEL */
  if (currentStep === 3) {
    const availableTime = availableTimeInput.value;

    if (!availableTime) {
      showMessage("Selecione seu tempo disponível.");
      return false;
    }
  }

  /* ETAPA 4 — PRIMEIRA TAREFA */
  if (currentStep === 4) {
    const firstTask = firstTaskInput.value.trim();
    const taskPeriod = taskPeriodInput.value;

    if (!firstTask) {
      showMessage("Digite sua primeira atividade.");
      return false;
    }

    if (!taskPeriod) {
      showMessage("Selecione o período da atividade.");
      return false;
    }
  }

  return true;
}

/* ========================================
   NAVEGAÇÃO ENTRE ETAPAS
======================================== */
nextButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isValid = validateCurrentStep();
    if (!isValid) return;

    if (currentStep < totalSteps) {
      showStep(currentStep + 1);
    }
  });
});

prevButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  });
});

/* ========================================
   MAPA DE CORES DO AVATAR
   Tons inclusivos e mais opções de cabelo/roupa
======================================== */
function getAvatarColors() {
  const skinMap = {
    light: "#F7DCC4",
    lightMedium: "#E9B88F",
    medium: "#D39B6E",
    mediumDark: "#A56E4A",
    dark: "#7A4E34",
    veryDark: "#4E342E"
  };

  const hairMap = {
    dark: "#2F221D",
    brown: "#6B4332",
    lightBrown: "#8A5C42",
    blonde: "#D4A13D",
    ginger: "#B9653C"
  };

  const eyeMap = {
    darkBrown: "#3A241A",
    brown: "#6B4332",
    hazel: "#8E6B3E",
    green: "#5E7F5E",
    blue: "#5D7FA8"
  };

  const noseMap = {
    soft: "#B57F6B",
    medium: "#9B654E",
    deep: "#6F4638"
  };

  const mouthMap = {
    softRose: "#A56A63",
    rose: "#C07B73",
    brownRose: "#8E5D52",
    deep: "#6A4037"
  };

  const shirtMap = {
    beige: "#CDB09A",
    rose: "#D8A7A7",
    green: "#9FB59F",
    brown: "#A78674",
    blue: "#8FA8B7",
    lavender: "#B7A8C9"
  };

  return {
    skin: skinMap[avatarState.skin] || skinMap.medium,
    hair: hairMap[avatarState.hairColor] || hairMap.brown,
    eye: eyeMap[avatarState.eyeColor] || eyeMap.darkBrown,
    nose: noseMap[avatarState.noseColor] || noseMap.soft,
    mouth: mouthMap[avatarState.mouthColor] || mouthMap.softRose,
    shirt: shirtMap[avatarState.shirt] || shirtMap.beige
  };
}

/* ========================================
   CORES DOS DETALHES DO ROSTO
   Ajusta automaticamente:
   - olhos
   - boca
   - nariz

   Isso evita que detalhes sumam
   em peles mais escuras.
======================================== */
function getFaceDetailColors() {
  const isDarkSkin = avatarState.skin === "dark";

  if (isDarkSkin) {
    return {
      eye: "#FFF7F2",
      mouth: "#FFD2C2",
      nose: "#E9B29A"
    };
  }

  return {
    eye: "#3D2C23",
    mouth: "#8A5A4A",
    nose: "#B57F6B"
  };
}

/* ========================================
   CABELOS
   Formatos mais coerentes com a cabeça
======================================== */
function getHairSvg(hairType, hairColor) {
  if (hairType === "short") {
    return `
      <path
        d="M48 46
           C52 28, 68 18, 82 18
           C98 18, 112 28, 114 46
           C108 40, 100 38, 92 40
           C86 32, 72 32, 62 42
           C56 38, 52 40, 48 46Z"
        fill="${hairColor}"
      />
      <circle cx="58" cy="49" r="9" fill="${hairColor}" />
      <circle cx="74" cy="38" r="12" fill="${hairColor}" />
      <circle cx="92" cy="39" r="12" fill="${hairColor}" />
      <circle cx="106" cy="49" r="9" fill="${hairColor}" />
    `;
  }

  if (hairType === "medium") {
    return `
      <path
        d="M46 44
           C50 24, 68 16, 82 16
           C100 16, 116 28, 116 52
           L112 96
           C104 88, 100 78, 98 68
           C92 72, 86 74, 80 74
           C72 74, 64 72, 58 68
           C56 78, 52 88, 46 96
           Z"
        fill="${hairColor}"
      />
      <path
        d="M50 48
           C56 38, 66 34, 82 34
           C96 34, 106 38, 112 48"
        stroke="${hairColor}"
        stroke-width="8"
        stroke-linecap="round"
        fill="none"
      />
    `;
  }

  if (hairType === "wavy") {
    return `
      <path
        d="M46 46
           C50 24, 68 16, 82 16
           C100 16, 116 28, 116 52
           C112 48, 108 46, 100 46
           C94 38, 88 36, 82 36
           C74 36, 66 40, 60 46
           C56 44, 52 44, 46 46Z"
        fill="${hairColor}"
      />
      <path
        d="M54 58
           C56 68, 62 74, 66 84
           C62 86, 58 90, 54 96
           M106 58
           C104 68, 98 74, 94 84
           C98 86, 102 90, 106 96"
        stroke="${hairColor}"
        stroke-width="8"
        stroke-linecap="round"
        fill="none"
      />
    `;
  }

  if (hairType === "curly") {
    return `
      <circle cx="56" cy="50" r="10" fill="${hairColor}" />
      <circle cx="68" cy="38" r="12" fill="${hairColor}" />
      <circle cx="84" cy="34" r="13" fill="${hairColor}" />
      <circle cx="100" cy="40" r="12" fill="${hairColor}" />
      <circle cx="110" cy="54" r="10" fill="${hairColor}" />
      <circle cx="60" cy="66" r="9" fill="${hairColor}" />
      <circle cx="74" cy="68" r="9" fill="${hairColor}" />
      <circle cx="88" cy="68" r="9" fill="${hairColor}" />
      <circle cx="102" cy="68" r="9" fill="${hairColor}" />
    `;
  }

  if (hairType === "coily") {
    return `
      <circle cx="54" cy="50" r="8" fill="${hairColor}" />
      <circle cx="64" cy="40" r="9" fill="${hairColor}" />
      <circle cx="78" cy="34" r="11" fill="${hairColor}" />
      <circle cx="92" cy="36" r="11" fill="${hairColor}" />
      <circle cx="104" cy="44" r="9" fill="${hairColor}" />
      <circle cx="110" cy="56" r="8" fill="${hairColor}" />
      <circle cx="58" cy="66" r="8" fill="${hairColor}" />
      <circle cx="72" cy="69" r="8" fill="${hairColor}" />
      <circle cx="88" cy="69" r="8" fill="${hairColor}" />
      <circle cx="102" cy="68" r="8" fill="${hairColor}" />
    `;
  }

  if (hairType === "afro") {
    return `
      <circle cx="80" cy="50" r="32" fill="${hairColor}" />
      <circle cx="58" cy="50" r="14" fill="${hairColor}" />
      <circle cx="102" cy="50" r="14" fill="${hairColor}" />
      <circle cx="80" cy="28" r="16" fill="${hairColor}" />
    `;
  }

  if (hairType === "bun") {
    return `
      <circle cx="82" cy="23" r="13" fill="${hairColor}" />
      <path
        d="M50 46
           C54 28, 68 20, 82 20
           C96 20, 110 28, 114 46
           C108 42, 100 40, 92 42
           C84 34, 70 34, 62 42
           C58 40, 54 40, 50 46Z"
        fill="${hairColor}"
      />
      <path
        d="M60 44
           C66 38, 72 36, 82 36
           C92 36, 98 38, 104 44
           L102 62
           C96 58, 90 56, 82 56
           C74 56, 68 58, 62 62
           Z"
        fill="${hairColor}"
      />
    `;
  }

  return "";
}

/* ========================================
   OLHOS
   Formatos diferentes escolhidos pela pessoa
======================================== */
function getEyeSvg(eyeShape, eyeColor) {
  if (eyeShape === "round") {
    return `
      <circle cx="70" cy="76" r="3.2" fill="${eyeColor}" />
      <circle cx="90" cy="76" r="3.2" fill="${eyeColor}" />
    `;
  }

  if (eyeShape === "almond") {
    return `
      <path d="M64 76c2-4 10-4 12 0c-2 4-10 4-12 0Z" fill="${eyeColor}" />
      <path d="M84 76c2-4 10-4 12 0c-2 4-10 4-12 0Z" fill="${eyeColor}" />
    `;
  }

  if (eyeShape === "soft") {
    return `
      <ellipse cx="70" cy="76" rx="3.8" ry="2.4" fill="${eyeColor}" />
      <ellipse cx="90" cy="76" rx="3.8" ry="2.4" fill="${eyeColor}" />
    `;
  }

  return "";
}

/* ========================================
   NARIZ
   Formatos diferentes escolhidos pela pessoa
======================================== */
function getNoseSvg(noseShape, noseColor) {
  if (noseShape === "short") {
    return `
      <path
        d="M80 80v5"
        stroke="${noseColor}"
        stroke-width="1.8"
        stroke-linecap="round"
      />
    `;
  }

  if (noseShape === "soft") {
    return `
      <path
        d="M80 79c0 2 0 4 1 6"
        stroke="${noseColor}"
        stroke-width="1.9"
        stroke-linecap="round"
        fill="none"
      />
    `;
  }

  if (noseShape === "defined") {
    return `
      <path
        d="M80 78v7"
        stroke="${noseColor}"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M80 85c2 2 4 2 6 0"
        stroke="${noseColor}"
        stroke-width="1.8"
        stroke-linecap="round"
        fill="none"
      />
    `;
  }

  return "";
}

/* ========================================
   BOCA
   Formatos diferentes escolhidos pela pessoa
======================================== */
function getMouthSvg(mouthShape, mouthColor) {
  if (mouthShape === "smile") {
    return `
      <path
        d="M72 91c3 4 13 4 16 0"
        stroke="${mouthColor}"
        stroke-width="2.6"
        fill="none"
        stroke-linecap="round"
      />
    `;
  }

  if (mouthShape === "soft") {
    return `
      <path
        d="M73 91c3 2 11 2 14 0"
        stroke="${mouthColor}"
        stroke-width="2.3"
        fill="none"
        stroke-linecap="round"
      />
    `;
  }

  if (mouthShape === "neutral") {
    return `
      <line
        x1="73"
        y1="91"
        x2="87"
        y2="91"
        stroke="${mouthColor}"
        stroke-width="2.2"
        stroke-linecap="round"
      />
    `;
  }

  return "";
}

/* ========================================
   GERAÇÃO COMPLETA DO AVATAR EM SVG
   Agora o avatar respeita:
   - pele
   - cabelo
   - olhos
   - nariz
   - boca
   - roupa
======================================== */
function generateAvatarSvg() {
  const colors = getAvatarColors();

  return `
    <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <!-- fundo -->
      <rect width="160" height="160" rx="80" fill="#f7efe9" />

      <!-- roupa -->
      <path d="M42 148c4-26 20-40 38-40s34 14 38 40z" fill="${colors.shirt}" />

      <!-- pescoço -->
      <rect x="73" y="96" width="14" height="18" rx="6" fill="${colors.skin}" />

      <!-- rosto -->
      <ellipse cx="80" cy="76" rx="28" ry="32" fill="${colors.skin}" />

      <!-- olhos -->
      ${getEyeSvg(avatarState.eyeShape, colors.eye)}

      <!-- nariz -->
      ${getNoseSvg(avatarState.noseShape, colors.nose)}

      <!-- boca -->
      ${getMouthSvg(avatarState.mouthShape, colors.mouth)}

      <!-- cabelo -->
      ${getHairSvg(avatarState.hair, colors.hair)}
    </svg>
  `;
}
/* ========================================
   RENDERIZAÇÃO DO PREVIEW DO AVATAR
======================================== */
function renderAvatarPreview() {
  if (!avatarPreview) return;
  avatarPreview.innerHTML = generateAvatarSvg();
}

/* ========================================
   ATUALIZAÇÃO DO ESTADO DO AVATAR
   Agora por clique nas opções visuais
======================================== */
function updateAvatarState(field, value) {
  avatarState[field] = value;
  updateAvatarChoicesUI(field, value);
  renderAvatarPreview();
}

/* ========================================
   ATUALIZAÇÃO VISUAL DAS ESCOLHAS
   Marca qual opção está ativa em cada grupo
======================================== */
function updateAvatarChoicesUI(field, value) {
  avatarChoiceButtons.forEach((button) => {
    const buttonField = button.getAttribute("data-avatar-field");
    const buttonValue = button.getAttribute("data-avatar-value");

    if (buttonField === field) {
      button.classList.toggle("active", buttonValue === value);
    }
  });
}

avatarChoiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const field = button.getAttribute("data-avatar-field");
    const value = button.getAttribute("data-avatar-value");

    if (!field || !value) return;

    avatarState[field] = value;
    updateAvatarChoicesUI(field, value);
    renderAvatarPreview();
  });
});

/* ========================================
   AVATAR ALEATÓRIO
======================================== */
function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomizeAvatar() {
  avatarState = {
    skin: randomFrom(["light", "lightMedium", "medium", "mediumDark", "dark", "veryDark"]),
    hair: randomFrom(["short", "medium", "wavy", "curly", "coily", "afro", "bun"]),
    hairColor: randomFrom(["dark", "brown", "lightBrown", "blonde", "ginger"]),
    eyeShape: randomFrom(["round", "almond", "soft"]),
    eyeColor: randomFrom(["darkBrown", "brown", "hazel", "green", "blue"]),
    noseShape: randomFrom(["short", "soft", "defined"]),
    noseColor: randomFrom(["soft", "medium", "deep"]),
    mouthShape: randomFrom(["smile", "soft", "neutral"]),
    mouthColor: randomFrom(["softRose", "rose", "brownRose", "deep"]),
    shirt: randomFrom(["beige", "rose", "green", "brown", "blue", "lavender"])
  };

  Object.entries(avatarState).forEach(([field, value]) => {
    updateAvatarChoicesUI(field, value);
  });

  renderAvatarPreview();
}

if (randomAvatarBtn) {
  randomAvatarBtn.addEventListener("click", randomizeAvatar);
}

/* ========================================
   CLIQUES NAS OPÇÕES VISUAIS DO AVATAR
======================================== */
avatarChoiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const field = button.getAttribute("data-avatar-field");
    const value = button.getAttribute("data-avatar-value");

    if (!field || !value) return;

    updateAvatarState(field, value);
  });
});

/* ========================================
   SUBMIT FINAL DO ONBOARDING
   Salva todas as informações no perfil.
======================================== */
if (onboardingForm) {
  onboardingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isValid = validateCurrentStep();
    if (!isValid) return;

    const onboardingData = {
      fullName: fullNameInput.value.trim(),
      name: userNameInput.value.trim(),
      pronoun: userPronounInput.value,
      focus: mainFocusInput.value,
      energy: energyLevelInput.value,
      availableTime: availableTimeInput.value,
      avatar: {
        skin: avatarState.skin,
        hair: avatarState.hair,
        hairColor: avatarState.hairColor,
        shirt: avatarState.shirt
      },
      firstTask: {
        title: firstTaskInput.value.trim(),
        period: taskPeriodInput.value,
        completed: false,
        createdAt: new Date().toISOString()
      },
      firstAccessCompleted: true
    };

    localStorage.setItem("fluir_user_profile", JSON.stringify(onboardingData));
    localStorage.removeItem("fluir_pending_user");

    showMessage("Perfil configurado com sucesso.", "success");

    setTimeout(() => {
      window.location.href = "home.html";
    }, 1000);
  });
}

/* ========================================
   INICIALIZAÇÃO
   - pré-carrega nome do cadastro
   - mostra a etapa 1
   - renderiza o avatar inicial
======================================== */
preloadPendingUser();
showStep(1);
renderAvatarPreview();