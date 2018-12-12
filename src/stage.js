import {
  Vector3,
  Mesh,
  Scene,
  PerspectiveCamera,
  OrthographicCamera,
  WebGLRenderer,
  DirectionalLight,
  AmbientLight,
  PCFSoftShadowMap
} from 'three'

export default class Stage {
  constructor (options = {}) {
    this.options = options
    this.setupScene()
    this.setupCamera()
    this.setupRenderer()
    this.addEventListener()
  }

  setupScene () {
    this.scene = new Scene()
  }

  setupCamera () {
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.copy(this.options.cameraPos)
    this.camera.up = new Vector3(0, 1, 0)
    this.camera.lookAt(0, 0, 0)
  }

  setupRenderer () {
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.shadowMapEnabled = true
    this.renderer.shadowMapType = PCFSoftShadowMap
    this.renderer.shadowMapSoft = true
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  addEventListener () {
    this.onResize()
    window.addEventListener('resize', event => this.onResize(event), false)
  }

  onResize (event) {
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  get domElement () { return this.renderer.domElement }

  get width () { return window.innerWidth }
  get height () { return window.innerHeight }

  add (element) {
    this.scene.add(element)
    return this
  }

  addDirectionalLight (color, intensity, x, y, z) {
    let shadowRange = 5
    let light = new DirectionalLight(color, intensity)
    light.position.set(x, y, z)
    light.castShadow = true
    light.shadow.camera = new OrthographicCamera(-shadowRange, shadowRange, shadowRange, -shadowRange, 0.5, 1000)
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048
    light.shadow.radius = 3
    light.shadow.bias = 0.0001
    this.add(light)
  }

  addAmbientLight (color, intensity) {
    let light = new AmbientLight(color, intensity)
    this.add(light)
  }

  addMesh (geometry, material, x, y, z) {
    let mesh = new Mesh(geometry, material)
    mesh.position.set(x, y, z)
    mesh.receiveShadow = true
    mesh.castShadow = true
    this.add(mesh)
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }
}
