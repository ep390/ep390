'use client';

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import * as THREE from 'three';
import GUI from 'lil-gui';

export default function DualHandTheremin() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('请点击屏幕启动声音');
  const [overlayPos, setOverlayPos] = useState({ left: null, right: null });

  // 音频
  const oscillatorRef = useRef(null);
  const isPlayingRef = useRef(false);

  // 手势位置 (左右手)
  const handsDataRef = useRef({
    left: null,  // { x, y } 控制音量
    right: null, // { x, y } 控制音高
  });
  const pinchRef = useRef(0.5); // 0=捏合，1=张开

  // Three.js
  const sceneRef = useRef(null);
  const particlesRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const requestRef = useRef(null);
  const leftRingRef = useRef(null);
  const rightRingRef = useRef(null);
  const initialPositionsRef = useRef(null);
  const params = useRef({ model: 'heart', color: '#ff66cc' });
  const guiRef = useRef(null);

  // MediaPipe
  const initMediaPipeRef = useRef(null);
  const [mediaPipeReady, setMediaPipeReady] = useState(false);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  // --- 初始化音频 ---
  const initAudio = async () => {
    if (typeof window.Tone === 'undefined') {
      setStatus('音频库未加载...');
      return;
    }
    await window.Tone.start();
    const ctx = window.Tone.context;
    if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
    if (oscillatorRef.current) return;

    const osc = new window.Tone.Oscillator({
      type: 'sine',
      frequency: 440,
      volume: -60, // 初始静音，等待左手抬起
    }).toDestination();

    osc.start();
    oscillatorRef.current = osc;
    isPlayingRef.current = true;
    setStatus('🖐️ 右手控制音调 | 🤚 左手控制音量');
  };

  // --- 动画循环：音频 + 视觉 ---
  const animate = () => {
    const leftHand = handsDataRef.current.left;
    const rightHand = handsDataRef.current.right;
    // 统一在顶层计算音高/音量因子，供后续音频与视觉使用
    const pitchFactor = leftHand ? (1 - leftHand.y) : 0.5; // 左手控制音高
    const volFactor = rightHand ? (1 - rightHand.y) : 0.2;  // 右手控制音量

    // 音频控制（交换：左手音调，右手音量）
    if (oscillatorRef.current && isPlayingRef.current && window.Tone) {
      // 左手 -> 音调
      if (leftHand) {
        const freq = 200 + (1 - leftHand.y) * 800; // 200~1000Hz
        oscillatorRef.current.frequency.rampTo(freq, 0.1);
      }
      // 右手 -> 音量
      if (rightHand) {
        const vol = -60 + (1 - rightHand.y) * 50; // -60~ -10 dB
        oscillatorRef.current.volume.rampTo(vol, 0.1);
      } else {
        oscillatorRef.current.volume.rampTo(-60, 0.5);
      }
    }

    // 视觉控制：粒子 + 光环
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      const colors = particlesRef.current.geometry.attributes.color
        ? particlesRef.current.geometry.attributes.color.array
        : null;
      const time = Date.now() * 0.002;

      let targetX = 0;
      let targetY = 0;
      let hasTarget = false;

      if (rightHand) {
        targetX = (rightHand.x - 0.5) * 10;
        targetY = (0.5 - rightHand.y) * 8;
        hasTarget = true;
      } else if (leftHand) {
        targetX = (leftHand.x - 0.5) * 10;
        targetY = (0.5 - leftHand.y) * 8;
        hasTarget = true;
      }

      // 现在左手控制音调，右手控制音量
      const hue = leftHand ? leftHand.y : 0.5;
      const spread = rightHand ? (1 - rightHand.y) : 0.2;
      // 爆炸力度：捏合 + 音高 + 音量
      const explosion =
        pinchRef.current * 2.0 +
        pitchFactor * 0.8 +
        volFactor * 0.6;
      const wobble = Math.sin(time * 4) * 0.5;

      const count = 4000;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const ox = Math.sin(i + time) * 0.5;
        const oy = Math.cos(i + time * 0.5) * 0.5;

        if (hasTarget) {
          const explodeFactor = 1 + explosion + wobble * 0.1;
          positions[i3] += (targetX * explodeFactor + ox * (1 + spread * 2) - positions[i3]) * 0.12;
          positions[i3 + 1] += (targetY * explodeFactor + oy * (1 + spread * 2) - positions[i3 + 1]) * 0.12;
        } else {
          positions[i3] += (ox * 5 - positions[i3]) * 0.02;
          positions[i3 + 1] += (oy * 5 - positions[i3 + 1]) * 0.02;
        }

        positions[i3 + 2] = ox;

        // 颜色随爆炸提亮（若有颜色属性）
        if (colors) {
          const l = 0.5 + spread * 0.4 + explosion * 0.1;
          const c = new THREE.Color().setHSL(hue, 1.0, Math.min(l, 0.9));
          colors[i3]     += (c.r - colors[i3]) * 0.12;
          colors[i3 + 1] += (c.g - colors[i3 + 1]) * 0.12;
          colors[i3 + 2] += (c.b - colors[i3 + 2]) * 0.12;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      if (colors) particlesRef.current.geometry.attributes.color.needsUpdate = true;
      else particlesRef.current.material.color.setHSL(hue, 1.0, 0.5 + spread * 0.4);

      // 背景旋转/力度与音量和音高联动，粒子尺寸随爆炸放大
      particlesRef.current.rotation.y += 0.002 + volFactor * 0.01;
      particlesRef.current.rotation.x += 0.001 + pitchFactor * 0.006;
      const mat = particlesRef.current.material;
      if (mat && mat.size !== undefined) {
        mat.size = 0.18 * (1 + explosion * 0.2);
      }
    }

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    // 更新 3D 光环位置与动画
    if (leftRingRef.current) {
      if (leftHand) {
        leftRingRef.current.visible = true;
        // 左手控制音调：位置跟随左手，颜色与缩放随音高
        leftRingRef.current.position.set((leftHand.x - 0.5) * 10, (0.5 - leftHand.y) * 8, 0);
        const huePitch = 0.95 - pitchFactor * 0.45;
        leftRingRef.current.material.color.setHSL(huePitch, 1.0, 0.5);
        const scale = 1 + pitchFactor * 0.8;
        leftRingRef.current.scale.set(scale, scale, scale);
        leftRingRef.current.rotation.z += 0.03;
      } else {
        leftRingRef.current.visible = false;
      }
    }
    if (rightRingRef.current) {
      if (rightHand) {
        rightRingRef.current.visible = true;
        // 右手控制音量：位置跟随右手，亮度随音量
        rightRingRef.current.position.set((rightHand.x - 0.5) * 10, (0.5 - rightHand.y) * 8, 0);
        const lightness = 0.35 + volFactor * 0.5;
        rightRingRef.current.material.color.setHSL(0.6, 0.8, Math.min(lightness, 0.9));
        const scale = 1 + volFactor * 0.6;
        rightRingRef.current.scale.set(scale, scale, scale);
        rightRingRef.current.rotation.x += 0.05;
        rightRingRef.current.rotation.y += 0.05;
      } else {
        rightRingRef.current.visible = false;
      }
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  // --- 形状计算 (支持 heart / flower / star / buddha / fireworks / galaxy / sphere) ---
  const calculateShape = (type, array, count) => {
    const tempVec = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      if (type === 'heart') {
        const t = Math.random() * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        const z = (Math.random() - 0.5) * 4;
        tempVec.set(x, y, z).multiplyScalar(0.05);
      } else if (type === 'flower') {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const k = 6;
        const r = Math.cos(k * theta) + 2;
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.cos(phi);
        const z = r * Math.sin(phi) * Math.sin(theta);
        tempVec.set(x, y, z).multiplyScalar(1.0);
      } else if (type === 'star') {
        const r = Math.pow(Math.random(), 3) * 4 + 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        let spike = Math.random() > 0.9 ? 2.5 : 1;
        tempVec.setFromSphericalCoords(r * spike, phi, theta);
      } else if (type === 'buddha') {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        const r = 2 + Math.cos(3 * u);
        const x = r * Math.cos(2 * u);
        const y = r * Math.sin(2 * u);
        const z = Math.sin(3 * u);
        const tubeR = 0.5 * Math.random();
        tempVec.set(x, y, z).multiplyScalar(0.8);
        tempVec.x += tubeR * Math.cos(v);
        tempVec.y += tubeR * Math.cos(v);
      } else if (type === 'fireworks') {
        const r = 4 * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        tempVec.setFromSphericalCoords(r, phi, theta);
      } else if (type === 'galaxy') {
        const spin = i * 0.02;
        const radius = Math.random() * 5;
        const angle = spin + radius;
        const x = Math.cos(angle) * radius;
        const y = (Math.random() - 0.5) * (radius * 0.5);
        const z = Math.sin(angle) * radius;
        tempVec.set(x, y, z);
      } else { // sphere
        const r = 2.5 * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        tempVec.setFromSphericalCoords(r, phi, theta);
      }
      array[i3] = tempVec.x;
      array[i3 + 1] = tempVec.y;
      array[i3 + 2] = tempVec.z;
    }
  };

  useEffect(() => {
    const handleStart = () => initAudio();
    document.addEventListener('click', handleStart);
    document.addEventListener('touchstart', handleStart);

    // Three.js Setup
    const initThree = () => {
      if (!containerRef.current) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
      camera.position.z = 5;
      cameraRef.current = camera;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const geometry = new THREE.BufferGeometry();
      const count = 5000;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      initialPositionsRef.current = new Float32Array(count * 3);
      calculateShape(params.current.model, initialPositionsRef.current, count);
      const baseColor = new THREE.Color(params.current.color);
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3]     = initialPositionsRef.current[i3];
        positions[i3 + 1] = initialPositionsRef.current[i3 + 1];
        positions[i3 + 2] = initialPositionsRef.current[i3 + 2];
        colors[i3]     = baseColor.r;
        colors[i3 + 1] = baseColor.g;
        colors[i3 + 2] = baseColor.b;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const sprite = new THREE.TextureLoader().load(
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/sprites/spark1.png'
      );
      const material = new THREE.PointsMaterial({
        size: 0.18,
        map: sprite,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const particles = new THREE.Points(geometry, material);
      particlesRef.current = particles;
      scene.add(particles);

      // 左手光环：蓝色圆环
      const ringGeo = new THREE.TorusGeometry(0.6, 0.03, 16, 50);
      const ringMatLeft = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
      const leftRing = new THREE.Mesh(ringGeo, ringMatLeft);
      leftRing.visible = false;
      leftRingRef.current = leftRing;
      scene.add(leftRing);

      // 右手光环：红色八面体
      const octaGeo = new THREE.OctahedronGeometry(0.6, 0);
      const ringMatRight = new THREE.MeshBasicMaterial({ color: 0xff0055, wireframe: true });
      const rightRing = new THREE.Mesh(octaGeo, ringMatRight);
      rightRing.visible = false;
      rightRingRef.current = rightRing;
      scene.add(rightRing);

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // GUI：形状与颜色
      const gui = new GUI({ title: '形状设置' });
      gui.domElement.style.position = 'absolute';
      gui.domElement.style.top = '10px';
      gui.domElement.style.right = '10px';
      guiRef.current = gui;

      gui.add(params.current, 'model', ['heart', 'flower', 'star', 'buddha', 'fireworks', 'galaxy', 'sphere'])
        .name('形状')
        .onChange((val) => {
          if (!initialPositionsRef.current) return;
          calculateShape(val, initialPositionsRef.current, count);
          const posAttr = geometry.getAttribute('position');
          const arr = posAttr.array;
          for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            arr[i3]     = initialPositionsRef.current[i3];
            arr[i3 + 1] = initialPositionsRef.current[i3 + 1];
            arr[i3 + 2] = initialPositionsRef.current[i3 + 2];
          }
          posAttr.needsUpdate = true;
        });

      gui.addColor(params.current, 'color')
        .name('粒子颜色')
        .onChange((val) => {
          const c = new THREE.Color(val);
          const colAttr = geometry.getAttribute('color');
          const arr = colAttr.array;
          for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            arr[i3] = c.r; arr[i3 + 1] = c.g; arr[i3 + 2] = c.b;
          }
          colAttr.needsUpdate = true;
        });

      return () => {
        window.removeEventListener('resize', handleResize);
        if (containerRef.current) containerRef.current.innerHTML = '';
        if (guiRef.current) guiRef.current.destroy();
      };
    };

    // MediaPipe Setup (双手)
    const initMediaPipe = async () => {
      if (!mediaPipeReady || !videoRef.current) return;
      try {
        const Hands = window.Hands;
        const Camera = window.Camera;
        const hands = new Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results) => {
          let newLeft = null;
          let newRight = null;

          if (results.multiHandLandmarks && results.multiHandedness) {
            for (let i = 0; i < results.multiHandLandmarks.length; i++) {
              const label = results.multiHandedness[i].label; // "Left" / "Right"
              const wrist = results.multiHandLandmarks[i][0];
              const pos = { x: 1 - wrist.x, y: wrist.y }; // 镜像 x

              // 计算该手的捏合程度，用于粒子膨胀
              const thumb = results.multiHandLandmarks[i][4];
              const indexTip = results.multiHandLandmarks[i][8];
              const d = Math.hypot(thumb.x - indexTip.x, thumb.y - indexTip.y);
              const pinch = THREE.MathUtils.clamp((d - 0.02) / (0.2 - 0.02), 0, 1);
              // 取右手的捏合为主，若没有右手用左手
              if (label === 'Right') pinchRef.current = pinch;
              if (!results.multiHandLandmarks.find((_, idx) => results.multiHandedness[idx].label === 'Right')) {
                pinchRef.current = pinch;
              }

              if (label === 'Left') newLeft = pos;
              else newRight = pos;
            }
          }

          handsDataRef.current = { left: newLeft, right: newRight };
          setOverlayPos({ left: newLeft, right: newRight });
        });

        const camera = new Camera(videoRef.current, {
          onFrame: async () => { await hands.send({ image: videoRef.current }); },
          width: 640, height: 480,
        });
        await camera.start();
        setLoading(false);
      } catch (e) {
        console.error(e);
        setStatus('摄像头启动失败');
      }
    };
    initMediaPipeRef.current = initMediaPipe;

    const cleanupThree = initThree();
    if (mediaPipeReady) initMediaPipe();
    animate();

    return () => {
      document.removeEventListener('click', handleStart);
      document.removeEventListener('touchstart', handleStart);
      cleanupThree && cleanupThree();
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.dispose();
      }
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [mediaPipeReady]);

  // 再次触发 MediaPipe
  useEffect(() => {
    if (mediaPipeReady && initMediaPipeRef.current) initMediaPipeRef.current();
  }, [mediaPipeReady]);

  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" strategy="lazyOnload" onLoad={() => window.Hands && window.Camera && setMediaPipeReady(true)} />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" strategy="lazyOnload" onLoad={() => window.Hands && window.Camera && setMediaPipeReady(true)} />
      <Script src="https://unpkg.com/tone@14.7.58/build/Tone.js" strategy="lazyOnload" />

      <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
        <div ref={containerRef} className="absolute inset-0 z-10" />
        <video ref={videoRef} className="hidden" playsInline muted />

        {/* 提示 UI */}
        <div className="absolute top-10 left-0 w-full flex justify-between px-10 text-white/50 text-sm z-20 pointer-events-none">
          <div>🤚 左手: 音量</div>
          <div>右手: 音高 🖐️</div>
        </div>

        {/* 全屏按钮 */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-6 right-6 z-30 px-3 py-2 rounded-full border border-white/20 bg-white/10 text-white text-xs backdrop-blur hover:bg-white/20 transition"
        >
          ⛶ Fullscreen
        </button>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center pointer-events-none z-20">
          {loading ? (
            <div className="bg-black/50 p-4 rounded-xl backdrop-blur">
              <p className="text-xl animate-pulse">正在初始化摄像头...</p>
            </div>
          ) : (
            <div className={`transition-opacity duration-1000 ${status.includes('控制') ? 'opacity-30' : 'opacity-100'}`}>
              <h1 className="text-2xl font-bold text-white mb-2">{status}</h1>
              <p className="text-sm text-gray-300">请举起双手：右手上下变调，左手上下变大声</p>
            </div>
          )}
        </div>

        {/* 手势指示圈 */}
        {!loading && (
          <>
            {overlayPos.left && (
              <div
                className="absolute w-16 h-16 rounded-full border-2 border-pink-400/80 bg-pink-400/10 backdrop-blur-sm pointer-events-none transition-transform duration-75"
                style={{
                  left: `${overlayPos.left.x * 100}%`,
                  top: `${overlayPos.left.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 30,
                }}
              />
            )}
            {overlayPos.right && (
              <div
                className="absolute w-16 h-16 rounded-full border-2 border-cyan-400/80 bg-cyan-400/10 backdrop-blur-sm pointer-events-none transition-transform duration-75"
                style={{
                  left: `${overlayPos.right.x * 100}%`,
                  top: `${overlayPos.right.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 30,
                }}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
