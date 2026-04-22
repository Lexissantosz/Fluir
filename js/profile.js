/* =========================================================
   FLUIR - PERFIL
   Arquivo: perfil.js

   Responsável por:
   - carregar dados do perfil
   - preencher formulário pessoal
   - renderizar avatar em PNG por camadas
   - editar bonequinho
   - salvar alterações no localStorage
========================================================= */

/* ========================================
   ELEMENTOS PRINCIPAIS
======================================== */
const profileForm = document.getElementById("profileForm");
const profileMessage = document.getElementById("profileMessage");
const avatarMessage = document.getElementById("avatarMessage");

const profileFullName = document.getElementById("profileFullName");
const profileName = document.getElementById("profileName");
const profilePronoun = document.getElementById("profilePronoun");
const profileFocus = document.getElementById("profileFocus");
const profileEnergy = document.getElementById("profileEnergy");
const profileAvailableTime = document.getElementById("profileAvailableTime");

const profileDisplayName = document.getElementById("profileDisplayName");
const profileDisplayPronoun = document.getElementById("profileDisplayPronoun");
const profileDisplayFocus = document.getElementById("profileDisplayFocus");
const profileDisplayEnergy = document.getElementById("profileDisplayEnergy");
const profileDisplayTime = document.getElementById("profileDisplayTime");

const backHomeBtn = document.getElementById("backHomeBtn");

/* ========================================
   CAMADAS DO AVATAR
======================================== */
const profileLayerBase = document.getElementById("profileLayerBase");
const profileLayerSkin = document.getElementById("profileLayerSkin");
const profileLayerEarLeft = document.getElementById("profileLayerEarLeft");
const profileLayerEarRight = document.getElementById("profileLayerEarRight");
const profileLayerEyeLeft = document.getElementById("profileLayerEyeLeft");
const profileLayerEyeRight = document.getElementById("profileLayerEyeRight");
const profileLayerNose = document.getElementById("profileLayerNose");
const profileLayerMouth = document.getElementById("profileLayerMouth");
const profileLayerHair = document.getElementById("profileLayerHair");
const profileLayerShirt = document.getElementById("profileLayerShirt");

/* ========================================
   EDITOR DO AVATAR
======================================== */
const avatarTabs = document.querySelectorAll(".avatar-tab");
const avatarPanels = document.querySelectorAll(".avatar-panel");
const avatarChoiceButtons = document.querySelectorAll("[data-avatar-field]");
const randomAvatarBtn = document.getElementById("randomAvatarBtn");
const saveAvatarBtn = document.getElementById("saveAvatarBtn");

/* ========================================
   ESTADO LOCAL DO AVATAR
======================================== */
let avatarState = {
  skin: "skin-1",
  earLeft: "ear-1",
  earRight: "ear-1",
  eyeLeft: "eye-1",
  eyeRight: "eye-1",
  nose: "nose-1",
  mouth: "mouth-1",
  hairModel: "short",
  hairColor: "dark",
  shirtModel: "basic",
  shirtColor: "beige"
};

/* ========================================
   MENSAGENS
======================================== */
function showMessage(target, message, type = "error") {
  if (!target) return;
  target.textContent = message;
  target.className = `form-message show ${type}`;
}

function clearMessage(target) {
  if (!target) return;
  target.textContent = "";
  target.className = "form-message";
}

/* ========================================
   LEITURA E SALVAMENTO
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

/* ========================================
   LABELS
======================================== */
function getEnergyLabel(energy) {
  if (energy === "baixa") return "Baixa";
  if (energy === "media") return "Média";
  if (energy === "alta") return "Alta";
  if (energy === "varia bastante") return "Varia bastante";
  return "Não definida";
}

/* ========================================
   ABAS DO EDITOR
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
   UI DAS ESCOLHAS DO AVATAR
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
    renderProfileAvatarLayers();
  });
});

/* ========================================
   CAMINHOS DAS CAMADAS
======================================== */
function renderProfileAvatarLayers() {
  if (profileLayerBase) {
    profileLayerBase.src = "assets/avatars/base/base.png";
  }

  if (profileLayerSkin) {
    profileLayerSkin.src = `assets/avatars/skin/${avatarState.skin}.png`;
  }

  if (profileLayerEarLeft) {
    profileLayerEarLeft.src = `assets/avatars/ear/left/${avatarState.earLeft}.png`;
  }

  if (profileLayerEarRight) {
    profileLayerEarRight.src = `assets/avatars/ear/right/${avatarState.earRight}.png`;
  }

  if (profileLayerEyeLeft) {
    profileLayerEyeLeft.src = `assets/avatars/eyes/left/${avatarState.eyeLeft}.png`;
  }

  if (profileLayerEyeRight) {
    profileLayerEyeRight.src = `assets/avatars/eyes/right/${avatarState.eyeRight}.png`;
  }

  if (profileLayerNose) {
    profileLayerNose.src = `assets/avatars/nose/${avatarState.nose}.png`;
  }

  if (profileLayerMouth) {
    profileLayerMouth.src = `assets/avatars/mouth/${avatarState.mouth}.png`;
  }

  if (profileLayerHair) {
    profileLayerHair.src = `assets/avatars/hair/${avatarState.hairModel}/${avatarState.hairColor}.png`;
  }

  if (profileLayerShirt) {
    profileLayerShirt.src = `assets/avatars/shirt/${avatarState.shirtModel}/${avatarState.shirtColor}.png`;
  }
}

