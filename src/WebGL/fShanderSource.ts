// Fragment shader program
export const FSHADER_SOURCE = /* glsl */ `
#ifdef GL_ES
precision mediump float;
#endif
varying vec4 v_Color;
void main() {
  gl_FragColor = v_Color;
}
`;
