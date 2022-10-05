// SHADER DE VERTICES
var VSHADER_SOURCE = `
	attribute vec3 posicion;				
    varying highp vec4 vColor;				
	void main(){                         
		gl_Position = vec4(posicion, 1.0);	
		gl_PointSize = 20.0;
        // El s.r es de 2x2 y esta centrado
        highp float distancia = sqrt( dot(posicion.xy,posicion.xy) ) / sqrt(2.0);				
		vColor = vec4(1.0-distancia,1.0-distancia,0.0,1.0);				       
	} `;
									  	 
// SHADER DE FRAGMENTOS
var FSHADER_SOURCE = `
    varying highp vec4 vColor;
	void main(){
		gl_FragColor = vColor;
    }`;

var bufferVertices = null;

function main()
{
	// Recupera el área de dibujo
	var canvas = document.getElementById("canvas");
	if( !canvas ) {
		console.log("Fallo al recuperar el canvas");
		return;
	}
	// Recupera el lienzo del área de dibujo
	// como un contexto WebGL
	var gl = getWebGLContext( canvas );
	if( !gl ){
		console.log("Fallo al recuperar el contexto WebGL");
		return;
	}
	// Carga, compila y monta los shaders
	if( !initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE) ){
		console.log("Fallo al inicializar los shaders");
	}

	gl.clearColor( 1.0, 0.0, 0.3, 1.0 );
	// Localiza el atributo posicion en el shader
	var coordenadas = gl.getAttribLocation( gl.program, 'posicion');
	// Crea el buffer, lo activa y enlaza con coordenadas
	bufferVertices = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferVertices );
	gl.vertexAttribPointer( coordenadas, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( coordenadas );
	// Registro de la call-back de raton
	canvas.onclick = function( evento ){ click( evento, gl, canvas ); };
	// Dibujar
	render( gl );
}

var clicks = [];

function click( evento, gl, canvas )
{
	var x = evento.clientX; 	// coordenada x del cursor respecto del documento
	var y = evento.clientY;		// coordenada y del cursor respecto del documento
	var rect = evento.target.getBoundingClientRect(); // rectangulo del canvas
	// Conversión de coordenadas al cuadrado de 2x2
	x = ((x - rect.left) - canvas.width/2) * 2/canvas.width;
	y = (canvas.height/2 - (y - rect.top)) * 2/canvas.height;
	// Guardar las coordenadas
	clicks.push(x); clicks.push(y); clicks.push(0.0);
	// Redibujar
	render( gl );
}

function render( gl )
{
	var puntos = new Float32Array(clicks); // array de puntos
	// Borra el canvas con el color de fondo
	gl.clear( gl.COLOR_BUFFER_BIT );
	// Rellena los BOs con las coordenadas y colores y lo manda a proceso
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferVertices );
	gl.bufferData( gl.ARRAY_BUFFER, puntos, gl.STATIC_DRAW );
	gl.drawArrays( gl.POINTS, 0, puntos.length/3 )	
	gl.drawArrays( gl.LINE_STRIP, 0, puntos.length/3 )	
}