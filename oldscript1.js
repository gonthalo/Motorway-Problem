var ventana = document.getElementById("puntitos");
var forma = document.getElementById("input");
var lienzo = document.getElementById("lienzo");
var pluma = lienzo.getContext("2d");
var ymax = 500;
var xmax = 1200;
var t=8;
var place = 0;
var record;
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
	var i=0;
	while (i<list.length && sol!=0){
		sol = sol * list[i];
		i = i + 1;
	}
	return sol;
}
function sum(list){
	var sol=0;
	for (var i=0; i<list.length; ++i){
		sol = sol + list[i];
	}
	return sol;
}
function minimum(a, b){
	if (a<b){
		return a;
	} else {
		return b;
	}
}
function seg(c, d){
	return Math.sqrt((puntos[c].x - puntos[d].x)*(puntos[c].x - puntos[d].x) + (puntos[c].y - puntos[d].y)*(puntos[c].y - puntos[d].y));
}
function dikjistra(start, g1, g2){
	var dis = [];
	var check = [];
	for (var i=0; i<t; ++i){
		check[i]=0;
		dis[i]=20000;
	}
	dis[start]=0;
	while (prod(check)==0){
		var min=20000;
		var pos = -1;
		for (var i=0; i<t; ++i){
			if (dis[i]<min && check[i]==0){
				pos = i;
				min = dis[i];
			}
		}
		if (pos == -1){
			return -1;
		}
		for (var i=0; i<t-1; ++i){
			if (pos==g1[i] && check[g2[i]]==0){
				dis[g2[i]] = minimum(dis[g2[i]], dis[pos] + seg(pos, g2[i]));
			}
			if (pos==g2[i] && check[g1[i]]==0){
				dis[g1[i]] = minimum(dis[g1[i]], dis[pos] + seg(pos, g1[i]));
			}
		}
		check[pos] = 1;
	}
	return sum(dis);
}
function suma(gra1, gra2){
	var sum = dikjistra(0, gra1, gra2);
	var count;
	if (sum != -1){
		for (count = 1; count<t; ++count){
			sum = sum + dikjistra(count, gra1, gra2);
		}
		if (sum<record){
			for (var i=0; i < t-1; ++i){
				raxas[i] = gra1[i];
				rayas[i] = gra2[i];
			}
			record = sum;
		}
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
function retwiddle(m, n, p){
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
function comenzar() {
	t = ventana.value;
	//forma.innerHTML = "<br/>";
	pluma.fillStyle = "white";
	pluma.fillRect(0, 0, 1200, 500);
	puntos = [];
	lineas = [];
	linias = [];
	raxas = [];
	rayas = [];
	record = 90000
	var n=0;
	for (n=0; n<t; ++n){
		puntos[n] = new Punto();
		puntos[n].dibujar(n);
	}
	var cumu=0;
	for (n=0; n<t; ++n){
		var y=0;
		for (y=0; y<n; y++){
			lineas[cumu] = y;
			linias[cumu] = n;
			cumu = cumu + 1;
		}
	}
	var p = [];
	retwiddle(t - 1, t*(t - 1)/2, p);
	var poins = [];
	for (var u=0; u < t - 1; ++u){
		poins[u]=1;
	}
	poins[t-1]=0;
	var li1 = [];
	var li2 = [];
	minima(poins, li1, li2);
	pluma.fillText("Distancia promedio:", 2, 40);
	pluma.fillText(Math.floor(0.5*(record/linias.length + 1)), 100, 40);
	pluma.fillText("pixeles", 120, 40);
	pluma.fillText("100 pixeles", 30, 95);
	pluma.beginPath();
	pluma.moveTo(10, 100);
	pluma.lineTo(110, 100);
	pluma.stroke();
	draw(raxas, rayas);
}
