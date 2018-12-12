import { Geometry } from 'three'

export default class DisplacementModifier {
  constructor (intensity = 1.0) {
    this.intensity = intensity
  }

  modify (geometry) {
    if (geometry.isBufferGeometry) {
      geometry = new Geometry().fromBufferGeometry(geometry)
    } else {
      geometry = geometry.clone()
    }
    geometry.faces.map(face => {
      for (let id of ['a', 'b', 'c']) {
        let intensity = this.intensity * (Math.random() - 0.5)
        geometry.vertices[face[id]].addScaledVector(face.normal, intensity)
      }
    })

    geometry.computeFaceNormals()
    geometry.computeVertexNormals()

    return geometry
  }
}