/* ========================================
   PREENCHER VISUAL
======================================== */
function fillProfileView(profile) {
  if (!profile) return;

  if (profileDisplayName) {
    profileDisplayName.textContent = profile.name || "Usuário";
  }

  if (profileDisplayPronoun) {
    profileDisplayPronoun.textContent = profile.pronoun || "Pronome";
  }

  if (profileDisplayFocus) {
    profileDisplayFocus.textContent = profile.focus || "Não definido";
  }

  if (profileDisplayEnergy) {
    profileDisplayEnergy.textContent = getEnergyLabel(profile.energy);
  }

  if (profileDisplayTime) {
    profileDisplayTime.textContent = profile.availableTime || "Não definido";
  }
}

/* ========================================
   PREENCHER FORMULÁRIO
======================================== */
function fillProfileForm(profile) {
  if (!profile) return;

  if (profileFullName) profileFullName.value = profile.fullName || "";
  if (profileName) profileName.value = profile.name || "";
  if (profilePronoun) profilePronoun.value = profile.pronoun || "";
  if (profileFocus) profileFocus.value = profile.focus || "";
  if (profileEnergy) profileEnergy.value = profile.energy || "";
  if (profileAvailableTime) profileAvailableTime.value = profile.availableTime || "";
}

/* ========================================
   CARREGAR AVATAR DO PERFIL
======================================== */
function loadAvatarFromProfile(profile) {
  if (!profile?.avatar) return;

  avatarState = {
    ...avatarState,
    ...profile.avatar
  };

  Object.entries(avatarState).forEach(([field, value]) => {
    updateAvatarChoicesUI(field, value);
  });

  renderProfileAvatarLayers();
}

/* ========================================
   CARREGAR PERFIL
======================================== */
function loadProfilePage() {
  const profile = getStoredProfile();

  if (!profile) {
    window.location.href = "onboarding.html";
    return;
  }

  fillProfileView(profile);
  fillProfileForm(profile);
  loadAvatarFromProfile(profile);
}

/* ========================================
   SALVAR INFORMAÇÕES PESSOAIS
======================================== */
if (profileForm) {
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage(profileMessage);

    const profile = getStoredProfile();
    if (!profile) {
      showMessage(profileMessage, "Perfil não encontrado.");
      return;
    }

    const fullName = profileFullName.value.trim();
    const name = profileName.value.trim();
    const pronoun = profilePronoun.value;
    const focus = profileFocus.value;
    const energy = profileEnergy.value;
    const availableTime = profileAvailableTime.value;

    if (!fullName) {
      showMessage(profileMessage, "Digite seu nome completo.");
      return;
    }

    if (!name) {
      showMessage(profileMessage, "Digite como você quer ser chamado.");
      return;
    }

    if (!pronoun) {
      showMessage(profileMessage, "Selecione um pronome.");
      return;
    }

    if (!focus) {
      showMessage(profileMessage, "Selecione seu foco principal.");
      return;
    }

    if (!energy) {
      showMessage(profileMessage, "Selecione sua energia.");
      return;
    }

    if (!availableTime) {
      showMessage(profileMessage, "Selecione seu tempo disponível.");
      return;
    }

    profile.fullName = fullName;
    profile.name = name;
    profile.pronoun = pronoun;
    profile.focus = focus;
    profile.energy = energy;
    profile.availableTime = availableTime;

    saveProfile(profile);
    fillProfileView(profile);

    showMessage(profileMessage, "Informações atualizadas com sucesso.", "success");
  });
}

/* ========================================
   AVATAR ALEATÓRIO
======================================== */
function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomizeAvatar() {
  avatarState = {
    skin: randomFrom(["skin-1", "skin-2", "skin-3", "skin-4", "skin-5", "skin-6"]),
    earLeft: randomFrom(["ear-1", "ear-2", "ear-3", "ear-4"]),
    earRight: randomFrom(["ear-1", "ear-2", "ear-3", "ear-4"]),
    eyeLeft: randomFrom(["eye-1", "eye-2", "eye-3", "eye-4"]),
    eyeRight: randomFrom(["eye-1", "eye-2", "eye-3", "eye-4"]),
    nose: randomFrom(["nose-1", "nose-2", "nose-3", "nose-4"]),
    mouth: randomFrom(["mouth-1", "mouth-2", "mouth-3", "mouth-4", "mouth-5", "mouth-6"]),
    hairModel: randomFrom(["afro", "bun", "coily", "curly", "medium", "short", "wavy"]),
    hairColor: randomFrom(["dark", "brown", "light-brown", "blonde", "ginger"]),
    shirtModel: randomFrom(["basic", "hoodie", "sweater", "t-shirt", "tank"]),
    shirtColor: randomFrom(["beige", "brown", "black", "white", "gray", "green", "blue", "pink", "lavender", "yellow"])
  };

  Object.entries(avatarState).forEach(([field, value]) => {
    updateAvatarChoicesUI(field, value);
  });

  renderProfileAvatarLayers();
}

if (randomAvatarBtn) {
  randomAvatarBtn.addEventListener("click", () => {
    clearMessage(avatarMessage);
    randomizeAvatar();
  });
}

/* ========================================
   SALVAR AVATAR NO PERFIL
======================================== */
if (saveAvatarBtn) {
  saveAvatarBtn.addEventListener("click", () => {
    clearMessage(avatarMessage);

    const profile = getStoredProfile();
    if (!profile) {
      showMessage(avatarMessage, "Perfil não encontrado.");
      return;
    }

    profile.avatar = { ...avatarState };
    saveProfile(profile);

    showMessage(avatarMessage, "Bonequinho salvo com sucesso.", "success");
  });
}

/* ========================================
   BOTÕES AUXILIARES
======================================== */
if (backHomeBtn) {
  backHomeBtn.addEventListener("click", () => {
    window.location.href = "home.html";
  });
}

/* ========================================
   INICIALIZAÇÃO
======================================== */
loadProfilePage();
renderProfileAvatarLayers();