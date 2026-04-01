function requireAuth() {
  if (!Session.isLogged()) {
    window.location.href = "index.html";
    return null;
  }

  const user = Session.getLoggedUser();

  if (!user) {
    window.location.href = "index.html";
    return null;
  }

  return user;
}