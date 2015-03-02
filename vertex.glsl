precision highp float;

attribute vec2 position;
attribute vec3 color;

varying vec3 vcolor;

void main() {
	gl_PointSize = 10.0;
	gl_Position = vec4(position, 1.0, 1.0);
	vcolor = color;
}
