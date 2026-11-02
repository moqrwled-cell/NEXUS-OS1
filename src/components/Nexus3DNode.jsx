import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShieldCheck, Lock } from 'lucide-react';

export default function Nexus3DNode() {
  const mountRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 440;
    let height = container.clientHeight || 440;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    // 2. High-Precision WebGL Renderer (Clean & Smooth)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Studio Lighting Rig (Museum-Grade Soft Highlighting)
    const ambientLight = new THREE.AmbientLight(0x0a141d, 2.8);
    scene.add(ambientLight);

    // Main Studio Key Light (Pure White Specular)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(4, 6, 6);
    scene.add(keyLight);

    // Subtle Emerald Rim Light (Authoritative Brand Accent)
    const rimLight = new THREE.DirectionalLight(0x10b981, 3.0);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    // Soft Cyan Fill Light
    const fillLight = new THREE.DirectionalLight(0x06b6d4, 1.4);
    fillLight.position.set(0, -5, 4);
    scene.add(fillLight);

    // Subtle Internal Core Point Light
    const corePoint = new THREE.PointLight(0x34d399, 2.5, 6);
    corePoint.position.set(0, 0, 0.4);
    scene.add(corePoint);

    // =========================================================================
    // MASTER ASSEMBLY: SOLID INSTITUTIONAL GUARDIAN SHIELD
    // =========================================================================
    const masterAssembly = new THREE.Group();
    scene.add(masterAssembly);

    // Create Shield Contour
    const createShieldShape = (scale = 1.0) => {
      const shape = new THREE.Shape();
      const s = scale;
      shape.moveTo(0, 2.2 * s);
      shape.quadraticCurveTo(1.4 * s, 2.1 * s, 1.65 * s, 1.75 * s);
      shape.lineTo(1.65 * s, 0.35 * s);
      shape.quadraticCurveTo(1.55 * s, -1.05 * s, 0, -2.25 * s);
      shape.quadraticCurveTo(-1.55 * s, -1.05 * s, -1.65 * s, 0.35 * s);
      shape.lineTo(-1.65 * s, 1.75 * s);
      shape.quadraticCurveTo(-1.4 * s, 2.1 * s, 0, 2.2 * s);
      return shape;
    };

    // 1. Primary Solid Beveled Shield (Titanium & Deep Obsidian Finish)
    const outerShape = createShieldShape(1.0);
    const outerGeom = new THREE.ExtrudeGeometry(outerShape, {
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.08,
      bevelSegments: 8
    });
    outerGeom.computeVertexNormals();

    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x090f15,
      metalness: 0.92,
      roughness: 0.22,
      envMapIntensity: 1.0
    });
    const outerShield = new THREE.Mesh(outerGeom, outerMat);
    outerShield.position.z = -0.09;
    masterAssembly.add(outerShield);

    // 2. Beveled Inner Medallion (Smoked Frosted Emerald Plate)
    const innerShape = createShieldShape(0.82);
    const innerGeom = new THREE.ExtrudeGeometry(innerShape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 5
    });
    innerGeom.computeVertexNormals();

    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x062820,
      metalness: 0.8,
      roughness: 0.28,
      emissive: 0x054f3c,
      emissiveIntensity: 0.25
    });
    const innerShield = new THREE.Mesh(innerGeom, innerMat);
    innerShield.position.z = 0.08;
    masterAssembly.add(innerShield);

    // 3. Central Emblem: Precision Scales of Justice / Legal Diamond
    const emblemGroup = new THREE.Group();
    emblemGroup.position.set(0, 0.05, 0.22);
    masterAssembly.add(emblemGroup);

    // Emblem Center Fulcrum Column
    const fulcrumGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 16);
    const emblemMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x10b981,
      emissiveIntensity: 0.15
    });
    const fulcrum = new THREE.Mesh(fulcrumGeom, emblemMat);
    emblemGroup.add(fulcrum);

    // Horizontal Balance Beam
    const beamGeom = new THREE.CylinderGeometry(0.03, 0.03, 1.3, 16);
    beamGeom.rotateZ(Math.PI / 2);
    const beam = new THREE.Mesh(beamGeom, emblemMat);
    beam.position.y = 0.45;
    emblemGroup.add(beam);

    // Left Scale Pan Assembly
    const panGeom = new THREE.ConeGeometry(0.24, 0.12, 16, 1, true);
    panGeom.rotateX(Math.PI);
    const leftPan = new THREE.Mesh(panGeom, emblemMat);
    leftPan.position.set(-0.55, 0.1, 0);
    emblemGroup.add(leftPan);

    const leftStringGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.35, 8);
    const leftString = new THREE.Mesh(leftStringGeom, emblemMat);
    leftString.position.set(-0.55, 0.28, 0);
    emblemGroup.add(leftString);

    // Right Scale Pan Assembly
    const rightPan = new THREE.Mesh(panGeom, emblemMat);
    rightPan.position.set(0.55, 0.1, 0);
    emblemGroup.add(rightPan);

    const rightString = new THREE.Mesh(leftStringGeom, emblemMat);
    rightString.position.set(0.55, 0.28, 0);
    emblemGroup.add(rightString);

    // Top Crown Finial (Diamond Node)
    const crownGeom = new THREE.OctahedronGeometry(0.12, 0);
    const crownMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const crown = new THREE.Mesh(crownGeom, crownMat);
    crown.position.y = 0.65;
    emblemGroup.add(crown);

    // 4. Subtle Outer Precision Halo Ring (Thin Hairline)
    const haloGeom = new THREE.TorusGeometry(2.7, 0.008, 16, 120);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.3
    });
    const haloRing = new THREE.Mesh(haloGeom, haloMat);
    masterAssembly.add(haloRing);

    // =========================================================================
    // SMOOTH CALM MOUSE INTERACTION & ANIMATION
    // =========================================================================
    let targetRotX = 0.0;
    let targetRotY = 0.0;
    let currentRotX = 0.0;
    let currentRotY = 0.0;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      targetRotY = x * 0.45; // Max 25 degrees tilt
      targetRotX = -y * 0.3;
    };

    const onPointerLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Fluid, gentle lerp (quiet luxury feel)
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      // Soft, meditative breathing float
      masterAssembly.position.y = Math.sin(t * 1.1) * 0.06;
      
      // Gentle subtle idle oscillation
      const idleYaw = Math.sin(t * 0.45) * 0.16;
      const idlePitch = Math.cos(t * 0.6) * 0.05;

      masterAssembly.rotation.x = currentRotX + idlePitch;
      masterAssembly.rotation.y = currentRotY + idleYaw;

      // Subtle dynamic glimmer on balance pans
      const panTilt = Math.sin(t * 1.8) * 0.03;
      beam.rotation.z = panTilt;
      leftPan.position.y = 0.1 + panTilt * 0.4;
      rightPan.position.y = 0.1 - panTilt * 0.4;

      // Halo ring gentle slow spin
      haloRing.rotation.z = t * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // =========================================================================
    // RESPONSIVE RESIZE & CLEANUP
    // =========================================================================
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      resizeObserver.disconnect();

      // Memory Disposal
      renderer.dispose();
      outerGeom.dispose();
      outerMat.dispose();
      innerGeom.dispose();
      innerMat.dispose();
      fulcrumGeom.dispose();
      beamGeom.dispose();
      panGeom.dispose();
      leftStringGeom.dispose();
      emblemMat.dispose();
      crownGeom.dispose();
      crownMat.dispose();
      haloGeom.dispose();
      haloMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      className="w-full h-full relative flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ minHeight: '440px' }}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Very Soft, Calm Ambient Backlight (Zero neon noise) */}
      <div className="absolute w-72 h-72 rounded-full bg-emerald-500/8 blur-[110px] pointer-events-none -z-10" />

      {/* Single Clean, Calm, Elegant Telemetry Capsule (Quiet Luxury) */}
      <div className="absolute bottom-3 px-4 py-1.5 rounded-full bg-[#090D14]/90 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-2 shadow-xl backdrop-blur-md pointer-events-none">
        <ShieldCheck size={14} className="text-emerald-400" />
        <span>Nexus ContractGuard™</span>
        <span className="text-zinc-600">·</span>
        <span className="text-emerald-400 font-medium">In-RAM Diligence Shield</span>
      </div>
    </div>
  );
}
