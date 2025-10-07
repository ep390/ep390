import numpy as np
import json

def xavier_uniform(shape):
    fan_in, fan_out = shape[1], shape[0]
    limit = np.sqrt(6 / (fan_in + fan_out))
    return np.random.uniform(-limit, limit, size=shape)

def round_array(arr, precision=2):
    """Round a NumPy array to fixed precision and convert to nested lists."""
    return np.round(arr, precision).tolist()

# Define shapes
shapes = [
    (5, 4),  # W1
    (3, 5),  # W2
    (7, 3)   # W3
]

# Initialize weights and round them
weights = [round_array(xavier_uniform(shape), precision=4) for shape in shapes]

# Dump to JSON string with indentation
json_output = json.dumps(weights, indent=2)

# Optionally save to file
with open("weights.json", "w") as f:
    f.write(json_output)

# Print JSON to console
print(json_output)
