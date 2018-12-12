import {
  ShaderMaterial,
  UniformsUtils,
  UniformsLib
} from 'three'

export default class SnowMaterial extends ShaderMaterial {
  constructor () {
    super({
      uniforms: UniformsUtils.merge([
        UniformsLib['ambient'],
        UniformsLib['lights']
      ]),
      vertexShader: require('./shaders/noise.glsl') + require('./shaders/snow.vs'),
      fragmentShader: require('./shaders/noise.glsl') + require('./shaders/snow.fs'),
      lights: true
    })
  }
}
