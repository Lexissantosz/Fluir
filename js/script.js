/* =========================================================
   FLUIR - AUTENTICAÇÃO
   Arquivo: script.js

   Responsável por:
   - alternar entre login e cadastro
   - validar campos
   - mostrar mensagens de erro/sucesso
   - salvar dados temporários do cadastro
   - redirecionar para onboarding ou home
========================================================= */

/* =========================
   ELEMENTOS DO LOGIN/CADASTRO
========================= */
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const showLoginBtn = document.getElementById("showLoginBtn");
const showRegisterBtn = document.getElementById("showRegisterBtn");

const switchToRegister = document.getElementById("switchToRegister");
const switchToLogin = document.getElementById("switchToLogin");

const heroTitle = document.getElementById("heroTitle");
const heroSubtitle = document.getElementById("heroSubtitle");
const formMessage = document.getElementById("formMessage");

const passwordToggleButtons = document.querySelectorAll("[data-toggle-password]");

/* =========================
   FUNÇÕES DE MENSAGEM
========================= */

/**
 * Exibe uma mensagem na tela.
 * type pode ser:
 * - "error"
 * - "success"
 */
function showMessage(message, type = "error") {
  if (!formMessage) return;

  formMessage.textContent = message;
  formMessage.className = `form-message show ${type}`;
}

/**
 * Limpa a mensagem exibida na tela.
 */
function clearMessage() {
  if (!formMessage) return;

  formMessage.textContent = "";
  formMessage.className = "form-message";
}

/* =========================
   CONTROLE DAS ABAS
========================= */

/**
 * Atualiza visualmente qual aba está ativa:
 * - true  => login ativo
 * - false => cadastro ativo
 */
function setTabState(isLogin) {
  if (showLoginBtn) {
    showLoginBtn.classList.toggle("active", isLogin);
    showLoginBtn.setAttribute("aria-selected", isLogin ? "true" : "false");
  }

  if (showRegisterBtn) {
    showRegisterBtn.classList.toggle("active", !isLogin);
    showRegisterBtn.setAttribute("aria-selected", isLogin ? "false" : "true");
  }
}

/**
 * Mostra o formulário de login.
 */
function showLogin() {
  if (loginForm) loginForm.classList.add("active");
  if (registerForm) registerForm.classList.remove("active");

  setTabState(true);

  if (heroTitle) heroTitle.textContent = "Bem-vindo ao Fluir";
  if (heroSubtitle) {
    heroSubtitle.textContent = "Organize seu dia com leveza, clareza e constância.";
  }

  clearMessage();
}

/**
 * Mostra o formulário de cadastro.
 */
function showRegister() {
  if (registerForm) registerForm.classList.add("active");
  if (loginForm) loginForm.classList.remove("active");

  setTabState(false);

  if (heroTitle) heroTitle.textContent = "Crie sua conta";
  if (heroSubtitle) {
    heroSubtitle.textContent = "Comece sua rotina com uma experiência mais leve e inteligente.";
  }

  clearMessage();
}

/* =========================
   VALIDAÇÕES
========================= */

/**
 * Verifica se o e-mail tem formato válido.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Verifica se a senha tem pelo menos 6 caracteres.
 */
function validatePassword(password) {
  return password.length >= 6;
}

/* =========================
   MOSTRAR/OCULTAR SENHA
========================= */

/**
 * Para cada botão de olho,
 * alterna o campo entre password e text.
 */
passwordToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const inputId = button.getAttribute("data-toggle-password");
    const input = document.getElementById(inputId);

    if (!input) return;

    const icon = button.querySelector("i");
    const isShowing = input.type === "text";

    input.type = isShowing ? "password" : "text";

    if (icon) {
      icon.className = isShowing ? "bi bi-eye" : "bi bi-eye-slash";
    }
  });
});

/* =========================
   EVENTOS DOS BOTÕES DE TROCA
========================= */
if (showLoginBtn) {
  showLoginBtn.addEventListener("click", showLogin);
}

if (showRegisterBtn) {
  showRegisterBtn.addEventListener("click", showRegister);
}

if (switchToRegister) {
  switchToRegister.addEventListener("click", showRegister);
}

if (switchToLogin) {
  switchToLogin.addEventListener("click", showLogin);
}

/* =========================
   SUBMIT DO LOGIN
========================= */
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage();

    const loginEmailField = document.getElementById("loginEmail");
    const loginPasswordField = document.getElementById("loginPassword");

    if (!loginEmailField || !loginPasswordField) {
      showMessage("Os campos de login não foram encontrados.");
      return;
    }

    const email = loginEmailField.value.trim();
    const password = loginPasswordField.value.trim();

    if (!email || !password) {
      showMessage("Preencha e-mail e senha para continuar.");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Digite um e-mail válido.");
      return;
    }

    if (!validatePassword(password)) {
      showMessage("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    showMessage("Login validado com sucesso.", "success");

    /* 
      Se já existir perfil completo, vai para a home.
      Se não existir, vai para o onboarding.
    */
    setTimeout(() => {
      const profile = localStorage.getItem("fluir_user_profile");

      if (!profile) {
        window.location.href = "onboarding.html";
      } else {
        window.location.href = "home.html";
      }
    }, 1000);
  });
}

/* =========================
   SUBMIT DO CADASTRO
========================= */
if (registerForm) {
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage();

    const nameField = document.getElementById("registerName");
    const emailField = document.getElementById("registerEmail");
    const passwordField = document.getElementById("registerPassword");
    const confirmPasswordField = document.getElementById("registerConfirmPassword");
    const termsField = document.getElementById("terms");

    if (!nameField || !emailField || !passwordField || !confirmPasswordField || !termsField) {
      showMessage("Há campos do cadastro faltando no HTML.");
      return;
    }

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const password = passwordField.value.trim();
    const confirmPassword = confirmPasswordField.value.trim();
    const acceptedTerms = termsField.checked;

    if (!name || !email || !password || !confirmPassword) {
      showMessage("Preencha todos os campos para criar sua conta.");
      return;
    }

    if (name.length < 3) {
      showMessage("Digite um nome válido.");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Digite um e-mail válido.");
      return;
    }

    if (!validatePassword(password)) {
      showMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("As senhas não coincidem.");
      return;
    }

    if (!acceptedTerms) {
      showMessage("Você precisa aceitar os termos para continuar.");
      return;
    }

    /* 
      Salva dados básicos temporários.
      Depois o onboarding completa o perfil.
    */
    const userProfile = {
      name,
      email,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem("fluir_pending_user", JSON.stringify(userProfile));

    showMessage("Conta criada com sucesso.", "success");

    setTimeout(() => {
      window.location.href = "onboarding.html";
    }, 1000);
  });
}

/* =========================
   ESTADO INICIAL
========================= */
showLogin();