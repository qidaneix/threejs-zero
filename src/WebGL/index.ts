import { initCanvas } from './init-canvas';
import { VSHADER_SOURCE } from './vShanderSource';
import { FSHADER_SOURCE } from './fShanderSource';

export async function main(container: HTMLDivElement) {
  // Retrieve <canvas> element
  const ele = initCanvas(container);

  // Get the rendering context for WebGL
  const gl = ele.getContext?.('webgl2');
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  // Set the vertex information
  const n = initVertexBuffer(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Set texture
  if (!(await initTextures(gl, n))) {
    console.log('Failed to initialize the texture.');
    return;
  }
}

function initVertexBuffer(gl: WebGL2RenderingContext) {
  /* prettier-ignore */
  const verticesTexCoords = new Float32Array([
    // Vertex coordinates, texture coordinate
    -0.5,  0.5,   0.0, 1.0,
    -0.5, -0.5,   0.0, 0.0,
     0.5,  0.5,   1.0, 1.0,
     0.5, -0.5,   1.0, 0.0,
  ]);
  /* prettier-ignore */

  const n = 4; // The number of vertices

  // Create the buffer object
  const vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

  // Get the storage location of a_Position, assign and enable buffer
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position); // Enable the assignment of the buffer object

  const a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if (a_TexCoord < 0) {
    console.log('Failed to get the storage location of a_TexCoord');
    return -1;
  }
  // Assign the buffer object to a_TexCoord variable
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord); // Enable the assignment of the buffer object

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  return n;
}

async function initTextures(gl: WebGL2RenderingContext, n: number) {
  const texture0 = gl.createTexture();
  const texture1 = gl.createTexture();
  if (!texture0 || !texture1) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Get the storage location of u_Sampler
  const u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  const u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler0 || !u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }

  const [image0, image1] = await Promise.all([
    loadImage('/resources/sky.jpg'),
    loadImage('/resources/circle.gif'),
  ]);
  loadTexture(gl, texture0, u_Sampler0, image0, 0);
  loadTexture(gl, texture1, u_Sampler1, image1, 1);

  gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw three rectangle

  return true;
}

function loadImage(imgSrc: string) {
  const image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return Promise.reject();
  }

  image.src = imgSrc;
  return new Promise<HTMLImageElement>((resolve) => {
    image.addEventListener('load', function () {
      return resolve(image);
    });
  });
}

function loadTexture(
  gl: WebGL2RenderingContext,
  texture: WebGLTexture,
  u_Sampler: WebGLUniformLocation,
  image: HTMLImageElement,
  texUnit: number,
) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Make the texture unit active
  const texUnitName = `TEXTURE${texUnit}`;
  gl.activeTexture(gl?.[texUnitName]);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  // Set the texture unit to sampler
  gl.uniform1i(u_Sampler, texUnit);
}
