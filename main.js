import { mapData } from "./mapsettings.js";
import { Calculator } from "./calculator.js";
import { Settings } from "./settings.js";

class MapApp {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    const storedMap = localStorage.getItem("selectedMap");
    this.mapName = mapData[storedMap] ? storedMap : "map1.png";
    this.mapImage = new Image();

    this.mapImage.onerror = () => {
      console.error(`Failed to load map image at: maps/${this.mapName}`);
    };

    const mapSettings = mapData[this.mapName];
    if (!mapSettings) {
      console.error("No map settings found for", this.mapName);
      return;
    }

    this.settings = new Settings();
    this.calculator = new Calculator(this.settings);

    this.startX = mapSettings.startX;
    this.startY = mapSettings.startY;
    this.scale = mapSettings.scale;
    this.realWidth = mapSettings.realWidth;
    this.realHeight = mapSettings.realHeight;
    this.imgWidth = mapSettings.imgWidth;
    this.imgHeight = mapSettings.imgHeight;

    this.mapImage.onload = () => {
      this.canvas.width = this.imgWidth;
      this.canvas.height = this.imgHeight;
      this.drawMap();
      this.canvas.addEventListener("click", (e) => this.handleClick(e));
    };

    this.mapImage.src = `maps/${this.mapName}`;
  }

  drawMap() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.mapImage, 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "blue";
    this.ctx.beginPath();
    this.ctx.arc(this.startX, this.startY, 15, 0, Math.PI * 2);
    this.ctx.fill();
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);

    const realX = x;
    const realY = y;

    this.drawMap();
    this.drawLines(realX, realY);

    const { dx, dy, distance: realDistance } = this.calculator.getDistanceComponents(realX, realY, this.startX, this.startY, this.scale);

    console.log(`Coordinates: (${Math.round(realX)}, ${Math.round(realY)})`);
    console.log(`X-Distance: ${dx.toFixed(2)} m`);
    console.log(`Y-Distance: ${dy.toFixed(2)} m`);
    document.getElementById("distance").textContent = `Distance: ${realDistance.toFixed(2)} m`;

    const ranges = this.calculator.findBestAngle(realDistance);

  if (ranges === "Impossible") {
    console.log("Launch Angle: Impossible");
    document.getElementById("angle").textContent = "Launch Angle: Impossible";
  } else {
    const rangeText = ranges
      .map(r => `${r.min - 1}°– ${r.max + 5}°`)  // Adjust manually
      .join(" or ");
    console.log(`Launch Angle: ${rangeText}`);
    document.getElementById("angle").textContent = `Launch Angle: ${rangeText}`;
  }
  this.showClickFeedback(realX, realY);
}
  

  drawLines(targetX, targetY) {
    this.ctx.strokeStyle = "gray";
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(targetX, this.startY);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(targetX, this.startY);
    this.ctx.lineTo(targetX, targetY);
    this.ctx.stroke();

    this.ctx.strokeStyle = "red";
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(targetX, targetY);
    this.ctx.stroke();
  }

  showClickFeedback(realX, realY) {
    this.ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    this.ctx.beginPath();
    this.ctx.arc(realX, realY, 10, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

new MapApp("mapCanvas");