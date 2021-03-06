import json
import time
from math import sqrt
import sys, gc
from pprint import pprint


with open('metodo_js/json/nasa4704.json') as data_file:    
    A = json.load(data_file)
    
with open('metodo_js/json/nasa4704_b.json') as data_file:    
    b = json.load(data_file)

from math import sqrt
import sys, gc

def transpose(A):
	B = []
	l = len(A)
	c = len(A[0])

	if(c==1):
		# A is a vector
		for i in range(c):
			B.append([])
			for j in range(l):
				B[i].append(A[j])
	else:
		for i in range(c):
			B.append([])
			for j in range(l):
				B[i].append(A[j][i])

	return B

def getL(A):

	lines = len(A)
	columns = len(A[0])

	EPSILON = 0.00001
	FACTOR  = 1000000

	L = [[0 for j in range(columns)] for i in range(lines)]

	L[0][0] = sqrt(A[0][0])
	for i in range(1, lines, 1):
		if(L[0][0]<EPSILON):
			L[i][0] = (FACTOR) * A[i][0]
		else:
			L[i][0] = (1/float(L[0][0])) * A[i][0]

	for i in range(1, lines, 1):
		acc = 0
		for j in range(i):
			if j==0:
				acc = L[i][j]**2
			else:
				acc = acc - L[i][j]**2
		L[i][i] = sqrt(A[i][i] - acc)

		if (i+1) == lines:
			L[i][i] = 1.
			return L

		acc = 0
		for k in range(i):
			if k==0:
				acc = L[i+1][k]*L[i][k]
			else:
				acc = acc - L[i+1][k]*L[i][k]
		
		if(L[i][i] < EPSILON):
			L[i+1][i] = (FACTOR)*(A[i+1][i] - acc)
		else:
			L[i+1][i] = (1/float(L[i][i]))*(A[i+1][i] - acc)

def solve(A, b):
	L  = getL(A)
	Lt = transpose(L)

	n = len(A)

	EPSILON = 0.00001
	FACTOR  = 1000000

	A = None
	collected = gc.collect()
	print "Garbage collector: collected %d objects." % (collected)

	y = [0 for i in range(n)]
	for i in range(0,n,1):
		acc = b[i]
		for k in range(0,i,1):
			acc = acc - L[i][k]*y[k]

		if(L[i][i]<EPSILON):
			y[i] = (FACTOR)*(acc)
		else:
			y[i] = (1/float(L[i][i]))*(acc)

	b = None
	L = None
	collected = gc.collect()
	print "Garbage collector: collected %d objects." % (collected)

	x = [0 for i in range(n)]
	for i in range(n - 1, -1, -1):
		acc = y[i]
		for j in range(i + 1, n):
			acc = acc - Lt[i][j]*x[j]

		if(Lt[i][i]<EPSILON):
			x[i] = (FACTOR)*(acc)
		else:
			x[i] = (1/float(Lt[i][i]))*(acc)

	return x

    
    
timeAcc = 0

for i in range(0,10):
    print "Rodada %d" % (i+1)
    
    start_time = time.clock()
    x = solve(A, b)
    end_time = time.clock()
    elapsedTime = end_time - start_time
    timeAcc += elapsedTime
    print "Elapsed time %.4gs" % elapsedTime
    
print "Execution completed in %.4gs" % timeAcc
print "Average execution time %.4gs" % (timeAcc / 10)