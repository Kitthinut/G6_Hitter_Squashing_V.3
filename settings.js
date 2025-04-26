class SettingsApp {
  constructor(formId) {
      this.form = document.getElementById(formId);
      this.resetBtn = document.getElementById('resetBtn');
      this.mapSelection = document.getElementById('mapSelection');
      this.init();
  }

  init() {
      // Load previously selected map from localStorage
      const selectedMap = localStorage.getItem('selectedMap') || "map1.png";
      this.mapSelection.value = selectedMap;

      // Load other settings from localStorage
      document.getElementById('u0').value = localStorage.getItem('u0') || 3.5;
      document.getElementById('h').value = localStorage.getItem('h') || 0.27;
      document.getElementById('racketMass').value = localStorage.getItem('racketMass') || 0.387;
      document.getElementById('ballMass').value = localStorage.getItem('ballMass') || 0.024;

      // Handle form submission to save settings
      this.form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.saveSettings();
          window.location.href = "index.html"; // Redirect to main page
      });

      // Handle reset button click
      this.resetBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.resetToDefault();
      });
  }

  saveSettings() {
      // Save map selection and other settings to localStorage
      localStorage.setItem('selectedMap', this.mapSelection.value);
      localStorage.setItem('u0', document.getElementById('u0').value);
      localStorage.setItem('h', document.getElementById('h').value);
      localStorage.setItem('racketMass', document.getElementById('racketMass').value);
      localStorage.setItem('ballMass', document.getElementById('ballMass').value);
  }

  resetToDefault() {
      // Reset map selection to default (map1.png)
      this.mapSelection.value = 'map1.png';

      // Reset all other settings to default values
      document.getElementById('u0').value = 3.5;
      document.getElementById('h').value = 0.27;
      document.getElementById('racketMass').value = 0.3;
      document.getElementById('ballMass').value = 0.025;

      // Save the default settings back to localStorage
      this.saveSettings();
  }
}

// Initialize the settings app
new SettingsApp('settingsForm');
