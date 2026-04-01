const user = requireAuth();
if (!user) return;

const profileForm = document.getElementById("profileForm");
const preferencesForm = document.getElementById("preferencesForm");

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profilePhoto = document.getElementById("profilePhoto");
const profileAvatarPreview = document.getElementById("profileAvatarPreview");

const defaultEnergy = document.getElementById("defaultEnergy");
const defaultTime = document.getElementById("defaultTime");

const summaryName = document.getElementById("summaryName");
const summaryEmail = document.getElementById("summaryEmail");
const summaryTheme = document.getElementById("summaryTheme");
const summaryEnergy = document.getElementById("summaryEnergy");
const summaryTime = document.getElementById("summaryTime");

const logoutBtn = document.getElementById("logoutBtn");
const sidebarUserName = document.getElementById("sidebarUserName");

const themeButtons = document.querySelectorAll(".theme-card");

function updateActiveTheme(theme) {
  themeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });
}

function loadUserData() {
  const currentUser = UserService.getUser();
  const preferences = PreferencesService.get();

  if (!currentUser) return;

  profileName.value = currentUser.nome || "";
  profileEmail.value = currentUser.email || "";
  profilePhoto.value = currentUser.foto || "";

  profileAvatarPreview.src =
    currentUser.foto || "https://via.placeholder.com/120";

  defaultEnergy.value = preferences.energiaPadrao;
  defaultTime.value = preferences.tempoPadrao;

  sidebarUserName.textContent = currentUser.nome || "Usuário";

  updateSummary(currentUser, preferences);
  updateActiveTheme(Theme.getCurrent());
}

function updateSummary(userData, preferences) {
  summaryName.textContent = userData.nome || "-";
  summaryEmail.textContent = userData.email || "-";
  summaryTheme.textContent = Theme.getCurrent();
  summaryEnergy.textContent = preferences.energiaPadrao;
  summaryTime.textContent = Utils.formatMinutesLabel(
    Number(preferences.tempoPadrao)
  );
}

profileForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = profileName.value.trim();
  const email = profileEmail.value.trim();
  const foto = profilePhoto.value.trim();

  if (!nome || !email) {
    Toast.show("Preencha nome e e-mail", "error");
    return;
  }

  const currentUser = UserService.getUser();
  if (!currentUser) return;

  const updatedUser = {
    ...currentUser,
    nome,
    email,
    foto
  };

  UserService.saveUser(updatedUser);
  Toast.show("Perfil atualizado com sucesso");

  loadUserData();
});

preferencesForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newPreferences = {
    tema: Theme.getCurrent(),
    energiaPadrao: defaultEnergy.value,
    tempoPadrao: defaultTime.value
  };

  PreferencesService.save(newPreferences);

  Toast.show("Preferências atualizadas");
  loadUserData();
});

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme;

    Theme.apply(theme);

    const preferences = PreferencesService.get();
    PreferencesService.save({
      ...preferences,
      tema: theme
    });

    Toast.show("Tema atualizado");
    loadUserData();
  });
});

profilePhoto.addEventListener("input", () => {
  profileAvatarPreview.src =
    profilePhoto.value.trim() || "https://via.placeholder.com/120";
});

profileAvatarPreview.addEventListener("error", () => {
  profileAvatarPreview.src = "https://via.placeholder.com/120";
});

logoutBtn.addEventListener("click", () => {
  Session.logout();
});

loadUserData();