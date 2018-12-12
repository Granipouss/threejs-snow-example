import {
  Points,
  Vector3,
  Math as Math3D,
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial
} from 'three'

import GPUComputationRenderer from './GPUComputationRenderer'

export default class SnowParticleSystem {
  constructor (options = {}) {
    this.particleCount = options.particleCount || 1024
    this.size = Math.ceil(Math.sqrt(this.particleCount))

    this.radius = options.radius || 3
    this.height = options.height || 3

    this.renderer = options.stage.renderer
    this.camera = options.stage.camera
    this.scene = options.stage.scene

    this.initComputer()
    this.initGeometry()

    this.update()
  }

  update () {
    this.gpuCompute.compute()
    this.particleUniforms.texturePosition.value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture
    this.particleUniforms.textureVelocity.value = this.gpuCompute.getCurrentRenderTarget(this.velocityVariable).texture
  }

  initComputer () {
    this.gpuCompute = new GPUComputationRenderer(this.size, this.size, this.renderer)
    let dtPosition = this.gpuCompute.createTexture()
    let dtVelocity = this.gpuCompute.createTexture()
    this.fillTextures(dtPosition, dtVelocity)
    this.velocityVariable = this.gpuCompute.addVariable('textureVelocity', require('./shaders/snowVelocity.glsl'), dtVelocity)
    this.positionVariable = this.gpuCompute.addVariable('texturePosition', require('./shaders/snowPosition.glsl'), dtPosition)

    this.gpuCompute.setVariableDependencies(this.velocityVariable, [this.positionVariable, this.velocityVariable])
    this.velocityUniforms = this.velocityVariable.material.uniforms
    this.velocityUniforms.gravity = { value: 0.1 }
    this.velocityUniforms.friction = { value: 0.2 }
    this.velocityUniforms.wind = { value: new Vector3(0.05, 0, 0) }

    this.gpuCompute.setVariableDependencies(this.positionVariable, [this.positionVariable, this.velocityVariable])
    this.positionUniforms = this.positionVariable.material.uniforms
    this.positionUniforms.volumeRadius = { value: this.radius }
    this.positionUniforms.volumeHeight = { value: this.height }

    let error = this.gpuCompute.init()
    if (error !== null) console.error(error)
  }

  initGeometry () {
    let size = this.size
    let positions = new Float32Array(this.particleCount * 3)
    let uvs = new Float32Array(this.particleCount * 2)
    let p = 0
    for (let j = 0; j < size; j++) {
      for (let i = 0; i < size; i++) {
        uvs[p++] = i / (size - 1)
        uvs[p++] = j / (size - 1)
      }
    }

    this.geometry = new BufferGeometry()
    this.geometry.addAttribute('position', new BufferAttribute(positions, 3))
    this.geometry.addAttribute('uv', new BufferAttribute(uvs, 2))

    this.particleUniforms = {
      texturePosition: { value: null },
      textureVelocity: { value: null },
      cameraConstant: { value: this.getCameraConstant(this.camera) }
    }

    this.material = new ShaderMaterial({
      uniforms: this.particleUniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: require('./shaders/snowParticles.vs'),
      fragmentShader: require('./shaders/snowParticles.fs')
    })
    this.material.extensions.drawBuffers = true
    this.particles = new Points(this.geometry, this.material)
    this.particles.matrixAutoUpdate = false
    this.particles.updateMatrix()
  }

  fillTextures (positionTexture, velocityTexture) {
    const posArray = positionTexture.image.data
    const velArray = velocityTexture.image.data
    for (let k = 0, kl = posArray.length; k < kl; k += 4) {
      let x, z, rr
      do {
        x = (Math.random() * 2 - 1)
        z = (Math.random() * 2 - 1)
        rr = x * x + z * z
      } while (rr > 1)

      posArray[k + 0] = this.radius * x // x
      posArray[k + 1] = this.height * Math.random() // y
      posArray[k + 2] = this.radius * z // z
      posArray[k + 3] = 1

      velArray[k + 0] = 0 // vx
      velArray[k + 1] = 0 // vy
      velArray[k + 2] = 0 // vz
      velArray[k + 3] = 1 // mass
    }
  }

  getCameraConstant (camera) {
    return window.innerHeight / (Math.tan(Math3D.DEG2RAD * 0.5 * camera.fov) / camera.zoom)
  }
}
