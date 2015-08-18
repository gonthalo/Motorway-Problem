var ventana = document.getElementById("puntitos");
var forma = document.getElementById("input");
var lienzo = document.getElementById("lienzo");
var pluma = lienzo.getContext("2d");
var ymax = 500;
var xmax = 1200;
var t=8;
var place = 0;
var record = 90000;
var puntos = [];
var lineas = [];
var linias = [];
var raxas = [];
var rayas = [];

function Punto() {
	this.x = Math.random()*xmax;
	this.y = Math.random()*ymax;
}

Punto.prototype.dibujar = function(num) {
	pluma.fillStyle = "black";
	pluma.beginPath();
	pluma.arc(this.x,this.y,2,0,2*Math.PI);
	pluma.arc(this.x,this.y,1,0,2*Math.PI);
	pluma.stroke();
	pluma.fillText(num, this.x + 2, this.y);
};

function prod(list){
	var sol=1;
	for (var i = list.length - 1; i >= 0; i--) {
		sol = sol * list[i];
	}
	return sol;
}
function draw(gr1, gr2){
	var i;
	for (i = 0; i < t - 1; ++i) {
		pluma.fillStyle = "black";
		pluma.beginPath();
		pluma.moveTo(puntos[gr1[i]].x,puntos[gr1[i]].y);
		pluma.lineTo(puntos[gr2[i]].x,puntos[gr2[i]].y);
		pluma.stroke();
		//pluma.fillText(gr1[i], 20, 20*(i + 1));
		//pluma.fillText(gr2[i], 40, 20*(i + 1));
	}
}
function minimum(a, b){
	if (a<b){
		return a;
	} else {
		return b;
	}
}
function dist(con2, c, d, g1, g2){
	var v;
	for (v=0; v < t - 1; ++v){
		if (c==g1[v] && d==g2[v] || d==g1[v] && c==g2[v]){
			return Math.sqrt((puntos[c].x - puntos[d].x)*(puntos[c].x - puntos[d].x) + (puntos[c].y - puntos[d].y)*(puntos[c].y - puntos[d].y));
		}
	}
	var min=1700;
	for (v=0; v < t - 1; ++v){
		if (c==g1[v] && con2[v]==1){
			con2[v]=0;
			min = minimum(min, dist(con2, c, g2[v], g1, g2) + dist(con2, g2[v], d, g1, g2));
			con2[v]=1;
		}
		if (c==g2[v] && con2[v]==1){
			con2[v]=0;
			min = minimum(min, dist(con2, c, g1[v], g1, g2) + dist(con2, g1[v], d, g1, g2));
			con2[v]=1;
		}
	}
	return min;
}
function suma(gra1, gra2){
	var sum = 0;
	var count;
	var cou;
	for (count = 0; count<8; ++count){
		for (cou = 0; cou<count; ++cou){
			var conex = [];
			for (var u=0; u<t; ++u){
				conex[u] = 1;
			}
			sum = sum + dist(conex, cou, count, gra1, gra2);
		}
	}
	if (sum<record){
		for (var i=0; i < t - 1; ++i){
			raxas[i] = gra1[i];
			rayas[i] = gra2[i];
		}
		record = sum;
	}
}
function minima(points, graph1, graph2){
	var i=0;
	while (i<t){
		if (points[i]==1){
			i=t;
		}
		i = i + 1;
	}
	if (i==t){
		suma(graph1, graph2);
	} else {
		var j=0;
		for (j=0; j<t; ++j){
			if (points[j]==1){
				points[j] = 0;
				for (k=0; k<t; ++k){
					if (points[k]==0 && k!=j){
						graph1.push(j);
						graph2.push(k);
						minima(points, graph1, graph2);
						graph1.pop();
						graph2.pop();
					}
				}
				points[j] = 1;
			}
		}
	}
}
/*function retwiddle(m, n, p){
	var i;
	p[0] = n+1;
	for(i = 1; i<n-m+1; i++){
		p[i] = 0;
	}
  	while(i < n+1){
		p[i] = i + m - n;
		i = i + 1;
	}
	p[n+1] = -2;
	if(m == 0){
		p[1] = 1;
	}
}*/
function comenzar() {
	t = ventana.value;
	forma.innerHTML = "<br/>";
	pluma.fillStyle = "white";
	pluma.fillRect(0, 0, 1200, 500);
	var n=0;
	for (n=0; n<t; ++n){
		puntos[n] = new Punto();
		puntos[n].dibujar(n);
	}
	var cumu=0;
	/*for (n=0; n<t; ++n){
		var y=0;
		for (y=0; y<n; y++){
			lineas[cumu] = y;
			linias[cumu] = n;
			cumu = cumu + 1;
		}
	}
	var p = [];
	retwiddle(t - 1, t*(t - 1)/2, p);*/
	var poins = [];
	for (var u=0; u < t - 1; ++u){
		poins[u]=1;
	}
	poins[t-1]=0;
	var li1 = [];
	var li2 = [];
	minima(poins, li1, li2);
	draw(raxas, rayas);
	pluma.fillText(record, 100, 40);
}

//comenzar();