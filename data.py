# selected categories distribution frequency
SC_FREQ_DISTRIBUTION = [0.75, 0.15, 0.05]

SC_CORRELATION = {
    'A': {
        'B': 0.15,
        'C': 0.42,
        'D': 0.67,
        'E': -0.24,
        'F': 0.07,
        'G': -0.15,
        'H': -0.72,
    },
    'B': {
        'A': 0.15,
        'C': -0.31,
        'D': 0.24,
        'E': 0.03,
        'F': -0.12,
        'G': 0.09,
        'H': 0.21,
    },
    'C': {
        'A': 0.42,
        'B': -0.31,
        'D': 0.57,
        'E': -0.08,
        'F': 0.33,
        'G': -0.05,
        'H': 0.15,
    },
    'D': {
        'A': 0.67,
        'B': 0.24,
        'C': 0.57,
        'E': -0.19,
        'F': 0.62,
        'G': 0.21,
        'H': -0.37,
    },
    'E': {
        'A': -0.24,
        'B': 0.03,
        'C': -0.08,
        'D': -0.19,
        'F': -0.14,
        'G': 0.28,
        'H': -0.05,
    },
    'F': {
        'A': 0.07,
        'B': -0.12,
        'C': 0.33,
        'D': 0.62,
        'E': -0.14,
        'G': -0.37,
        'H': 0.10,
    },
    'G': {
        'A': -0.15,
        'B': 0.09,
        'C': -0.05,
        'D': 0.21,
        'E': 0.28,
        'F': -0.37,
        'H': 0.03,
    },
    'H': {
        'A': -0.72,
        'B': 0.21,
        'C': 0.15,
        'D': -0.37,
        'E': -0.05,
        'F': 0.10,
        'G': 0.03,
    },
}

for letter1 in SC_CORRELATION:
    for letter2 in SC_CORRELATION:
        if letter1 != letter2 and letter2 not in SC_CORRELATION[letter1]:
            SC_CORRELATION[letter1][letter2] = 0.0

for letter in SC_CORRELATION:
    SC_CORRELATION[letter][letter] = 0.0

