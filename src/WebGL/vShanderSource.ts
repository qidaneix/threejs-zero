// Vertex shader program
export const VSHADER_SOURCE = /* glsl */ `
attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal; // Normal
uniform mat4 u_MvpMatrix;
uniform vec3 u_DiffuseLight; // Diffuse light color
uniform vec3 u_LightDirection; // Diffuse light direction (in the world coordinate, normalized)
uniform vec3 u_AmbientLight; // Color of an ambient light
varying vec4 v_Color;
void main() {
  gl_Position = u_MvpMatrix * a_Position;
  // Make the length of the normal 1.0
  vec3 normal = normalize(a_Normal.xyz);
  // Dot product of the light
  float nDotL = max(dot(u_LightDirection, normal), 0.0);
  // Calculate the color due to diffuse reflection
  vec3 diffuse = u_DiffuseLight * a_Color.rgb * nDotL;
  // Calculate the color due to ambient reflection
  vec3 ambient = u_AmbientLight * a_Color.rgb;
  // Add the surface colors duo to diffuse reflection and ambient reflection
  v_Color = vec4(diffuse + ambient, a_Color.a);
}
`;
