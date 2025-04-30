export class Settings {
  constructor(formId = "settingsForm") {
    this.form = document.getElementById(formId);
    this.mapSelection = document.getElementById("mapSelection");
    this.resetBtn = document.getElementById("resetBtn");

    console.log(this.form, this.mapSelection, this.resetBtn);  // Debugging

    this.uracket = parseFloat(localStorage.getItem("uracket")) || 3.5;
    this.h = parseFloat(localStorage.getItem("h")) || 0.27;
    this.racketMass = parseFloat(localStorage.getItem("racketMass")) || 0.386;
    this.ballMass = parseFloat(localStorage.getItem("ballMass")) || 0.024;
    this.e = parseFloat(localStorage.getItem("e")) || 0.42;
    this.uball = parseFloat(localStorage.getItem("uball")) || 5.87;
  }

  init() {
    const getOrDefault = (key, defaultVal) =>
      localStorage.getItem(key) || defaultVal;

    this.mapSelection.value = getOrDefault("selectedMap", "map1.png");
    document.getElementById("racketMass").value = getOrDefault(
      "racketMass",
      0.386
    );
    document.getElementById("e").value = getOrDefault("e", 0.42);
    document.getElementById("ballMass").value = getOrDefault("ballMass", 0.024);
    document.getElementById("uball").value = getOrDefault("uball", 5.87);
    document.getElementById("uracket").value = getOrDefault("uracket", 3.5);

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveSettings();
      window.location.href = "index.html";
    });

    this.resetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.resetToDefault();
    });
  }

  saveSettings() {
    localStorage.setItem("selectedMap", this.mapSelection.value);
    localStorage.setItem(
      "racketMass",
      document.getElementById("racketMass").value
    );
    localStorage.setItem("e", document.getElementById("e").value);
    localStorage.setItem("ballMass", document.getElementById("ballMass").value);
    localStorage.setItem("uracket", document.getElementById("uracket").value);
    localStorage.setItem("uball", document.getElementById("uball").value);
  }

  resetToDefault() {
    this.mapSelection.value = "map1.png";
    document.getElementById("racketMass").value = 0.386;
    document.getElementById("e").value = 0.42;
    document.getElementById("ballMass").value = 0.024;
    document.getElementById("uracket").value = 3.5;
    document.getElementById("uball").value = 5.87;
    this.saveSettings();
  }
}

// Make sure that the DOM is fully loaded before initializing
document.addEventListener("DOMContentLoaded", () => {
  const settings = new Settings("settingsForm");
  settings.init();
});
