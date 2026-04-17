/* =========================================================
   FLUIR - ONBOARDING
   Arquivo: onboarding.js

   Responsável por:
   - pré-carregar nome do cadastro
   - permitir upload de foto
   - validar dados do primeiro acesso
   - salvar perfil completo no localStorage
   - enviar para a home
========================================================= */

/* =========================
   ELEMENTOS DA TELA
========================= */
const onboardingForm = document.getElementById("onboardingForm");
const profilePhotoInput = document.getElementById("profilePhoto");
const photoPreview = document.getElementById("photoPreview");
const onboardingMessage = document.getElementById("onboardingMessage");
const userNameInput = document.getElementById("userName");

/* 
  Aqui vamos guardar a foto em base64
  para depois salvar no localStorage.
*/
let profilePhotoBase64 = "";

/* =========================
   MENSAGENS
========================= */
function showMessage(message, type = "error") {
  onboardingMessage.textContent = message;
  onboardingMessage.className = `form-message show ${type}`;
}

function clearMessage() {
  onboardingMessage.textContent = "";
  onboardingMessage.className = "form-message";
}

/* =========================
   PRÉ-CARREGAR DADOS DO CADASTRO
========================= */

/**
 * Se o usuário veio do cadastro,
 * puxamos o nome salvo temporariamente.
 */
function preloadPendingUser() {
  const pendingUser = JSON.parse(localStorage.getItem("fluir_pending_user"));

  if (pendingUser && pendingUser.name && userNameInput) {
    userNameInput.value = pendingUser.name;
  }
}

/* =========================
   UPLOAD DE FOTO
========================= */

/**
 * Quando o usuário escolher uma imagem:
 * - lemos o arquivo
 * - transformamos em base64
 * - mostramos preview na tela
 */
if (profilePhotoInput) {
  profilePhotoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      profilePhotoBase64 = e.target.result;
      photoPreview.innerHTML = `<img src="${profilePhotoBase64}" alt="Foto de perfil">`;
    };

    reader.readAsDataURL(file);
  });
}

/* =========================
   SUBMIT DO ONBOARDING
========================= */
if (onboardingForm) {
  onboardingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage();

    const userName = document.getElementById("userName").value.trim();
    const userPronoun = document.getElementById("userPronoun").value;
    const mainFocus = document.getElementById("mainFocus").value;
    const energyLevel = document.getElementById("energyLevel").value;
    const firstTask = document.getElementById("firstTask").value.trim();
    const taskPeriod = document.getElementById("taskPeriod").value;

    if (!userName) {
      showMessage("Digite como você quer ser chamado.");
      return;
    }

    if (!userPronoun) {
      showMessage("Selecione um pronome.");
      return;
    }

    if (!mainFocus) {
      showMessage("Selecione seu foco principal.");
      return;
    }

    if (!energyLevel) {
      showMessage("Selecione como sua energia costuma ficar.");
      return;
    }

    if (!firstTask) {
      showMessage("Digite sua primeira atividade.");
      return;
    }

    if (!taskPeriod) {
      showMessage("Selecione o período da atividade.");
      return;
    }

    /* 
      Monta o objeto final do perfil do usuário.
    */
    const onboardingData = {
      name: userName,
      pronoun: userPronoun,
      focus: mainFocus,
      energy: energyLevel,
      photo: profilePhotoBase64,
      firstTask: {
        title: firstTask,
        period: taskPeriod,
        completed: false,
        createdAt: new Date().toISOString()
      },
      firstAccessCompleted: true
    };

    /* 
      Salva o perfil completo.
      Remove o cadastro temporário.
    */
    localStorage.setItem("fluir_user_profile", JSON.stringify(onboardingData));
    localStorage.removeItem("fluir_pending_user");

    showMessage("Perfil configurado com sucesso.", "success");

    setTimeout(() => {
      window.location.href = "home.html";
    }, 1000);
  });
}

/* =========================
   INICIALIZAÇÃO
========================= */
preloadPendingUser();