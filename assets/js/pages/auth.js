const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const registerLink = document.getElementById("registerLink");
const forgotPassword = document.getElementById("forgotPassword");

UserService.createDefaultUser();

const savedPreferences = PreferencesService.get();
if (savedPreferences?.tema) {
  Theme.apply(savedPreferences.tema);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();
  const user = UserService.getUser();

  if (!email || !senha) {
    Toast.show("Preencha todos os campos.", "error");
    return;
  }

  if (!user) {
    Toast.show("Nenhum usuário encontrado.", "error");
    return;
  }

  if (user.email === email && user.senha === senha) {
    Session.login(user);
    Toast.show("Login realizado com sucesso.");

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 700);

    return;
  }

  Toast.show("E-mail ou senha incorretos.", "error");
});

registerLink.addEventListener("click", (event) => {
  event.preventDefault();

  const nome = prompt("Digite seu nome:");
  const email = prompt("Digite seu e-mail:");
  const senha = prompt("Crie uma senha:");

  if (!nome || !email || !senha) {
    Toast.show("Cadastro cancelado ou incompleto.", "error");
    return;
  }

  const newUser = {
    nome: nome.trim(),
    email: email.trim(),
    senha: senha.trim(),
    foto: ""
  };

  UserService.saveUser(newUser);
  Toast.show("Conta criada com sucesso.");
});

forgotPassword.addEventListener("click", (event) => {
  event.preventDefault();

  const user = UserService.getUser();

  if (!user) {
    Toast.show("Nenhuma conta cadastrada.", "error");
    return;
  }

  Toast.show(`Senha atual: ${user.senha}`, "success");
});