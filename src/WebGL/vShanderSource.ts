// Vertex shader program
export const VSHADER_SOURCE = /* glsl */ `
attribute vec4 a_Position;
void main() {
  gl_Position = a_Position;
  gl_PointSize = 10.0;
}
`;
