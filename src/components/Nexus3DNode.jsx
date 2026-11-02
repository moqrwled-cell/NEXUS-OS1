import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Shield, Lock, FileCheck2, Cpu } from 'lucide-react';

export default function Nexus3DNode() {
  const mountRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [activeMetric, setActiveMetric] = useState('audit');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 440;
    let height = container.clientHeight || 440;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    // 2. High-Precision WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 3. Lighting Rig (Institutional Emerald & Titanium Cold Accents)
    const ambientLight = new THREE.AmbientLight(0x0e1726, 2.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x10b981, 4.0); // Vivid Emerald
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 2.5); // Forensic Cyan
    dirLight2.position.set(-6, -5, -4);
    scene.add(dirLight2);

    const coreLight = new THREE.PointLight(0x34d399, 4.5, 12);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Master Rotation Assembly
    const masterAssembly = new THREE.Group();
    scene.add(masterAssembly);

    // =========================================================================
    // A. CENTRAL FORENSIC LEGAL VAULT (Geometric Cryptographic Cage)
    // =========================================================================
    const vaultGroup = new THREE.Group();
    masterAssembly.add(vaultGroup);

    // 1. Outer Faceted Wireframe Cage (Icosahedron Shield)
    const cageGeom = new THREE.IcosahedronGeometry(2.1, 0);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.38
    });
    const cageMesh = new THREE.Mesh(cageGeom, cageMat);
    vaultGroup.add(cageMesh);

    // 2. Corner Joint Nodes (Spheres on vertices)
    const nodeGeom = new THREE.SphereGeometry(0.045, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const posAttr = cageGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const node = new THREE.Mesh(nodeGeom, nodeMat);
      node.position.fromBufferAttribute(posAttr, i);
      vaultGroup.add(node);
    }

    // 3. Inner Translucent Dodecahedron Glass Core
    const coreGeom = new THREE.DodecahedronGeometry(1.4, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x062820,
      roughness: 0.15,
      metalness: 0.9,
      transparent: true,
      opacity: 0.72,
      emissive: 0x064e3b,
      emissiveIntensity: 0.35
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    vaultGroup.add(coreMesh);

    // 4. Central Solid Nucleus (The In-RAM Diligence Anchor)
    const nucleusGeom = new THREE.OctahedronGeometry(0.55, 0);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0x6ee7b7,
      wireframe: true
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeom, nucleusMat);
    vaultGroup.add(nucleusMesh);

    // =========================================================================
    // B. DUAL PROCEDURAL 3D CONTRACT PLATES (Baseline vs Redline Comparative)
    // =========================================================================
    const createContractCanvas = (isRedline = false) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');

      // Slate dark parchment background
      ctx.fillStyle = '#060B10';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Fine border
      ctx.strokeStyle = isRedline ? 'rgba(52, 211, 153, 0.6)' : 'rgba(6, 182, 212, 0.6)';
      ctx.lineWidth = 6;
      ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);

      // Header Banner
      ctx.fillStyle = isRedline ? 'rgba(16, 185, 129, 0.25)' : 'rgba(6, 182, 212, 0.2)';
      ctx.fillRect(24, 28, canvas.width - 48, 48);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(isRedline ? 'COUNTERPARTY MARKUP · REV-B' : 'MASTER AGREEMENT · BASELINE', 40, 60);

      // Paragraph lines simulation
      const lineCount = 18;
      for (let i = 0; i < lineCount; i++) {
        const y = 110 + i * 32;
        const lineLen = (i % 5 === 0) ? 260 : (i % 3 === 0) ? 380 : 440;

        if (isRedline && (i === 4 || i === 9 || i === 13)) {
          // Highlighted redline deletion/addition block
          ctx.fillStyle = (i === 9) ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.4)';
          ctx.fillRect(36, y - 10, lineLen, 18);
          
          ctx.fillStyle = (i === 9) ? '#FCA5A5' : '#6EE7B7';
          ctx.font = 'bold 15px monospace';
          ctx.fillText((i === 9) ? '[-] STEALTH CARVE-OUT STRICKEN' : '[+] MANDATORY MUTUAL INDEMNITY', 44, y + 4);
        } else {
          // Normal clean contractual clauses
          ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
          ctx.fillRect(36, y - 4, lineLen, 7);
        }
      }

      // Institutional Forensic Seal at bottom
      ctx.fillStyle = isRedline ? '#10B981' : '#06B6D4';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(isRedline ? 'AST DIFFERENTIAL: CERTIFIED' : 'SHA-256 HASH: 9E4F...8B12', 40, 680);

      return new THREE.CanvasTexture(canvas);
    };

    const docGeom = new THREE.BoxGeometry(1.65, 2.3, 0.035);

    // Plate 1: Baseline Contract
    const docTex1 = createContractCanvas(false);
    const docMat1 = new THREE.MeshStandardMaterial({
      map: docTex1,
      roughness: 0.3,
      metalness: 0.4,
      transparent: true,
      opacity: 0.88
    });
    const docMesh1 = new THREE.Mesh(docGeom, docMat1);
    docMesh1.position.set(-1.35, 0.15, 0.45);
    docMesh1.rotation.set(0.1, 0.4, -0.05);
    masterAssembly.add(docMesh1);

    // Plate 2: Counterparty Redline
    const docTex2 = createContractCanvas(true);
    const docMat2 = new THREE.MeshStandardMaterial({
      map: docTex2,
      roughness: 0.3,
      metalness: 0.4,
      transparent: true,
      opacity: 0.88
    });
    const docMesh2 = new THREE.Mesh(docGeom, docMat2);
    docMesh2.position.set(1.35, -0.15, -0.45);
    docMesh2.rotation.set(-0.1, -0.38, 0.05);
    masterAssembly.add(docMesh2);

    // =========================================================================
    // C. DYNAMIC FORENSIC SCANNING LASER BEAM (350ms AST Audit Simulation)
    // =========================================================================
    const laserGroup = new THREE.Group();
    masterAssembly.add(laserGroup);

    const laserBarGeom = new THREE.CylinderGeometry(0.02, 0.02, 4.4, 16);
    laserBarGeom.rotateZ(Math.PI / 2);
    const laserBarMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.95
    });
    const laserBar = new THREE.Mesh(laserBarGeom, laserBarMat);
    laserGroup.add(laserBar);

    // Laser Sheet Fan Plane
    const laserPlaneGeom = new THREE.PlaneGeometry(4.4, 0.35);
    const laserPlaneMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide
    });
    const laserPlane = new THREE.Mesh(laserPlaneGeom, laserPlaneMat);
    laserPlane.rotation.x = Math.PI / 2;
    laserGroup.add(laserPlane);

    // =========================================================================
    // D. PRECISION GIMBAL RINGS (Institutional Gyroscopic Perimeter)
    // =========================================================================
    const ring1Geom = new THREE.TorusGeometry(3.05, 0.018, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.45
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    masterAssembly.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(2.7, 0.014, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      metalness: 0.85,
      roughness: 0.2,
      transparent: true,
      opacity: 0.35
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    masterAssembly.add(ring2);

    // Outer Calibrated Tick Ring
    const ring3Geom = new THREE.TorusGeometry(3.4, 0.012, 16, 140);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16
    });
    const ring3 = new THREE.Mesh(ring3Geom, ring3Mat);
    masterAssembly.add(ring3);

    // =========================================================================
    // E. FLOATING TELEMETRY PARTICLES (Cryptographic Entropy Seeds)
    // =========================================================================
    const particleCount = 75;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i] = radius * Math.cos(phi) * Math.sin(theta);
      particlePositions[i + 1] = radius * Math.sin(phi);
      particlePositions[i + 2] = radius * Math.cos(phi) * Math.cos(theta);
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.045,
      transparent: true,
      opacity: 0.65
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    masterAssembly.add(particles);

    // =========================================================================
    // F. MOUSE PARALLAX & ANIMATION LOOP
    // =========================================================================
    let targetRotX = 0.15;
    let targetRotY = -0.3;
    let currentRotX = 0.15;
    let currentRotY = -0.3;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      targetRotY = x * 0.65;
      targetRotX = -y * 0.45;
    };

    container.addEventListener('pointermove', onPointerMove);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Inertial Interpolation (Lerp)
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      // Base Gentle Continuous Rotation
      masterAssembly.rotation.x = currentRotX + Math.sin(elapsedTime * 0.4) * 0.04;
      masterAssembly.rotation.y = currentRotY + elapsedTime * 0.18;

      // Vault Core Self-Rotation & Pulsing
      vaultGroup.rotation.x = elapsedTime * 0.35;
      vaultGroup.rotation.y = -elapsedTime * 0.45;
      nucleusMesh.rotation.z = elapsedTime * 1.2;

      // Scanning Laser Vertical Sweep across Contracts
      const scanY = Math.sin(elapsedTime * 2.4) * 1.05;
      laserGroup.position.y = scanY;

      // Counter-rotating Gimbal Rings
      ring1.rotation.z = elapsedTime * 0.12;
      ring2.rotation.x = -elapsedTime * 0.15;
      ring3.rotation.z = -elapsedTime * 0.08;

      // Document Plates Gentle Organic Hover
      docMesh1.position.y = 0.15 + Math.sin(elapsedTime * 1.5) * 0.05;
      docMesh2.position.y = -0.15 + Math.cos(elapsedTime * 1.5) * 0.05;

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    // =========================================================================
    // G. RESPONSIVE RESIZE HANDLING & CLEANUP
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
      resizeObserver.disconnect();

      // Deep Disposal of WebGL Resources
      renderer.dispose();
      cageGeom.dispose();
      cageMat.dispose();
      nodeGeom.dispose();
      nodeMat.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      nucleusGeom.dispose();
      nucleusMat.dispose();
      docGeom.dispose();
      docMat1.dispose();
      docMat2.dispose();
      docTex1.dispose();
      docTex2.dispose();
      laserBarGeom.dispose();
      laserBarMat.dispose();
      laserPlaneGeom.dispose();
      laserPlaneMat.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
      ring3Geom.dispose();
      ring3Mat.dispose();
      particleGeom.dispose();
      particleMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      className="w-full h-full relative flex items-center justify-center select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ minHeight: '440px' }}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Ambient Radial Gradient Depth (Under the 3D model) */}
      <div className="absolute w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none -z-10" />

      {/* Floating Institutional Status Tags */}
      <div className="absolute top-2 left-3 flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#090D14]/85 border border-white/10 backdrop-blur-md shadow-lg pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-wider">
          Forensic Core · Online
        </span>
      </div>

      <div className="absolute top-2 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#090D14]/85 border border-white/10 backdrop-blur-md shadow-lg pointer-events-none text-[10px] font-mono text-emerald-400">
        <Cpu size={12} className="text-emerald-400" />
        <span>100% Client In-RAM</span>
      </div>

      {/* Active Scan Telemetry Micro-Indicator */}
      <div className="absolute top-11 right-3 hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#090D14]/85 border border-white/10 text-[10px] font-mono text-zinc-400 pointer-events-none">
        <span className="text-emerald-400 font-semibold">AST DUAL-SCAN</span>
        <span>·</span>
        <span>350ms</span>
      </div>

      {/* Permanent ABA Rule 1.6 Privileged Legal Shield Badge */}
      <div className="absolute bottom-2 px-3.5 py-1.5 rounded-lg bg-[#090D14]/90 border border-emerald-500/30 text-[10.5px] font-mono text-emerald-300 flex items-center gap-2 shadow-2xl backdrop-blur-md pointer-events-none">
        <Shield size={13} className="text-emerald-400 shrink-0" />
        <span>LOCAL IN-RAM FORENSIC ENGINE · 0 CLOUD TELEMETRY · ABA RULE 1.6 PRIVILEGED</span>
      </div>
    </div>
  );
}
