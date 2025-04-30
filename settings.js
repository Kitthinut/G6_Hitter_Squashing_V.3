export class Settings {
  constructor(formId = "settingsForm") {
    this.form = document.getElementById(formId);
    this.mapSelection = document.getElementById("mapSelection");
    this.resetBtn = document.getElementById("resetBtn");
    this.mapPreview = document.getElementById("mapPreview"); // Map preview element

    // Default values setup from localStorage or fallback
    this.uracket = parseFloat(localStorage.getItem("uracket")) || 3.5;
    this.h = parseFloat(localStorage.getItem("h")) || 0.27;
    this.racketMass = parseFloat(localStorage.getItem("racketMass")) || 0.386;
    this.ballMass = parseFloat(localStorage.getItem("ballMass")) || 0.024;
    this.e = parseFloat(localStorage.getItem("e")) || 0.42;
    this.uball = parseFloat(localStorage.getItem("uball")) || 5.87;
    this.selectedMap = localStorage.getItem("selectedMap") || "map1.png"; // Store the selected map image
  }

  // Initialize form and events
  init() {
    this.loadSettings();
    this.updateMapPreview(); // Show the preview for the default or saved map

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveSettings();
      window.location.href = "index.html"; // Redirect to main page after saving
    });

    this.resetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.resetToDefault(); // Reset to default settings
    });

    // Event listener for map selection
    this.mapSelection.addEventListener("change", (e) => {
      this.selectedMap = e.target.value;
      this.updateMapPreview();
    });
  }

  // Load settings from localStorage and set them to the form inputs
  loadSettings() {
    const getOrDefault = (key, defaultVal) => localStorage.getItem(key) || defaultVal;

    this.mapSelection.value = getOrDefault("selectedMap", "map1.png");
    document.getElementById("racketMass").value = getOrDefault("racketMass", 0.386);
    document.getElementById("e").value = getOrDefault("e", 0.42);
    document.getElementById("ballMass").value = getOrDefault("ballMass", 0.024);
    document.getElementById("uball").value = getOrDefault("uball", 5.87);
    document.getElementById("uracket").value = getOrDefault("uracket", 3.5);
  }

  // Save settings to localStorage
  saveSettings() {
    localStorage.setItem("selectedMap", this.mapSelection.value);
    localStorage.setItem("racketMass", document.getElementById("racketMass").value);
    localStorage.setItem("e", document.getElementById("e").value);
    localStorage.setItem("ballMass", document.getElementById("ballMass").value);
    localStorage.setItem("uracket", document.getElementById("uracket").value);
    localStorage.setItem("uball", document.getElementById("uball").value);

    alert("Settings saved successfully!");
  }

  // Reset all settings to default values
  resetToDefault() {
    this.mapSelection.value = "map1.png";
    document.getElementById("racketMass").value = 0.386;
    document.getElementById("e").value = 0.42;
    document.getElementById("ballMass").value = 0.024;
    document.getElementById("uracket").value = 3.5;
    document.getElementById("uball").value = 5.87;
    this.saveSettings();
  }

  // Update the map preview when the map selection changes
  updateMapPreview() {
    const mapPreviewElement = this.mapPreview;
    mapPreviewElement.src = `maps/${this.selectedMap}`; // Assuming maps are stored in 'images/' folder
  }
}

// Initialize Settings class when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const settings = new Settings("settingsForm");
  settings.init();
});
