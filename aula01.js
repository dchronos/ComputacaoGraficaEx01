var	vertexShaderSource,
	fragmentShaderSource,
	vertexShader,
	fragmentShader,
	shaderProgram,
	positionAttr,
	canvas,
	gl,
	buffer,
	data;


window.addEventListener("SHADERS_LOADED", main);
loadFile("vertex.glsl","VERTEX",loadShader);
loadFile("fragment.glsl","FRAGMENT",loadShader);

function loadFile(filename, type, callback){
	var xhr = new XMLHttpRequest();
	xhr.open("GET",filename,true);
	xhr.onload = function(){callback(xhr.responseText,type)};
	xhr.send();
}

function getGLContext(){
	canvas = document.getElementById("canvas");
	gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	gl.viewport(0, 0, canvas.width, canvas.height);
}

function loadShader(text,type){
	if(type == "VERTEX") vertexShaderSource = text;
	if(type == "FRAGMENT") fragmentShaderSource = text;
	if(vertexShaderSource && fragmentShaderSource) window.dispatchEvent(new Event("SHADERS_LOADED"));
}

function compileShader(source,type){
	shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.log(gl.getShaderInfoLog(shader));
	return shader;
}

function linkProgram(vertexShader,fragmentShader){
	var program	= gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) console.log("Error: Program Linking.");
	return program;
}

function getData(){
	var points = [
					-0.9, -0.9,
					0.9, -0.9,
					-0.9,  0.9,
					-0.9,  0.9,
					0.9, -0.9,
					0.9,  0.9,
					0.5, 0.5,
					0.4, 0.3,
					0.0, 0.0
				];
	var points3 = [
		-0.9, -0.9,
		0.0, -0.0,
		0.5, 0.0
	];
	var points2 = [
		0.2, 0.0,
		1.0, 1.0,
		0.0, 0.5

	];
	var color = [
		1.0,0.0,0.0,
		1.0,0.0,0.0,
		1.0,0.0,0.0,
		1.0,0.0,0.0,
		1.0,0.0,1.0,
		1.0,0.0,0.0,
		1.0,0.0,0.0,
		1.0,0.0,0.0,
		1.0,0.0,0.0,
	];
	return {
		"points": new Float32Array(points),
		"points2": new Float32Array(points2),
		"color": new Float32Array(color)
		};
}

function getDataTriangulo(){
	var points = [
		0.1, 0.2,
		0.2, 0.3,
		0.2, 0.2
	];
	return {"points": new Float32Array(points)};
}
function getDataQuadrado(){
	var points = [
		-0.1, 0.2,
		-0.1, 0.3,
		-0.2, 0.3,
		-0.2, 0.2,
		-0.1, 0.2
	];
	return {"points": new Float32Array(points)};
}
function getDataCirculoFill(){
	var points = [];
	var coeficiente = canvas.width/canvas.height;
	var raio = 0.07;
	var xMove = -0.15;
	var yMove = 0.25;

	for(var i = 0 ; i<=360; i = i + 0.1){
		rad = i * Math.PI/180;
		x = raio * Math.cos(rad);
		y = coeficiente * raio * Math.sin(rad);
		points.push(x + xMove);
		points.push(y + yMove);

		points.push(0.0 + xMove);
		points.push(0.0 + yMove);

		points.push(x + xMove);
		points.push(0.0 + yMove);
	}
	for(var i = 0 ; i<=360; i = i + 0.1){
		rad = i * Math.PI/180;
		x = raio * Math.cos(rad);
		y = coeficiente * raio * Math.sin(rad);
		points.push(x + xMove);
		points.push(y + yMove);

		points.push(0.0 + xMove);
		points.push(0.0 + yMove);

		points.push((-x + xMove));
		points.push(y + yMove);
	}
	return {"points": new Float32Array(points)};
}

function getDataCirculo(){
	var points = [];
	var coeficiente = canvas.width/canvas.height;
	var raio = 0.5;

	for(var i = 0 ; i<=360; i++){
		rad = i * Math.PI/180;
		x = raio * Math.cos(rad);
		y = coeficiente * raio * Math.sin(rad);
		points.push(x);
		points.push(y);
	}

	// for(var i = -1.0; i<=1.0 ; i+=0.000001){
	// 	y = coeficiente * (Math.sqrt(0.2 - Math.pow(i, 2)));
	// 	points.push(i);
	// 	points.push(y);
	// }
	// for(var i = -1.0; i<=1.0 ; i+=0.000001){
	// 	y = coeficiente * (-Math.sqrt(0.2 - Math.pow(i, 2)));
	// 	points.push(i);
	// 	points.push(y);
	// }
	for(var i = -1.0; i<=1.0 ; i+=0.000001){
		y = -Math.sqrt(0.1 - Math.pow(i, 2));
		points.push(i);
		points.push(y*coeficiente);
	}
	return {"points": new Float32Array(points)};
}

function main() {
	/* LOAD GL */
	getGLContext();

	/* COMPILE AND LINK */
	vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
	fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
	shaderProgram = linkProgram(vertexShader,fragmentShader);
	gl.useProgram(shaderProgram);

	/* PARAMETERS */
	//data = getDataCirculo();
	data = getDataCirculo();
	positionAttr = gl.getAttribLocation(shaderProgram, "position");
	buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data.points, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(positionAttr);
	gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);


	gl.drawArrays(gl.LINE_STRIP, 0, data.points.length/2);

	/* PARAMETERS */
	//data = getDataCirculo();
	data = getDataTriangulo();
	positionAttr = gl.getAttribLocation(shaderProgram, "position");
	buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data.points, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(positionAttr);
	gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLES, 0, data.points.length/2);

	/* PARAMETERS */
	//data = getDataCirculo();
	data2 = getDataQuadrado();
	positionAttr = gl.getAttribLocation(shaderProgram, "position");
	buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data2.points, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(positionAttr);
	gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.LINE_STRIP, 0, data2.points.length/2);

	/* PARAMETERS */
	//data = getDataCirculo();
	data2 = getDataCirculoFill();
	positionAttr = gl.getAttribLocation(shaderProgram, "position");
	buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data2.points, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(positionAttr);
	gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLES, 0, data2.points.length/2);


	// colorAttr = gl.getAttribLocation(shaderProgram, "color");
	// buffer2 = gl.createBuffer();
	// gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
	// gl.bufferData(gl.ARRAY_BUFFER, data.color, gl.STATIC_DRAW);
	// gl.enableVertexAttribArray(colorAttr);
	// gl.vertexAttribPointer(colorAttr, 3, gl.FLOAT, false, 0, 0);


	/* DRAW */
	//gl.lineWidth(5.0);
	//gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES
	//gl.drawArrays(gl.LINE_STRIP, 0, data.points.length/2);
	//gl.drawArrays(gl.POINTS, 0, data2.points.length/2);

	//Segundo Draw
	// gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	// gl.bufferData(gl.ARRAY_BUFFER, data.points2, gl.STATIC_DRAW);
	// //gl.enableVertexAttribArray(positionAttr);
	// gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);
	//
	// /* DRAW */
	// //gl.lineWidth(5.0);
	// //gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES
	// gl.drawArrays(gl.LINE_STRIP, 0, data.points2.length/2);


}
