import json
import time
import math
from pprint import pprint
import sys, gc


with open('metodo_js/json/nasa2146.json') as data_file:    
    A = json.load(data_file)
    
with open('metodo_js/json/nasa2146_b.json') as data_file:    
    b = json.load(data_file)

def LU(A, b):
	
	n = len(A) # Give us total of lines

	EPSILON = 0.00001
	FACTOR  = 1000000

	# (1) Extract the b vector
	b = [0 for i in range(n)]
	for i in range(n):
		b[i]=A[i][n - 1]

	# (2) Fill L matrix and its diagonal with 1
	L = [[0 for i in range(n)] for i in range(n)]
	for i in range(0,n):
		L[i][i] = 1

	# (3) Fill U matrix
	U = [[0 for i in range(0,n)] for i in range(n)]
	for i in range(0,n):
		for j in range(0,n):
			U[i][j] = A[i][j]

	n = len(U)

	collected = gc.collect()
	print "Garbage collector: collected %d objects." % (collected)

	# (4) Find both U and L matrices
	for i in range(0,n): # for i in [0,1,2,..,n]
		# (4.1) Find the maximun value in a column in order to change lines
		maxElem = abs(U[i][i])
		maxRow = i
		for k in range(i+1, n): # Interacting over the next line
			if(abs(U[k][i]) > maxElem):
				maxElem = abs(U[k][i]) # Next line on the diagonal
				maxRow = k

		# (4.2) Swap the rows pivoting the maxRow, i is the current row
		for k in range(i, n): # Interacting column by column
			tmp=U[maxRow][k]
			U[maxRow][k]=U[i][k]
			U[i][k]=tmp

		collected = gc.collect()
		print "Garbage collector: collected %d objects." % (collected)

		# (4.3) Subtract lines
		for k in range(i+1,n):
			if(U[i][i] < EPSILON):
				c = -U[k][i]*FACTOR
			else:
				c = -U[k][i]/float(U[i][i])

			L[k][i] = c # (4.4) Store the multiplier
			for j in range(i, n):
				U[k][j] += c*U[i][j] # Multiply with the pivot line and subtract

		# (4.5) Make the rows bellow this one zero in the current column
		for k in range(i+1, n):
			U[k][i]=0

	n = len(L)

	A = None
	b = None
	collected = gc.collect()
	print "Garbage collector: collected %d objects." % (collected)

	# (5) Perform substitutioan Ly=b
	y = [0 for i in range(n)]
	for i in range(0,n,1):
		if(L[i][i] < EPSILON):
			y[i] = b[i]*FACTOR
		else:
			y[i] = b[i]/float(L[i][i])

		for k in range(0,i,1):
			y[i] -= y[k]*L[i][k]

	L = None
	collected = gc.collect()
	print "Garbage collector: collected %d objects." % (collected)

	n = len(U)

	# (6) Perform substitution Ux=y
	x = [0 in range(n)]
	for i in range(n-1,-1,-1):
		if(U[i][i] < EPSILON):
			x[i] = y[i]*FACTOR
		else:
			x[i] = y[i]/float(U[i][i])

		for k in range (i-1,-1,-1):
			U[i] -= x[i]*U[i][k]

	return x
    
    
    
    
timeAcc = 0

for i in range(0,10):
    print "Rodada %d" % (i+1)
    
    start_time = time.time()
    x = LU(A, b)
    end_time = time.time()
    elapsedTime = end_time - start_time
    timeAcc += elapsedTime
    print "Elapsed time %d" % elapsedTime
    
print "Execution completed in %d" % timeAcc
print "Average execution time %d" % (timeAcc / 10)