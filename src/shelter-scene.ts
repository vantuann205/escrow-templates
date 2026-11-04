import * as THREE from 'three'

const MAX_CELLS = 40
const CELL_SIZE = 0.72
const DEFAULT_ROTATION_X = -0.14
const DEFAULT_ROTATION_Y = 0.42

export type ShelterScene = {
  updateBalance: (balanceCkb: number) => void
  dispose: () => void
}

function cellCountForBalance(balanceCkb: number) {
  if (balanceCkb <= 0) return 0
  return Math.max(3, Math.min(MAX_CELLS, Math.round((Math.log10(balanceCkb + 1) / 12) * MAX_CELLS)))
}

function cssColor(element: HTMLElement, token: string, fallback: string) {
  return getComputedStyle(element).getPropertyValue(token).trim() || fallback
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
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60)
  camera.position.set(6.6, 5.2, 7.2)
  camera.lookAt(0, 0.05, 0)

  scene.add(new THREE.HemisphereLight(0xffffff, 0x59685f, 2.1))
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.7)
  keyLight.position.set(-3, 7, 5)
  scene.add(keyLight)
  const fillLight = new THREE.DirectionalLight(0xffffff, 1.1)
  fillLight.position.set(5, 2, -4)
  scene.add(fillLight)

  const shelter = new THREE.Group()
  shelter.rotation.set(DEFAULT_ROTATION_X, DEFAULT_ROTATION_Y, 0)
  scene.add(shelter)

  const platformGeometry = new THREE.CylinderGeometry(2.55, 2.55, 0.14, 48)
  const platformMaterial = new THREE.MeshStandardMaterial({
    color: cssColor(stage, '--scene-cell', '#176c49'),
    roughness: 0.66,
    metalness: 0.04,
  })
  const platform = new THREE.Mesh(platformGeometry, platformMaterial)
  platform.position.y = -1.07
  shelter.add(platform)

  const frameGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(4.15, 2.48, 4.15))
  const frameMaterial = new THREE.LineBasicMaterial({
    color: cssColor(stage, '--scene-edge', '#a9c8b3'),
    transparent: true,
    opacity: 0.9,
  })
  const frame = new THREE.LineSegments(frameGeometry, frameMaterial)
  frame.position.y = 0.04
  shelter.add(frame)

  const cellGeometry = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE)
  const cellMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.33,
    metalness: 0.08,
  })
  const cells = new THREE.InstancedMesh(cellGeometry, cellMaterial, MAX_CELLS)
  cells.instanceMatrix.setUsage(THREE.StaticDrawUsage)
  const transform = new THREE.Object3D()
  const baseColor = new THREE.Color()

  for (let index = 0; index < MAX_CELLS; index += 1) {
    const slot = index % 16
    transform.position.set(
      ((slot % 4) - 1.5) * 0.83,
      Math.floor(index / 16) * 0.81 - 0.42,
      (Math.floor(slot / 4) - 1.5) * 0.83,
    )
    transform.rotation.set(0, index % 2 === 0 ? 0.025 : -0.025, 0)
    transform.updateMatrix()
    cells.setMatrixAt(index, transform.matrix)
    cells.setColorAt(index, baseColor.set(cssColor(stage, '--scene-cell', '#176c49')).multiplyScalar(0.78 + (index % 5) * 0.065))
  }
  cells.count = cellCountForBalance(initialBalanceCkb)
  shelter.add(cells)

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  const themePreference = window.matchMedia('(prefers-color-scheme: dark)')
  let reducedMotion = motionPreference.matches
  let inView = true
  let targetX = DEFAULT_ROTATION_X
  let targetY = DEFAULT_ROTATION_Y

  const resize = () => {
    const width = Math.max(1, stage.clientWidth)
    const height = Math.max(1, stage.clientHeight)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.render(scene, camera)
  }

  const renderFrame = (time = 0) => {
    if (!reducedMotion) {
      shelter.rotation.x += (targetX - shelter.rotation.x) * 0.035
      const idleTurn = Math.sin(time * 0.00028) * 0.035
      shelter.rotation.y += (targetY + idleTurn - shelter.rotation.y) * 0.025
    } else {
      shelter.rotation.set(DEFAULT_ROTATION_X, DEFAULT_ROTATION_Y, 0)
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

  const onPointerMove = (event: PointerEvent) => {
    if (reducedMotion || event.pointerType === 'touch') return
    const bounds = stage.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    targetY = DEFAULT_ROTATION_Y + (x - 0.5) * 0.26
    targetX = DEFAULT_ROTATION_X + (y - 0.5) * 0.16
  }

  const resetPointer = () => {
    targetX = DEFAULT_ROTATION_X
    targetY = DEFAULT_ROTATION_Y
  }

  const updateBalance = (balanceCkb: number) => {
    cells.count = cellCountForBalance(balanceCkb)
    cells.instanceMatrix.needsUpdate = true
    if (reducedMotion || !inView) renderer.render(scene, camera)
  }

  const updatePalette = () => {
    const cellColor = new THREE.Color(cssColor(stage, '--scene-cell', '#176c49'))
    platformMaterial.color.copy(cellColor).multiplyScalar(0.34)
    frameMaterial.color.set(cssColor(stage, '--scene-edge', '#a9c8b3'))
    for (let index = 0; index < MAX_CELLS; index += 1) {
      cells.setColorAt(index, baseColor.copy(cellColor).multiplyScalar(0.78 + (index % 5) * 0.065))
    }
    if (cells.instanceColor) cells.instanceColor.needsUpdate = true
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
  stage.addEventListener('pointermove', onPointerMove)
  stage.addEventListener('pointerleave', resetPointer)
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
      stage.removeEventListener('pointermove', onPointerMove)
      stage.removeEventListener('pointerleave', resetPointer)
      motionPreference.removeEventListener('change', onMotionChange)
      themePreference.removeEventListener('change', onThemeChange)
      platformGeometry.dispose()
      platformMaterial.dispose()
      frameGeometry.dispose()
      frameMaterial.dispose()
      cellGeometry.dispose()
      cellMaterial.dispose()
      renderer.dispose()
    },
  }
}
