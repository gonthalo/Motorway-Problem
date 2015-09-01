var ventana = document.getElementById("puntitos");
var ventana2 = document.getElementById("rayitas");
var lienzo = document.getElementById("lienzo");
var pluma = lienzo.getContext("2d");
lienzo.height = window.innerHeight*500/655;
lienzo.width = window.innerWidth*1200/1360;
var ymax = lienzo.height;
var xmax = lienzo.width;
var t=7;
var kerbal=6;
var place = 0;
var record;
var puntos = [];
var con = [];
var lineas = [];
var linias = [];
var raxas = [];
var rayas = [];
var ps = [];

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
function sumar(list){
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
		for (var i=0; i<g1.length; ++i){
			if (pos==g1[i] && check[g2[i]]==0){
				dis[g2[i]] = minimum(dis[g2[i]], dis[pos] + seg(pos, g2[i]));
			}
			if (pos==g2[i] && check[g1[i]]==0){
				dis[g1[i]] = minimum(dis[g1[i]], dis[pos] + seg(pos, g1[i]));
			}
		}
		check[pos] = 1;
	}
	return sumar(dis);
}
function suma(gra1, gra2){
	var sum = dikjistra(0, gra1, gra2);
	if (sum != -1){
		for (var count = 1; count < t; ++count){
			sum = sum + dikjistra(count, gra1, gra2);
		}
		if (sum<record){
			for (var i=0; i < gra1.length; ++i){
				raxas[i] = gra1[i];
				rayas[i] = gra2[i];
			}
			record = sum;
		}
	}
}
function dfs(m, n, last){
	if (m==0){
		var output1 = [];
		var output2 = [];
		for(var i = 0; i < con.length; i++) {
			output1[i] = lineas[con[i]];
			output2[i] = linias[con[i]];
		}
		suma(output1, output2);
	} else {
		for(var i = last + 1; i < n - m + 1; i++) {
			con[m - 1] = i;
			dfs(m - 1, n, i);
		}
	}
}
// triangulacion de Delaunay :)
function cosen(p, q, r){
	var num = (puntos[p].x - puntos[q].x) * (puntos[r].x - puntos[q].x) + (puntos[p].y - puntos[q].y) * (puntos[r].y - puntos[q].y);
	num = num/seg(q, p);
	num = num/seg(q, r);
	return num;
}
function ccw(p, q, r){
	var disc = (puntos[p].x - puntos[r].x) * (puntos[q].y - puntos[r].y) - (puntos[p].y - puntos[r].y) * (puntos[q].x - puntos[r].x);
	if (disc > 0){
		return 1;
	} else {
		return -1;
	}
}
function index(j, k){
	if (j>k){
		j=j+k;
		k=j-k;
		j=j-k;
	}
	return j + k*(k - 1)/2;
}
function chis4(p, q, r, s){
	var check = ccw(p, q, r) * ccw(p, q, s) * ccw(p, r, s) * ccw(q, r, s);
	if (check==1){
		var d1;
		var d2;
		var o;
		if (ccw(r, p, q) == ccw(s, q, p)){
			o=q;
			d1=s;
			d2=r;
		} else {
			if (ccw(q, p, r) == ccw(s, r, p)){
				o=r;
				d1=q;
				d2=s;
			} else {
				o=s;
				d1=q;
				d2=r;
			}
		}
		if (cosen(o, p, d1)>cosen(d1, d2, o)){
			lineas[index(o, p)] = -1;
		} else {
			lineas[index(d1, d2)] = -1;
		}
	}
}
function dfd(m, n, last){
	if (m==0){
		chis4(ps[0], ps[1], ps[2], ps[3]);
	} else {
		for(var i = last + 1; i < n - m + 1; i++) {
			ps[m - 1] = i;
			dfd(m - 1, n, i);
		}
	}
}
function draw(gr1, gr2){
	if (record==120000){
		pluma.fillText("No es posible conectar todos los puntos", 2, 40);
		return;
	}
	pluma.fillText("Distancia promedio:", 2, 40);
	pluma.fillText(Math.floor(0.5*(record/(t*(t-1)/2) + 1)), 100, 40);
	pluma.fillText("pixeles", 120, 40);
	pluma.fillText("100 pixeles", 30, 95);
	pluma.beginPath();
	pluma.moveTo(10, 100);
	pluma.lineTo(110, 100);
	pluma.stroke();
	for (var i = 0; i < gr1.length; ++i) {
		pluma.fillStyle = "black";
		pluma.beginPath();
		pluma.moveTo(puntos[gr1[i]].x,puntos[gr1[i]].y);
		pluma.lineTo(puntos[gr2[i]].x,puntos[gr2[i]].y);
		pluma.stroke();
		//pluma.fillText(gr1[i], 5 + 10*i, 160);
		//pluma.fillText(gr2[i], 5 + 10*i, 170);
	}
}
function comenzar() {
	t = ventana.value;
	puntos = [];
	lineas = [];
	linias = [];
	ps = [];
	for (var n=0; n<t; ++n){
		puntos[n] = new Punto();
	}
	var cumu=0;
	for (var n=0; n<t; ++n){
		for (var y=0; y<n; ++y){
			lineas[cumu] = y;
			linias[cumu] = n;
			cumu++;
		}
	}
	if (ventana2.value < 3*t - 5){
		//triangulamos...despacito...
		dfd(4, t, -1);
		for (var n = t*(t-1)/2 - 1; n>=0; n--){
			if (lineas[n] == -1){
				lineas.splice(n, 1);
				linias.splice(n, 1);
			}
		}
	}
}
function magia() {
	kerbal = ventana2.value;
	pluma.fillStyle = "white";
	pluma.fillRect(0, 0, xmax, ymax);
	record = 120000;
	con = [];
	raxas = [];
	rayas = [];
	for (var n=0; n<t; ++n){
		puntos[n].dibujar(n);
	}
	dfs(kerbal, lineas.length, -1);
	draw(raxas, rayas);
}
function puntos_nuevos(){
	comenzar();
	magia();
}