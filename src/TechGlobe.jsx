import { useRef, useMemo, useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── Load an image URL (including SVG) into a Three.js texture ────────
function useSvgTexture(url) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Draw onto a canvas so SVGs become raster textures
      const size = 256;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size, size);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      setTexture(tex);
    };
    img.src = url;

    return () => { img.onload = null; };
  }, [url]);

  return texture;
}

// ── Custom holographic icon shader material ──────────────────────────
const HoloIconMaterial = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-mvPos.xyz);
      gl_Position = projectionMatrix * mvPos;
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uGlow;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewDir;

    void main() {
      vec4 tex = texture2D(uTexture, vUv);

      // Fresnel rim glow — stronger at edges for holographic feel
      float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.5);

      // Holographic color shift — aurora cyan/violet/magenta at the rim
      vec3 holoColor = vec3(
        0.55 + 0.30 * sin(uTime * 1.2 + fresnel * 6.0),
        0.40 + 0.25 * sin(uTime * 1.5 + fresnel * 6.0 + 2.094),
        0.95 + 0.05 * sin(uTime * 1.0 + fresnel * 6.0 + 4.189)
      );

      // Keep original texture colors dominant — only blend at edges
      vec3 color = mix(tex.rgb, holoColor, fresnel * 0.25);

      // Slight brightness boost to make icons pop
      color *= 1.1;

      // Add holographic glow only at the rim edges
      color += holoColor * fresnel * uGlow * 0.4;

      // Very subtle scanline
      float scanline = 0.97 + 0.03 * sin(vUv.y * 60.0 + uTime * 2.0);
      color *= scanline;

      // Alpha: keep texture alpha, add subtle rim
      float alpha = tex.a * (0.9 + fresnel * 0.3);

      gl_FragColor = vec4(color, alpha);
    }
  `,
};

// ── Fibonacci sphere distribution ────────────────────────────────────
function fibonacciSphere(count, radius) {
  const points = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius
      )
    );
  }
  return points;
}

// ── Single 3D holographic icon (floats inside the sphere) ────────────
function HoloIcon({ basePosition, texturePath, index, maxRadius, isMobile }) {
  const texture = useSvgTexture(texturePath);
  const matRef = useRef();
  const meshRef = useRef();

  const worldPos = useMemo(() => new THREE.Vector3(), []);
  const base = useMemo(() => new THREE.Vector3(...basePosition), [basePosition]);

  // Each icon gets unique animation offsets so they don't move in sync
  const offsets = useMemo(() => ({
    freqX: 0.15 + (index % 7) * 0.04,
    freqY: 0.12 + (index % 5) * 0.05,
    freqZ: 0.18 + (index % 9) * 0.03,
    phaseX: index * 1.3,
    phaseY: index * 0.9,
    phaseZ: index * 1.7,
    ampX: 0.12 + (index % 3) * 0.04,
    ampY: 0.10 + (index % 4) * 0.03,
    ampZ: 0.11 + (index % 6) * 0.03,
  }), [index]);

  // Surface margin — icons stay this far inside the sphere surface
  const margin = 0.3;

  useFrame(({ clock, camera }) => {
    if (!meshRef.current) return;

    const t = clock.getElapsedTime();

    // Gentle floating offset from base position
    const dx = Math.sin(t * offsets.freqX + offsets.phaseX) * offsets.ampX;
    const dy = Math.cos(t * offsets.freqY + offsets.phaseY) * offsets.ampY;
    const dz = Math.sin(t * offsets.freqZ + offsets.phaseZ) * offsets.ampZ;

    const nx = base.x + dx;
    const ny = base.y + dy;
    const nz = base.z + dz;

    // Clamp to stay inside the sphere
    const dist = Math.sqrt(nx * nx + ny * ny + nz * nz);
    const clampedRadius = maxRadius - margin;
    if (dist > clampedRadius) {
      const scale = clampedRadius / dist;
      meshRef.current.position.set(nx * scale, ny * scale, nz * scale);
    } else {
      meshRef.current.position.set(nx, ny, nz);
    }

    // Always face the camera
    meshRef.current.getWorldPosition(worldPos);
    meshRef.current.lookAt(camera.position);

    // Update shader time for holographic animation
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
    }
  });

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uGlow: { value: 0.6 },
      },
      vertexShader: HoloIconMaterial.vertexShader,
      fragmentShader: HoloIconMaterial.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    [texture]
  );

  // Update texture uniform when it loads
  useEffect(() => {
    if (matRef.current && texture) {
      matRef.current.uniforms.uTexture.value = texture;
    }
  }, [texture]);

  // Don't render until texture is loaded
  if (!texture) return null;

  // Flat plane facing camera — the shader handles the 3D holographic depth
  const iconSize = isMobile ? 0.675 : 0.45; // 25% larger on mobile (0.54 * 1.25)
  return (
    <mesh ref={meshRef} position={basePosition}>
      <planeGeometry args={[iconSize, iconSize, 1, 1]} />
      <shaderMaterial ref={matRef} attach="material" args={[shaderArgs]} />
    </mesh>
  );
}

// ── Glow ring particles orbiting the sphere ──────────────────────────
function GlowParticles({ count = 120, radius, color = '#7c5cff', size = 0.025, opacity = 0.5, spinSpeed = 0.08, tiltSpeed = 0.3 }) {
  const ref = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 0.3;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      positions[i * 3 + 2] = Math.cos(phi) * r;
    }
    return positions;
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * spinSpeed;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * tiltSpeed) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particles}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ── Invisible drag sphere for pointer interaction ────────────────────
function DragSphere({ radius, onDragStart, onDrag, onDragEnd }) {
  return (
    <mesh
      onPointerDown={(e) => {
        e.stopPropagation();
        e.target.setPointerCapture(e.pointerId);
        onDragStart(e);
      }}
      onPointerMove={(e) => {
        e.stopPropagation();
        onDrag(e);
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        e.target.releasePointerCapture(e.pointerId);
        onDragEnd(e);
      }}
    >
      <sphereGeometry args={[radius, 16, 16]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

// ── Main rotating scene ──────────────────────────────────────────────
function RotatingScene({ icons, pinchDrag, isMobile, isARMode }) {
  const groupRef = useRef();
  const { pointer } = useThree();

  const SPHERE_RADIUS = 2.7;

  // Drag state refs
  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const dragVelocity = useRef({ x: 0, y: 0 });
  const prevPinch = useRef(null);

  // Place icons inside the sphere (at ~65% of the radius)
  const positions = useMemo(
    () => fibonacciSphere(icons.length, SPHERE_RADIUS * 0.65),
    [icons.length]
  );

  // Drag handlers
  const onDragStart = useCallback((e) => {
    isDragging.current = true;
    prevPointer.current = { x: e.point.x, y: e.point.y };
    dragVelocity.current = { x: 0, y: 0 };
  }, []);

  const onDrag = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.point.x - prevPointer.current.x;
    const dy = e.point.y - prevPointer.current.y;
    dragVelocity.current = { x: dx * 1.5, y: dy * 1.5 };
    prevPointer.current = { x: e.point.x, y: e.point.y };
  }, []);

  const onDragEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    // ── AR pinch drag ──
    // In AR mode, only pinching moves the globe — no auto-spin, no mouse drag,
    // no hover tilt. The globe holds its last orientation between pinches.
    if (pinchDrag && pinchDrag.active) {
      if (prevPinch.current) {
        const dx = (pinchDrag.x - prevPinch.current.x) * 0.008;
        const dy = (pinchDrag.y - prevPinch.current.y) * 0.008;
        groupRef.current.rotation.y += dx;
        groupRef.current.rotation.x += dy;
      }
      prevPinch.current = { x: pinchDrag.x, y: pinchDrag.y };
    } else {
      prevPinch.current = null;
    }

    if (isARMode) return;

    // ── Mouse drag rotation (non-AR only) ──
    if (isDragging.current) {
      groupRef.current.rotation.y += dragVelocity.current.x;
      groupRef.current.rotation.x += dragVelocity.current.y;
      // Dampen velocity while dragging for smoothness
      dragVelocity.current.x *= 0.8;
      dragVelocity.current.y *= 0.8;
    } else {
      // Apply remaining momentum after release
      if (Math.abs(dragVelocity.current.x) > 0.0001 || Math.abs(dragVelocity.current.y) > 0.0001) {
        groupRef.current.rotation.y += dragVelocity.current.x;
        groupRef.current.rotation.x += dragVelocity.current.y;
        dragVelocity.current.x *= 0.95;
        dragVelocity.current.y *= 0.95;
      }

      // Auto-rotation when not dragging and no momentum
      if (Math.abs(dragVelocity.current.x) < 0.0001) {
        groupRef.current.rotation.y += 0.003;
      }

      // Gentle mouse-hover tilt (only when not dragging)
      const targetTiltX = pointer.y * 0.15;
      groupRef.current.rotation.x += (targetTiltX - groupRef.current.rotation.x) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Invisible interaction sphere for drag — disabled in AR mode so only
          pinch gestures (handled in useFrame above) can move the globe */}
      {!isARMode && (
        <DragSphere
          radius={SPHERE_RADIUS + 0.3}
          onDragStart={onDragStart}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
        />
      )}

      {/* Outer wireframe sphere — containment shell */}
      <mesh>
        <sphereGeometry args={[SPHERE_RADIUS, 32, 32]} />
        <meshBasicMaterial
          color="#7c5cff"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>


      {/* Orbiting glow particles — aurora layers (violet + cyan + magenta) */}
      <GlowParticles count={150} radius={SPHERE_RADIUS} color="#7c5cff" size={0.025} opacity={0.55} spinSpeed={0.08} tiltSpeed={0.3} />
      <GlowParticles count={75}  radius={SPHERE_RADIUS} color="#5fdcff" size={0.022} opacity={0.45} spinSpeed={-0.06} tiltSpeed={0.22} />
      <GlowParticles count={50}  radius={SPHERE_RADIUS} color="#ff61d8" size={0.020} opacity={0.40} spinSpeed={0.05} tiltSpeed={0.18} />

      {/* 3D holographic icons floating inside */}
      {icons.map((iconSrc, i) => (
        <HoloIcon
          key={i}
          basePosition={positions[i].toArray()}
          texturePath={iconSrc}
          index={i}
          maxRadius={SPHERE_RADIUS}
          isMobile={isMobile}
        />
      ))}
    </group>
  );
}

// ── Exported component ───────────────────────────────────────────────
export default function TechGlobe({ icons, pinchDrag, isMobile, isARMode }) {
  return (
    <div className="tech-globe-container">
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#b6a8ff" />
        <pointLight position={[-5, -3, 3]} intensity={0.4} color="#5fdcff" />
        <pointLight position={[0, -4, 4]} intensity={0.25} color="#ff61d8" />
        <Suspense fallback={null}>
          <RotatingScene icons={icons} pinchDrag={pinchDrag} isMobile={isMobile} isARMode={isARMode} />
        </Suspense>
      </Canvas>
    </div>
  );
}
