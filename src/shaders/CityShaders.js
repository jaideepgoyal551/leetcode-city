/**
 * Neon GLSL shaders for cyberpunk building materials.
 */

// Vertex shader — passes UVs and world position
export const buildingVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// Fragment shader — animated windows + neon outline + fog
export const buildingFragmentShader = `
  uniform vec3 uBaseColor;
  uniform vec3 uEmissive;
  uniform float uEmissiveIntensity;
  uniform float uTime;
  uniform float uWindowLit;
  uniform float uHeight;
  uniform float uSelected;
  uniform float uFogDensity;

  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // Window grid pattern
  float windows(vec2 uv, float cols, float rows) {
    vec2 cell = fract(uv * vec2(cols, rows));
    vec2 edge = step(0.1, cell) * step(cell, vec2(0.9));
    float win = edge.x * edge.y;

    // Random lit windows based on time and position
    float id = floor(uv.x * cols) + floor(uv.y * rows) * cols;
    float lit = step(0.4, rand(vec2(id, floor(uTime * 0.05))));
    lit = max(lit, uWindowLit);
    return win * lit;
  }

  void main() {
    // Base building color
    vec3 color = uBaseColor * 0.3;

    // Lambertian lighting (fake directional)
    float diffuse = max(dot(vNormal, normalize(vec3(1.0, 2.0, 1.0))), 0.0) * 0.5 + 0.5;
    color *= diffuse;

    // Windows
    float win = windows(vUv, 4.0, 8.0);
    color += uEmissive * win * uEmissiveIntensity;

    // Top neon band
    float topBand = step(0.9, vUv.y);
    color += uEmissive * topBand * 1.5;

    // Bottom glow
    float bottomGlow = (1.0 - vUv.y) * 0.15;
    color += uBaseColor * bottomGlow;

    // Selection highlight pulse
    if (uSelected > 0.5) {
      float pulse = sin(uTime * 4.0) * 0.5 + 0.5;
      color += uEmissive * pulse * 0.8;
    }

    // Distance fog
    float dist = length(vWorldPosition.xz);
    float fog = exp(-dist * uFogDensity);
    vec3 fogColor = vec3(0.01, 0.01, 0.05);
    color = mix(fogColor, color, clamp(fog, 0.0, 1.0));

    gl_FragColor = vec4(color, 1.0);
  }
`

// Ground plane grid shader
export const groundVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const groundFragmentShader = `
  uniform float uTime;
  uniform vec3 uGridColor;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    // World-space grid
    vec2 grid = abs(fract(vWorldPos.xz * 0.25 - 0.5) - 0.5) / fwidth(vWorldPos.xz * 0.25);
    float line = min(grid.x, grid.y);
    float gridAlpha = 1.0 - min(line, 1.0);

    // Distance fade
    float dist = length(vWorldPos.xz);
    float fade = exp(-dist * 0.008);

    // Animated pulse outward
    float pulse = sin(dist * 0.05 - uTime * 1.5) * 0.5 + 0.5;
    pulse *= exp(-dist * 0.015);

    vec3 color = uGridColor * (gridAlpha + pulse * 0.3) * fade;
    float alpha = (gridAlpha * 0.6 + pulse * 0.15) * fade;

    gl_FragColor = vec4(color, alpha);
  }
`

// Tower holographic shader
export const towerFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uRating;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    // Holographic stripes
    float stripe = step(0.5, fract(vUv.y * 20.0 - uTime * 0.5));
    vec3 color = uColor * (0.6 + stripe * 0.4);

    // Fresnel rim glow
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.0);
    color += uColor * fresnel * 1.5;

    // Rating tier glow bands
    float band = step(0.0, sin(vUv.y * 30.0 - uTime * 2.0));
    color += uColor * band * 0.2;

    float alpha = 0.7 + fresnel * 0.3;
    gl_FragColor = vec4(color, alpha);
  }
`
