function transpose(A) {

	var B = [];
	var l = A.length;
	var c = A[0].length;

	var i;

	if (Object.prototype.toString.call(c)==="[object Undefined]") {
		// A is a vector
		for (i=0;i<l;i++) {
			B.push([A[i]]);
		}

	} else {

		for (i=0;i<c;i++) {
			B.push([]);
			for (j=0;j<l;j++) {
				B[i].push(A[j][i]);
			}
		}
	}

	return B;
}

function getL(A) {

	var lines = A.length;
	var columns = A[0].length;
	var i
		,j
		,acc;

	var L = [];
	for (i=0;i<lines;i++) {

		L[i] = [];
		for (j=0; j<columns;j++) {
			L[i][j] = 0;
		}
	}

	L[0][0] = Math.sqrt(A[0][0]);

	for (i=1;i<lines;i++) {
		L[i][0] = (1/parseFloat(L[0][0])) * A[i][0];
	}

	for (i=1;i<lines;i++) {
		acc = 0;

		for (j=0;j<i;j++) {
			if (j===0) {
				acc = Math.pow(L[i][j], 2);
			} else {
				acc = acc - Math.pow(L[i][j], 2);
			}
		}

		L[i][i] = Math.sqrt(A[i][i] - acc);

		if ((i+1)===lines) {
			L[i][i] = 1;

			return L;
		}

		acc = 0;
		for (k=0;k<i;k++) {
			if (k===0) {
				acc = L[i+1][k]*L[i][k]
			} else {
				acc = acc - L[i+1][k]*L[i][k]
			}
		}

		L[i+1][i] = (1/parseFloat(L[i][i]))*(A[i+1][i] - acc)
	}

}

function solve(A, b, L) {
	var L = getL(A);
	var Lt = transpose(L);

	var n
		,i
		,y
		,x
		,k
		,j
		,acc;

	n = A.length;
	y = [];
	x = [];

	for (i=0;i<n;i++) {
		y.push(0);
	}

	for (i=0;i<n;i++) {
		acc = b[i];
		for (k=0;k<i;k++) {
			acc = acc - L[i][k]*y[k];
		}

		y[i] = (1/parseFloat(L[i][i]))*(acc);
	}

	for (i=0;i<n;i++) {
		x.push(0);
	}

	for (i=(n- 1);i>=0;i--) {
		acc = y[i];
		for (j = (i+1);j<n;j++) {
			acc = acc - Lt[i][j]*x[j];
		}

		x[i] = (1/parseFloat(Lt[i][i]))*(acc);
	}

	return x;

}

function test_transpose() {

	var A = [1,2,3];
	var A_expct = [[1],[2],[3]];

	var result = transpose(A);
	console.log(result);

	var A_expct = [1,2,3];
	var A = [[1],[2],[3]];

	var result = transpose(A);
	console.log(result);
}

function test_getL() {
	var A = [[1,-1,2], [-1,5,-4],[2,-4,6]];
	var result = getL(A);

	console.log(result);
}

function test_Solve() {
	var A = [[1,-1,2], [-1,5,-4],[2,-4,6]];
	var b = [0,1,0];

	var L  = getL(A);
	var x = solve(A,b,L);

	console.log(x);
}



var fs = require("fs");

console.log("\n *START* \n");
var contents_a = fs.readFileSync("json/nasa2146.json");
var contents_b =  fs.readFileSync("json/nasa2146_b.json");

//var contents_a = fs.readFileSync("json/nasa4704.json");
//var contents_b =  fs.readFileSync("json/nasa4704_b.json");

console.log("parsing matrix...")

var a = JSON.parse(contents_a);
var b = JSON.parse(contents_b);
var timeAcc = 0;

for(var i = 0; i < 10; i++){
    
    console.log("Rodada " + (i + 1) + " ");
    
    var hrstart = process.hrtime();
    
    var L = getL(a);
    var x = solve(a, b, L);
    
    var elapsed = process.hrtime(hrstart);
    
    var elapsedTime = (elapsed[1] - elapsed[0]);
    
    console.log("Elapsed time : " +  elapsedTime + " ms ");
    
    timeAcc += elapsedTime;
}

var avg = timeAcc / 10;
console.log("Average time : " + avg + " ms ");