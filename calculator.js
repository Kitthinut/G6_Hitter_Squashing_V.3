export class Calculator {
  // Private fields for internal use only within this class
  #g;            // Gravitational acceleration (m/s²)
  #settings;     // Settings object containing initial parameters
  #racketMass;   // Mass of the racket (kg)
  #ballMass;     // Mass of the ball (kg)
  #e;            // Coefficient of restitution (elasticity of collision)
  #uball;        // Initial velocity of the ball (m/s)
  #uracket;      // Initial velocity of the racket (m/s)
  #h;            // Initial height from which the ball is hit (m)

  // Constructor: Initializes private parameters using the provided settings
  constructor(settings) {
    this.#g = 9.81;
    this.#settings = settings;
    this.#racketMass = settings.racketMass;
    this.#ballMass = settings.ballMass;
    this.#e = settings.e;
    this.#uball = settings.uball;
    this.#uracket = settings.uracket;
    this.#h = settings.h;
  }

  // Converts degrees to radians for angle calculations.
  toRadians(deg) {
    return (deg * Math.PI) / 180;
  }

  // Calculates the horizontal and vertical distance components between two points, scaled to real-world units.
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

  // Simulates the horizontal distance the ball travels based on the hit angle.
  simulateDistance(thetaDeg) {
    const θ = this.toRadians(thetaDeg);
    const cosθ = Math.cos(θ);
    const sinθ = Math.sin(θ);

    // Calculate relative velocity of the racket impacting the ball
    const numerator =
      (this.#racketMass - this.#e * this.#ballMass) * this.#uracket * sinθ -
      this.#ballMass * this.#uball * cosθ;
    const denominator = this.#racketMass + this.#ballMass;
    const vRacket = numerator / denominator;

    // Calculate resulting ball velocity after impact
    const vBall =
      this.#uracket + this.#e * this.#uball * cosθ + this.#e * this.#uracket * sinθ;

    // Compute launch angle (alpha) after impact using velocity vector components
    const tanAlpha = vBall / (this.#uball * sinθ);
    const alpha = Math.atan(tanAlpha);
    const diffAngle = alpha - θ;

    const cosDiff = Math.cos(diffAngle);
    const sinDiff = Math.sin(diffAngle);

    // Magnitude of combined initial velocity vector
    const magU = Math.sqrt(
      vBall * vBall + this.#uball * sinθ * (this.#uball * sinθ)
    );

    // Check if solution is physically possible (e.g. not negative inside sqrt)
    const underSqrt = (magU * sinDiff) ** 2 + 4 * this.#g * this.#h;
    if (underSqrt < 0 || isNaN(magU)) return "Impossible";

    // Time in the air using kinematic equations
    const time = (magU * sinDiff + Math.sqrt(underSqrt)) / (2 * this.#g);

    // Horizontal distance traveled = velocity * time
    const distance = magU * cosDiff * time;

    if (isNaN(distance) || !isFinite(distance)) return "Impossible";
    return distance;
  }

  // Finds all possible launch angles that allow the ball to reach the target distance within a given tolerance.
  findBestAngle(targetDistance, tolerance = 0.05) {
    const matchingAngles = [];

    // Test all angles from 1 to 90 degrees
    for (let theta = 1; theta <= 90; theta++) {
      const distance = this.simulateDistance(theta);
      if (distance === "Impossible") continue;

      if (Math.abs(distance - targetDistance) <= tolerance) {
        matchingAngles.push(theta);
      }
    }

    if (matchingAngles.length === 0) return "Impossible";

    // Group contiguous angles into ranges
    const ranges = [];
    let start = matchingAngles[0];

    for (let i = 1; i < matchingAngles.length; i++) {
      if (matchingAngles[i] !== matchingAngles[i - 1] + 1) {
        ranges.push({ min: start, max: matchingAngles[i - 1] });
        start = matchingAngles[i];
      }
    }

    // Add the last range
    ranges.push({ min: start, max: matchingAngles[matchingAngles.length - 1] });
    return ranges;
  }

  // Calculates the angle in degrees from a vector (dx, dy) relative to the leftward horizontal.
  FindRotationAngle(dx, dy) {
    const angleRad = Math.atan2(dy, dx);
    let angleDeg = (angleRad * 180) / Math.PI;

    // Set leftward (180°) as 0° reference
    angleDeg = angleDeg - 180;

    // Normalize angle to range [-90°, 90°]
    if (angleDeg > 90) {
      angleDeg = angleDeg - 360;
    } else if (angleDeg < -90) {
      angleDeg = angleDeg + 360;
    }

    return angleDeg;
  }
}
