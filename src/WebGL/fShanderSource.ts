// Fragment shader program
export const FSHADER_SOURCE = /* glsl */ `
#ifdef GL_ES
precision mediump float;
#endif
uniform float u_Width;
uniform float u_Height;
void main() {
  gl_FragColor = vec4(gl_FragCoord.x/u_Width, 0.0, gl_FragCoord.y/u_Height, 1.0);
}
`;
