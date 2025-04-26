import { mapData } from "./mapsettings.js";

class MapApp {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    this.mapName = localStorage.getItem("selectedMap") || "map1.png";
    this.mapImage = new Image();

    const mapSettings = mapData[this.mapName];

    if (!mapSettings) {
      console.error("No map settings found for", this.mapName);
      return;
    }

    this.settings = this.loadSettings();

    this.startX = mapSettings.startX;
    this.startY = mapSettings.startY;
    this.scale = mapSettings.scale;
    this.realWidth = mapSettings.realWidth;
    this.realHeight = mapSettings.realHeight;
    this.imgWidth = mapSettings.imgWidth;
    this.imgHeight = mapSettings.imgHeight;
    this.g = 9.81;

    this.mapImage.onload = () => {
      this.canvas.width = this.imgWidth;
      this.canvas.height = this.imgHeight;
      this.drawMap();
      this.canvas.addEventListener("click", (e) => this.handleClick(e));
    };
    this.mapImage.src = `maps/${this.mapName}`;
  }

  loadSettings() {
    return {
      u0: parseFloat(localStorage.getItem("u0")) || 3.5,
      h: parseFloat(localStorage.getItem("h")) || 0.27,
      racketMass: parseFloat(localStorage.getItem("racketMass")) || 0.3,
      ballMass: parseFloat(localStorage.getItem("ballMass")) || 0.025,
    };
  }

  drawMap() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.mapImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.ctx.fillStyle = "blue"; 
    this.ctx.beginPath();
    this.ctx.arc(this.startX, this.startY, 15, 0, Math.PI * 2); 
    this.ctx.fill();
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);

    // realX and realY
    const realX = x;
    const realY = y;

    // Draw the map and the lines to the clicked point
    this.drawMap();
    this.drawLines(realX, realY);

    // Calculate real-world distance and launch angle
    const realDistance = this.calculateRealDistance(realX, realY);
    const angle = this.calculateLaunchAngle(realDistance);

    // Log everything to the console 
    console.log(`Coordinates: (${Math.round(realX)}, ${Math.round(realY)})`);
    console.log(`Distance: ${realDistance.toFixed(2)} m`);
    console.log(
      typeof angle === "number"
        ? `Launch Angle: ${angle.toFixed(2)}°`
        : `Launch Angle: ${angle}`
    );

    // Update only the distance and angle in the HTML
    document.getElementById(
      "distance"
    ).textContent = `Distance: ${realDistance.toFixed(2)} m`;
    document.getElementById("angle").textContent =
      typeof angle === "number"
        ? `Launch Angle: ${angle.toFixed(2)}°`
        : `Launch Angle: ${angle}`;

    this.showClickFeedback(realX, realY);
  }

  drawLines(targetX, targetY) {
    this.ctx.strokeStyle = "gray";
    this.ctx.lineWidth = 10;

    const startX = this.startX;
    const startY = this.startY;
    const targetXFixed = targetX;
    const targetYFixed = targetY;

    // X-axis line
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(targetXFixed, startY);
    this.ctx.stroke();

    // Y-axis line
    this.ctx.beginPath();
    this.ctx.moveTo(targetXFixed, startY);
    this.ctx.lineTo(targetXFixed, targetYFixed);
    this.ctx.stroke();

    // Direct line
    this.ctx.strokeStyle = "red";
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(targetXFixed, targetYFixed);
    this.ctx.stroke();
  }

  calculateRealDistance(x, y) {
    // Calculate the real-world distance between the start and the clicked point
    const dx = (x - this.startX) / this.scale;
    const dy = (y - this.startY) / this.scale;
    return Math.sqrt(dx * dx + dy * dy);
  }

  calculateLaunchAngle(R) {
    const { u0 } = this.settings; // Initial velocity
    const g = this.g; // Gravitational constant
    const inside = (g * R) / (u0 * u0); // This is the value that goes inside the asin function
  
    // If the inside value is out of range, show an error message and fallback
    if (inside > 1 || inside < -1) {
      return "Impossible"; // Indicates an error or invalid launch angle
    }
  
    const angleRadians = 0.5 * Math.asin(inside);
    const angleDegrees = angleRadians * (180 / Math.PI);
    return angleDegrees;
  }
  

  showClickFeedback(realX, realY) {
    // Optional: Highlight clicked area with a subtle effect
    this.ctx.fillStyle = "rgba(255, 0, 0, 0.3)"; // Semi-transparent red
    this.ctx.beginPath();
    this.ctx.arc(realX, realY, 10, 0, Math.PI * 2); // Highlight area with a circle
    this.ctx.fill();
  }
}

// Initialize app
new MapApp("mapCanvas");
