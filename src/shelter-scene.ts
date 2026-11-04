import * as THREE from 'three'

const MAX_GLOBE_NODES = 48
const GLOBE_RADIUS = 2.05
const DEFAULT_ROTATION_X = -0.16

export type ShelterScene = {
  updateBalance: (balanceCkb: number) => void
  dispose: () => void
}

export function globeNodeCountForBalance(balanceCkb: number) {
  if (balanceCkb <= 0) return 0
  return Math.max(
    3,
    Math.min(MAX_GLOBE_NODES, Math.round((Math.log10(balanceCkb + 1) / 12) * MAX_GLOBE_NODES)),
  )
}

function cssColor(element: HTMLElement, token: string, fallback: string) {
  return getComputedStyle(element).getPropertyValue(token).trim() || fallback
}

function globePoint(index: number, radius: number) {
  const angle = index * Math.PI * (3 - Math.sqrt(5))
  const y = 1 - ((index + 0.5) / MAX_GLOBE_NODES) * 2
  const ring = Math.sqrt(1 - y * y)
  return new THREE.Vector3(Math.cos(angle) * ring, y, Math.sin(angle) * ring).multiplyScalar(radius)
}

function globeGridGeometry(radius: number) {
  const positions: number[] = []
  const addSegment = (from: THREE.Vector3, to: THREE.Vector3) => {
    positions.push(from.x, from.y, from.z, to.x, to.y, to.z)
  }

  for (let latitude = -75; latitude <= 75; latitude += 15) {
    const elevation = THREE.MathUtils.degToRad(latitude)
    const ringRadius = radius * Math.cos(elevation)
    const y = radius * Math.sin(elevation)
    let previous = new THREE.Vector3(ringRadius, y, 0)
    for (let step = 1; step <= 96; step += 1) {
      const angle = (step / 96) * Math.PI * 2
      const next = new THREE.Vector3(ringRadius * Math.cos(angle), y, ringRadius * Math.sin(angle))
      addSegment(previous, next)
      previous = next
    }
  }

  for (let longitude = 0; longitude < 180; longitude += 15) {
    const angle = THREE.MathUtils.degToRad(longitude)
    let previous = new THREE.Vector3(0, -radius, 0)
    for (let step = 1; step <= 96; step += 1) {
      const latitude = -Math.PI / 2 + (step / 96) * Math.PI
      const next = new THREE.Vector3(
        radius * Math.cos(latitude) * Math.cos(angle),
        radius * Math.sin(latitude),
        radius * Math.cos(latitude) * Math.sin(angle),
      )
      addSegment(previous, next)
      previous = next
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return geometry
}

export function mountShelterScene(
  stage: HTMLElement,
  canvas: HTMLCanvasElement,
  initialBalanceCkb: number,
): ShelterScene | null {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    })
  } catch {
    stage.dataset.sceneState = 'unavailable'
    canvas.hidden = true
    const fallback = stage.querySelector<HTMLElement>('#scene-fallback')
    if (fallback) fallback.hidden = false
    return null
  }
  stage.dataset.sceneState = 'ready'

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40)
  camera.position.set(0, 0, 8.1)

  scene.add(new THREE.HemisphereLight(0xffffff, 0x829e91, 2.1))
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4)
  keyLight.position.set(-4, 5, 6)
  scene.add(keyLight)
  const fillLight = new THREE.DirectionalLight(0xc6f0de, 1.3)
  fillLight.position.set(4, -1, 4)
  scene.add(fillLight)

  const globe = new THREE.Group()
  globe.rotation.x = DEFAULT_ROTATION_X
  globe.rotation.y = 0.3
  scene.add(globe)

  const surfaceGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 48, 36)
  const surfaceMaterial = new THREE.MeshStandardMaterial({
    color: cssColor(stage, '--globe-core', '#e6f1f2'),
    roughness: 0.72,
    metalness: 0.04,
  })
  globe.add(new THREE.Mesh(surfaceGeometry, surfaceMaterial))

  const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.045, 48, 36)
  const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: cssColor(stage, '--scene-cell', '#247960'),
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.11,
    depthWrite: false,
  })
  globe.add(new THREE.Mesh(atmosphereGeometry, atmosphereMaterial))

  const gridGeometry = globeGridGeometry(GLOBE_RADIUS * 1.006)
  const gridMaterial = new THREE.LineBasicMaterial({
    color: cssColor(stage, '--scene-edge', '#789aa3'),
    transparent: true,
    opacity: 0.52,
    depthWrite: false,
  })
  globe.add(new THREE.LineSegments(gridGeometry, gridMaterial))

  const nodeGeometry = new THREE.SphereGeometry(0.043, 12, 10)
  const nodeMaterial = new THREE.MeshBasicMaterial({
    color: cssColor(stage, '--scene-cell', '#247960'),
  })
  const nodes = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, MAX_GLOBE_NODES)
  nodes.instanceMatrix.setUsage(THREE.StaticDrawUsage)
  const instance = new THREE.Object3D()
  const nodePositions = Array.from({ length: MAX_GLOBE_NODES }, (_, index) =>
    globePoint(index, GLOBE_RADIUS * 1.014),
  )

  nodePositions.forEach((position, index) => {
    instance.position.copy(position)
    instance.scale.setScalar(index % 7 === 0 ? 1.45 : 1)
    instance.updateMatrix()
    nodes.setMatrixAt(index, instance.matrix)
  })
  nodes.count = globeNodeCountForBalance(initialBalanceCkb)
  globe.add(nodes)

  const routeMaterial = new THREE.LineBasicMaterial({
    color: cssColor(stage, '--scene-route', '#56aa91'),
    transparent: true,
    opacity: 0.64,
    depthWrite: false,
  })
  const routes: THREE.BufferGeometry[] = []
  const routePairs = [[2, 10], [10, 20], [20, 32], [32, 5], [14, 39], [39, 2]]
  routePairs.forEach(([from, to], index) => {
    const start = nodePositions[from].clone()
    const end = nodePositions[to].clone()
    const midpoint = start.clone().add(end).normalize().multiplyScalar(GLOBE_RADIUS + 0.36 + (index % 2) * 0.1)
    const geometry = new THREE.BufferGeometry().setFromPoints(
      new THREE.QuadraticBezierCurve3(start, midpoint, end).getPoints(32),
    )
    routes.push(geometry)
    globe.add(new THREE.Line(geometry, routeMaterial))
  })

  const orbitGeometry = new THREE.TorusGeometry(GLOBE_RADIUS * 1.34, 0.009, 5, 128)
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: cssColor(stage, '--scene-orbit', '#9ab9c2'),
    transparent: true,
    opacity: 0.47,
  })
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial)
  orbit.rotation.set(1.16, 0.13, -0.3)
  scene.add(orbit)

  const smallOrbitGeometry = new THREE.TorusGeometry(GLOBE_RADIUS * 1.2, 0.006, 4, 128)
  const smallOrbit = new THREE.Mesh(smallOrbitGeometry, orbitMaterial)
  smallOrbit.rotation.set(0.3, 0.5, 1.02)
  smallOrbit.scale.set(1.17, 0.68, 1)
  scene.add(smallOrbit)

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  const themePreference = window.matchMedia('(prefers-color-scheme: dark)')
  let reducedMotion = motionPreference.matches
  let inView = true
  let dragging = false
  let previousX = 0
  let previousY = 0
  let inertiaX = 0
  let inertiaY = 0

  const resize = () => {
    const width = Math.max(1, stage.clientWidth)
    const height = Math.max(1, stage.clientHeight)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.render(scene, camera)
  }

  const renderFrame = () => {
    if (!reducedMotion && !dragging) {
      globe.rotation.y += 0.00007 + inertiaY
      globe.rotation.x += (DEFAULT_ROTATION_X - globe.rotation.x) * 0.003 + inertiaX
      inertiaX *= 0.94
      inertiaY *= 0.94
    }
    renderer.render(scene, camera)
  }

  const syncAnimation = () => {
    if (inView && !reducedMotion) {
      renderer.setAnimationLoop(renderFrame)
    } else {
      renderer.setAnimationLoop(null)
      renderFrame()
    }
  }

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return
    dragging = true
    previousX = event.clientX
    previousY = event.clientY
    stage.dataset.dragging = 'true'
    canvas.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return
    const deltaX = event.clientX - previousX
    const deltaY = event.clientY - previousY
    previousX = event.clientX
    previousY = event.clientY
    globe.rotation.y += deltaX * 0.005
    globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + deltaY * 0.003, -0.85, 0.85)
    inertiaY = deltaX * 0.00032
    inertiaX = deltaY * 0.0002
    if (reducedMotion || !inView) renderer.render(scene, camera)
  }

  const onPointerUp = () => {
    dragging = false
    delete stage.dataset.dragging
    if (reducedMotion) renderer.render(scene, camera)
  }

  const updateBalance = (balanceCkb: number) => {
    nodes.count = globeNodeCountForBalance(balanceCkb)
    if (reducedMotion || !inView) renderer.render(scene, camera)
  }

  const updatePalette = () => {
    surfaceMaterial.color.set(cssColor(stage, '--globe-core', '#e6f1f2'))
    atmosphereMaterial.color.set(cssColor(stage, '--scene-cell', '#247960'))
    gridMaterial.color.set(cssColor(stage, '--scene-edge', '#789aa3'))
    nodeMaterial.color.set(cssColor(stage, '--scene-cell', '#247960'))
    routeMaterial.color.set(cssColor(stage, '--scene-route', '#56aa91'))
    orbitMaterial.color.set(cssColor(stage, '--scene-orbit', '#9ab9c2'))
    renderer.render(scene, camera)
  }

  const onMotionChange = (event: MediaQueryListEvent) => {
    reducedMotion = event.matches
    syncAnimation()
  }
  const onThemeChange = () => updatePalette()

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(stage)
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    syncAnimation()
  })
  intersectionObserver.observe(stage)
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)
  motionPreference.addEventListener('change', onMotionChange)
  themePreference.addEventListener('change', onThemeChange)
  resize()
  syncAnimation()

  return {
    updateBalance,
    dispose() {
      renderer.setAnimationLoop(null)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      motionPreference.removeEventListener('change', onMotionChange)
      themePreference.removeEventListener('change', onThemeChange)
      surfaceGeometry.dispose()
      surfaceMaterial.dispose()
      atmosphereGeometry.dispose()
      atmosphereMaterial.dispose()
      gridGeometry.dispose()
      gridMaterial.dispose()
      nodeGeometry.dispose()
      nodeMaterial.dispose()
      routes.forEach((geometry) => geometry.dispose())
      routeMaterial.dispose()
      orbitGeometry.dispose()
      smallOrbitGeometry.dispose()
      orbitMaterial.dispose()
      renderer.dispose()
    },
  }
}
