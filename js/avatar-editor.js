/* =========================================================
   FLUIR - AVATAR EDITOR
   Arquivo: avatar-editor.js

   Responsável por:
   - carregar avatar salvo
   - editar avatar em camadas PNG
   - trocar abas
   - salvar no perfil
========================================================= */

/* ========================================
   ELEMENTS
======================================== */
const backToProfileBtn = document.getElementById("backToProfileBtn");
const randomAvatarBtn = document.getElementById("randomAvatarBtn");
const saveAvatarBtn = document.getElementById("saveAvatarBtn");
const avatarEditorMessage = document.getElementById("avatarEditorMessage");

const avatarTabs = document.querySelectorAll(".avatar-tab");
const avatarPanels = document.querySelectorAll(".avatar-panel");
const avatarChoiceButtons = document.querySelectorAll("[data-avatar-field]");

/* ========================================
   AVATAR LAYERS
======================================== */
const layerBase = document.getElementById("layerBase");
const layerSkin = document.getElementById("layerSkin");
const layerEarLeft = document.getElementById("layerEarLeft");
const layerEarRight = document.getElementById("layerEarRight");
const layerEyeLeft = document.getElementById("layerEyeLeft");
const layerEyeRight = document.getElementById("layerEyeRight");
const layerNose = document.getElementById("layerNose");
const layerMouth = document.getElementById("layerMouth");
const layerHair = document.getElementById("layerHair");
const layerShirt = document.getElementById("layerShirt");

/* ========================================
   LOCAL STATE
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
   PROFILE STORAGE
======================================== */
function getStoredProfile() {
  const raw = localStorage.getItem("fluir_user_profile");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading profile:", error);
    return null;
  }
}

function saveProfile(profile) {
  localStorage.setItem("fluir_user_profile", JSON.stringify(profile));
}

/* ========================================
   MESSAGES
======================================== */
function showMessage(message, type = "error") {
  if (!avatarEditorMessage) return;

  avatarEditorMessage.textContent = message;
  avatarEditorMessage.className = `form-message show ${type}`;
}

function clearMessage() {
  if (!avatarEditorMessage) return;

  avatarEditorMessage.textContent = "";
  avatarEditorMessage.className = "form-message";
}

/* ========================================
   TABS
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
   CHOICE UI
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
    renderAvatarLayers();
  });
});

/* ========================================
   RENDER PNG LAYERS
======================================== */
function renderAvatarLayers() {
  if (layerBase) layerBase.src = "assets/avatars/base/base.png";
  if (layerSkin) layerSkin.src = `assets/avatars/skin/${avatarState.skin}.png`;
  if (layerEarLeft) layerEarLeft.src = `assets/avatars/ear/left/${avatarState.earLeft}.png`;
  if (layerEarRight) layerEarRight.src = `assets/avatars/ear/right/${avatarState.earRight}.png`;
  if (layerEyeLeft) layerEyeLeft.src = `assets/avatars/eyes/left/${avatarState.eyeLeft}.png`;
  if (layerEyeRight) layerEyeRight.src = `assets/avatars/eyes/right/${avatarState.eyeRight}.png`;
  if (layerNose) layerNose.src = `assets/avatars/nose/${avatarState.nose}.png`;
  if (layerMouth) layerMouth.src = `assets/avatars/mouth/${avatarState.mouth}.png`;
  if (layerHair) layerHair.src = `assets/avatars/hair/${avatarState.hairModel}/${avatarState.hairColor}.png`;
  if (layerShirt) layerShirt.src = `assets/avatars/shirt/${avatarState.shirtModel}/${avatarState.shirtColor}.png`;
}

/* ========================================
   LOAD SAVED AVATAR
======================================== */
function loadAvatarFromProfile() {
  const profile = getStoredProfile();

  if (!profile) {
    window.location.href = "onboarding.html";
    return;
  }

  if (profile.avatar) {
    avatarState = {
      ...avatarState,
      ...profile.avatar
    };
  }

  Object.entries(avatarState).forEach(([field, value]) => {
    updateAvatarChoicesUI(field, value);
  });

  renderAvatarLayers();
}

/* ========================================
   RANDOMIZER
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

  renderAvatarLayers();
}

/* ========================================
   SAVE AVATAR
======================================== */
function saveAvatar() {
  const profile = getStoredProfile();

  if (!profile) {
    showMessage("Profile not found.");
    return;
  }

  profile.avatar = { ...avatarState };
  saveProfile(profile);

  showMessage("Avatar saved successfully.", "success");
}

/* ========================================
   EVENTS
======================================== */
if (backToProfileBtn) {
  backToProfileBtn.addEventListener("click", () => {
    window.location.href = "profile.html";
  });
}

if (randomAvatarBtn) {
  randomAvatarBtn.addEventListener("click", () => {
    clearMessage();
    randomizeAvatar();
  });
}

if (saveAvatarBtn) {
  saveAvatarBtn.addEventListener("click", () => {
    clearMessage();
    saveAvatar();
  });
}

/* ========================================
   INIT
======================================== */
loadAvatarFromProfile();
renderAvatarLayers();