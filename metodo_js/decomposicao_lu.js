var LU = (function () {
    function gerar_matriz_zerada(linhas, colunas) {

        var matriz = new Array(linhas);
        
        for (var i = 0; i < linhas; i++){
            matriz[i] = new Array(colunas);
            
            for(var j = 0; j < colunas; j++){
                matriz[i][j] = 0;
            }
        }
        
        return matriz;
    }
    
    function gerar_vetor_zerado(tamanho){
        var vetor = new Array(tamanho);
        
        for(var i = 0; i < tamanho; i++){
            vetor[i] = 0;
        }
        
        return vetor;
    }
    
    function encontrar_matrizes_lu(A, l, u){
        var linhas = A.length;
        
        for(var i =0; i < linhas; i++){
            
            for(var k = i + 1; k < linhas; k++){
                var c = u[k][i] / u[i][i];
                l[k][i] = c;
                
                for(var j = i; j < linhas; j++){
                    u[k][j] -= c * u[i][j];
                }
            }
        }
                      
        return {l: l, u: u};
    }
    
    function encontra_y(L, b){
        var linhas = b.length;
        var y = gerar_vetor_zerado(linhas);
        
        for(var i = 0 ; i < linhas; i++){
           y[i] = b[i] / L[i][i];
        
            for(var k = 0; k < i; k++){
                y[i] -= y[k] * L[i][k];
            }
        }
        
        return y;
    }
    
    function retroSubstituicao(U, y){
        var tam = y.length;
        var x = gerar_vetor_zerado(tam);
        
        for(var i = tam -1; i >= 0; i--){
            var sum = 0.0;
            
            for(var j = i + 1; j < tam; j++){
                sum += U[i][j] * x[j];
            }
                
            x[i] = (y[i] - sum) / U[i][i];
            
            //console.log(y[i] + " " + sum + " " + U[i][i]);
            //console.log(x[i]);
        }
        
        return x;
    }
    
    //Public
    function resolver_sistema(A, b){
        var linhas = A.length;
        var colunas = A[0].length;

            if(linhas != colunas){
            throw "Matriz invalida";	
        }

        var L = gerar_matriz_zerada(linhas, colunas);
        var U = gerar_matriz_zerada(linhas, colunas);

        //Preenche a diagonal principal    
        for(var i = 0; i < linhas; i++){
            L[i][i] = 1;
        }
        
        //Preencher a matriz superior
        for(var i = 0; i < linhas; i++){
            for(var j = 0; j < colunas; j++){
                U[i][j] = A[i][j];
            }
        }
        
        var lu = encontrar_matrizes_lu(A, L, U);
        var y = encontra_y(lu.l, b);
        
        return retroSubstituicao(lu.u, y);
               
    }
    
    return { resolver: resolver_sistema }
})();

/*var a = [[1, 2, 1], [2, -1, 1], [3, 1, -1]];
var b = [8, 3, 2];

var solucao = LU.resolver(a, b);

console.log(solucao);
*/



var fs = require("fs");
console.log("\n *START* \n");
//var contents_a = fs.readFileSync("json/nasa2146.json");
//var contents_b =  fs.readFileSync("json/nasa2146_b.json");

var contents_a = fs.readFileSync("json/nasa4704.json");
var contents_b =  fs.readFileSync("json/nasa4704_b.json");

console.log("parsing matrix...")

var a = JSON.parse(contents_a);
var b = JSON.parse(contents_b);
var timeAcc = 0;

for(var i = 0; i < 10; i++){
    
    console.log("Rodada " + (i + 1) + " ");
    
    var hrstart = process.hrtime();
    var solucao = LU.resolver(a, b);
    var elapsed = process.hrtime(hrstart);
    
    var elapsedTime = (elapsed[1] - elapsed[0]);
    
    console.log("Elapsed time : " +  elapsedTime + " ms ");
    
    timeAcc += elapsedTime;
}

var avg = timeAcc / 10;
console.log("Average time : " + avg + " ms ");
    
    