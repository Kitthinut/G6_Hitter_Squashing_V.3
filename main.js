import { mapData } from "./mapsettings.js";
import { Settings } from "./settings.js";
import { Calculator } from "./calculator.js";
class MapApp {
  constructor(canvasId) {
    // Get canvas and set context
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    // Load the selected map from localStorage, or use a default map
    const storedMap = localStorage.getItem("selectedMap");
    this.mapName = mapData[storedMap] ? storedMap : "map1.png";
    this.mapImage = new Image();

    // Error handling if map fails to load
    this.mapImage.onerror = () => {
      console.error(`Failed to load map image at: maps/${this.mapName}`);
    };

    // Get map settings
    const mapSettings = mapData[this.mapName];
    if (!mapSettings) {
      console.error("No map settings found for", this.mapName);
      return;
    }
    

    // Initialize settings and calculator
    this.settings = new Settings();
    this.calculator = new Calculator(this.settings);

    // Set map start position, scale, and real-world dimensions
    this.startX = mapSettings.startX;
    this.startY = mapSettings.startY;
    this.scale = mapSettings.scale;
    this.realWidth = mapSettings.realWidth;
    this.realHeight = mapSettings.realHeight;
    this.imgWidth = mapSettings.imgWidth;
    this.imgHeight = mapSettings.imgHeight;

    // Load the map image and set up the canvas size
    this.mapImage.onload = () => {
      this.canvas.width = this.imgWidth;
      this.canvas.height = this.imgHeight;
      this.drawMap();
      this.canvas.addEventListener("click", (e) => this.handleClick(e));
    };

    this.mapImage.src = `maps/${this.mapName}`;
  }

  // Draws the map and the start point on the canvas
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
    this.ctx.arc(this.startX, this.startY, 15, 0, Math.PI * 2); // Start point
    this.ctx.fill();
  }

  // Handles the click event to calculate and display distance and angle
  handleClick(e) {
    // Get click position on the canvas
    const rect = this.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);

    const realX = x;
    const realY = y;

    // Redraw map and draw lines showing the distance
    this.drawMap();
    this.drawLines(realX, realY);

    // Get distance components and calculate the real-world distance
    const {
      dx,
      dy,
      distance: realDistance,
    } = this.calculator.getDistanceComponents(
      realX,
      realY,
      this.startX,
      this.startY,
      this.scale
    );

    // Log coordinates and distances
    console.log(`Coordinates: (${Math.round(realX)}, ${Math.round(realY)})`);
    console.log(`X-Distance: ${dx.toFixed(2)} m`);
    console.log(`Y-Distance: ${dy.toFixed(2)} m`);
    document.getElementById(
      "distance"
    ).textContent = `Distance: ${realDistance.toFixed(2)} m`;

    // Find the best launch angle based on the calculated distance
    const ranges = this.calculator.findBestAngle(realDistance);

    // Handle impossible angle scenarios
    if (ranges === "Impossible") {
      console.log("Launch Angle: Impossible");
      document.getElementById("angle").textContent = "Launch Angle: Impossible";
    } else {
      // Display the angle range(s) if valid
      const rangeText = ranges
        .map((r) => `${r.min - 1}°– ${r.max + 5}°`) // Adjust manually for better accuracy
        .join(" or ");
      console.log(`Launch Angle: ${rangeText}`);
      document.getElementById(
        "angle"
      ).textContent = `Launch Angle: ${rangeText}`;
    }

    // Calculate and display the Machine Angle (absolute angle from start point)
    const machineAngle = this.calculator.FindRotationAngle(dx, dy);

    if (machineAngle === "impossible") {
      document.getElementById(
        "machine-angle"
      ).textContent = `Machine Angle: impossible`;
    } else {
      console.log(`Machine Angle: ${machineAngle.toFixed(2)}°`);
      document.getElementById(
        "machine-angle"
      ).textContent = `Machine Angle: ${machineAngle.toFixed(2)}°`;
    }

    // Provide feedback with a red circle at the click location
    this.showClickFeedback(realX, realY);
  }

  // Draw the lines representing the calculated trajectory
  drawLines(targetX, targetY) {
    // Draw horizontal and vertical lines
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

    // Draw the launch trajectory in red
    this.ctx.strokeStyle = "red";
    this.ctx.beginPath();
    this.ctx.moveTo(this.startX, this.startY);
    this.ctx.lineTo(targetX, targetY);
    this.ctx.stroke();
  }

  // Show feedback by drawing a red circle at the click location
  showClickFeedback(realX, realY) {
    this.ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    this.ctx.beginPath();
    this.ctx.arc(realX, realY, 10, 0, Math.PI * 2); // Feedback circle
    this.ctx.fill();
  }
}

// Initialize the MapApp with the given canvas ID
new MapApp("mapCanvas");
