import numpy as np

W = np.array([[1, 2, 3], 
              [4, 5, 6], 
              [7, 8, 9], 
              [10, 11, 12]])
a = np.array([[0], [1], [2]])
b = np.array([[0], [0], [0], [0]])

def sigma(x):
  return 1 / (1 + np.exp(-x))

def softmax(x):
  e = np.exp(x - np.max(x))  # stability trick
  return e / np.sum(e)

def loss(y_pred, y_true):
  return -np.sum(y_true * np.log(y_pred + 1e-9))  # cross-entropy

z = W @ a + b
h = sigma(z)
s = softmax(h)

# Suppose true class is the 4th one (one-hot encoded)
y_true = np.array([[0], [0], [0], [1]])

print("z =", z)
print("h =", h)
print("s =", s)
print("loss =", loss(s, y_true))

for v in softmax(np.array([18, 17, 0])):
    print(v)
