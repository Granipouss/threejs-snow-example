import {
  Vector3,
  MeshPhongMaterial,
  CylinderGeometry,
  IcosahedronGeometry
} from 'three'

import Stats from 'stats.js'
import OrbitControls from './OrbitControls'
import SubdivisionModifier from './SubdivisionModifier'
import DisplacementModifier from './DisplacementModifier'
import SnowParticleSystem from './snowParticles'
import SnowMaterial from './snowMaterial'
import Stage from './stage'

const stage = new Stage({
  cameraPos: new Vector3(0, 10, 15)
})

document.body.appendChild(stage.domElement)
stage.domElement.style.cssText = `background: linear-gradient(to bottom,
  #066dab 0%,
  #8abbd7 79%,
  #c5deea 100%
);`

const controls = new OrbitControls(stage.camera, stage.domElement)
controls.autoRotate = true
controls.target.y = 4

stage.addDirectionalLight('#ffffff', 0.75, 0, 5, 5)
stage.addDirectionalLight('#ffffff', 0.10, -15, 0.5, -15)
stage.addDirectionalLight('#77a9f5', 0.25, 10, 0.5, -10)

stage.addAmbientLight('#0075ff', 0.05)

const baseMaterial = new MeshPhongMaterial({ color: '#333333' })
const snowMaterial = new SnowMaterial()

const displacer = new DisplacementModifier(6.5e-2)
const smoother = new SubdivisionModifier(2)

const modify = (geometry) => smoother.modify(displacer.modify(geometry))

stage.addMesh(new CylinderGeometry(4.9, 4.9, 0.25, 64, 4), baseMaterial, 0, 0.1, 0)
stage.addMesh(smoother.modify(new CylinderGeometry(5.1, 5.1, 1, 16, 3)), snowMaterial, 0, 0.5, 0)

stage.addMesh(modify(new IcosahedronGeometry(2, 2)), snowMaterial, 0, 2, 0)
stage.addMesh(modify(new IcosahedronGeometry(1.5, 2)), snowMaterial, 0, 4.5, 0.1)
stage.addMesh(modify(new IcosahedronGeometry(1.2, 2)), snowMaterial, 0, 6.5, 0)

const particleSystem = new SnowParticleSystem({
  particleCount: 1024,
  radius: 4.5,
  height: 12,
  stage
})

stage.add(particleSystem.particles)

window.requestAnimationFrame(function animate () {
  window.requestAnimationFrame(animate)

  stage.render()
  controls.update()
  particleSystem.update()
})

const stats = new Stats()
document.body.appendChild(stats.dom)
window.requestAnimationFrame(function loop () {
  window.requestAnimationFrame(loop)

  stats.update()
})
