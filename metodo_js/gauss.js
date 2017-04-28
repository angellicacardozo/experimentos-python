var abs = Math.abs;

function array_fill(i, n, v) {
    var a = [];
    for (; i < n; i++) {
        a.push(v);
    }
    return a;
}

/**
 * Gaussian elimination
 * @param  array A matrix
 * @param  array x vector
 * @return array x solution vector
 */
function gauss(A, x) {

    var i, k, j;

    // Just make a single matrix
    for (i=0; i < A.length; i++) { 
        A[i].push(x[i]);
    }
    var n = A.length;

    for (i=0; i < n; i++) { 
        // Search for maximum in this column
        var maxEl = abs(A[i][i]),
            maxRow = i;
        for (k=i+1; k < n; k++) { 
            if (abs(A[k][i]) > maxEl) {
                maxEl = abs(A[k][i]);
                maxRow = k;
            }
        }


        // Swap maximum row with current row (column by column)
        for (k=i; k < n+1; k++) { 
            var tmp = A[maxRow][k];
            A[maxRow][k] = A[i][k];
            A[i][k] = tmp;
        }

        // Make all rows below this one 0 in current column
        for (k=i+1; k < n; k++) { 
            var c = -A[k][i]/A[i][i];
            for (j=i; j < n+1; j++) { 
                if (i===j) {
                    A[k][j] = 0;
                } else {
                    A[k][j] += c * A[i][j];
                }
            }
        }
    }

    // Solve equation Ax=b for an upper triangular matrix A
    x = array_fill(0, n, 0);
    for (i=n-1; i > -1; i--) { 
        x[i] = A[i][n]/A[i][i];
        for (k=i-1; k > -1; k--) { 
            A[k][n] -= A[k][i] * x[i];
        }
    }

    return x;
}

module.exports = gauss;

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
    var x = gauss(a,b);
    console.log("fim gauss");
    var elapsed = process.hrtime(hrstart);
    var elapsedTime = (elapsed[1] - elapsed[0]);
    
    console.log("Elapsed time : " +  elapsedTime + " ms ");
    
    timeAcc += elapsedTime;
}

var avg = timeAcc / 10;
console.log("Average time : " + avg + " ms ");