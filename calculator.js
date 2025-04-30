export class Calculator {
  // Constructor: Initializes the calculator with the provided settings and default constants.
  constructor(settings) {
    this.g = 9.81; // Gravitational acceleration
    this.settings = settings;
    this.racketMass = settings.racketMass;
    this.ballMass = settings.ballMass;
    this.e = settings.e; // Coefficient of restitution
    this.uball = settings.uball;
    this.uracket = settings.uracket;
    this.h = settings.h;
  }

  // Converts degrees to radians for angle calculations.
  toRadians(deg) {
    return deg * Math.PI / 180;
  }

  // Calculates the horizontal and vertical components of the distance between two points.
  getDistanceComponents(realX, realY, startX, startY, scale) {
    const dx = (realX - startX) / scale;
    const dy = (realY - startY) / scale;
    const realDistance = Math.sqrt(dx * dx + dy * dy);
    return {
      dx,
      dy,
      distance: realDistance,
    };
  }

  // Simulates the distance traveled by the ball given an angle.
  simulateDistance(thetaDeg) {
    const θ = this.toRadians(thetaDeg);
    const cosθ = Math.cos(θ);
    const sinθ = Math.sin(θ);

    const numerator = (this.racketMass - this.e * this.ballMass) * this.uracket * sinθ - this.ballMass * this.uball * cosθ;
    const denominator = this.racketMass + this.ballMass;
    const vRacket = numerator / denominator;

    const vBall = this.uracket + this.e * this.uball * cosθ + this.e * this.uracket * sinθ;

    const tanAlpha = vBall / (this.uball * sinθ);
    const alpha = Math.atan(tanAlpha);
    const diffAngle = alpha - θ;

    const cosDiff = Math.cos(diffAngle);
    const sinDiff = Math.sin(diffAngle);

    const magU = Math.sqrt(vBall * vBall + (this.uball * sinθ) * (this.uball * sinθ));

    const underSqrt = (magU * sinDiff) ** 2 + 4 * this.g * this.h;
    if (underSqrt < 0 || isNaN(magU)) return "Impossible";

    const time = (magU * sinDiff + Math.sqrt(underSqrt)) / (2 * this.g);
    const distance = magU * cosDiff * time;

    if (isNaN(distance) || !isFinite(distance)) return "Impossible";
    return distance;
  }

  // Finds the best angle for a target distance, within a given tolerance.
  findBestAngle(targetDistance, tolerance = 0.05) {
    const matchingAngles = [];

    // Iterate through possible angles to find those that match the target distance within tolerance.
    for (let theta = 1; theta <= 90; theta++) {
      const distance = this.simulateDistance(theta);
      if (distance === "Impossible") continue;

      if (Math.abs(distance - targetDistance) <= tolerance) {
        matchingAngles.push(theta);
      }
    }

    if (matchingAngles.length === 0) return "Impossible";

    // Create ranges for matching angles
    const ranges = [];
    let start = matchingAngles[0];

    for (let i = 1; i < matchingAngles.length; i++) {
      if (matchingAngles[i] !== matchingAngles[i - 1] + 1) {
        ranges.push({ min: start, max: matchingAngles[i - 1] });
        start = matchingAngles[i];
      }
    }

    ranges.push({ min: start, max: matchingAngles[matchingAngles.length - 1] });
    return ranges;
  }
}
