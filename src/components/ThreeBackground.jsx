import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground() {
  const mountRef = useRef(null)

  useEffect(() => {
    const canvas = mountRef.current
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // === PARTICLE FIELD ===
    const particleCount = 1800
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    const colorPalette = [
      new THREE.Color('#6366f1'),
      new THREE.Color('#3b82f6'),
      new THREE.Color('#818cf8'),
      new THREE.Color('#a5b4fc'),
      new THREE.Color('#e2e8f0'),
    ]

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b

      sizes[i] = Math.random() * 2.5 + 0.5
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vDepth;
        uniform float uTime;
        uniform vec2 uMouse;
        
        void main() {
          vColor = color;
          vec3 pos = position;
          
          // Gentle drift animation
          pos.x += sin(uTime * 0.3 + position.z * 0.5) * 0.15;
          pos.y += cos(uTime * 0.2 + position.x * 0.3) * 0.1;
          pos.z += sin(uTime * 0.15 + position.y * 0.4) * 0.05;
          
          // Mouse parallax
          pos.x += uMouse.x * (position.z + 7.5) * 0.04;
          pos.y += uMouse.y * (position.z + 7.5) * 0.04;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vDepth = (-mvPosition.z - 0.1) / 20.0;
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vDepth;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          float depthFade = clamp(1.0 - vDepth, 0.1, 1.0);
          
          // Soft glow
          float glow = exp(-dist * 4.0) * 0.6;
          vec3 glowColor = vColor + glow * 0.3;
          
          gl_FragColor = vec4(glowColor, alpha * depthFade * 0.7);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // === GEOMETRIC LINES (constellation effect) ===
    const lineGeometry = new THREE.BufferGeometry()
    const linePositions = []
    const lineColors = []

    for (let i = 0; i < 60; i++) {
      const x1 = (Math.random() - 0.5) * 18
      const y1 = (Math.random() - 0.5) * 18
      const z1 = (Math.random() - 0.5) * 10
      const x2 = x1 + (Math.random() - 0.5) * 3
      const y2 = y1 + (Math.random() - 0.5) * 3
      const z2 = z1 + (Math.random() - 0.5) * 3

      linePositions.push(x1, y1, z1, x2, y2, z2)
      const alpha = Math.random() * 0.15 + 0.03
      lineColors.push(0.38, 0.40, 0.95, alpha, 0.23, 0.51, 0.96, alpha)
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4))

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)

    // === MOUSE TRACKING ===
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }

    const onMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // === RESIZE ===
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // === ANIMATION LOOP ===
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Smooth mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.04
      mouse.y += (mouse.targetY - mouse.y) * 0.04

      material.uniforms.uTime.value = elapsed
      material.uniforms.uMouse.value.set(mouse.x, mouse.y)

      // Slow rotation
      particles.rotation.y = elapsed * 0.015
      particles.rotation.x = elapsed * 0.008
      lines.rotation.y = elapsed * 0.01
      lines.rotation.x = elapsed * 0.005

      // Camera gentle sway
      camera.position.x = mouse.x * 0.3
      camera.position.y = mouse.y * 0.3
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      geometry.dispose()
      material.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={mountRef}
      id="three-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
