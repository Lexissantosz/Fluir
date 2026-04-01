const Utils = {
  formatDate(dateString) {
    if (!dateString) return "Sem prazo";

    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  },

  formatEnergyLabel(energy) {
    if (energy === "baixa") return "Baixa";
    if (energy === "alta") return "Alta";
    return "Média";
  },

  formatMinutesLabel(minutes) {
    if (minutes === 15) return "15 min";
    if (minutes === 30) return "30 min";
    if (minutes === 60) return "1h";
    if (minutes === 120) return "2h";
    return `${minutes} min`;
  }
};