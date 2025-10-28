import torch
import numpy as np
import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import tempfile
import base64
import sys

# Add the current directory to Python path to import generate.py
sys.path.append(os.path.dirname(__file__))
from generate import generate_single, mel_to_midi, evaluate_sequence_quality, get_real_seed, temperature_for_attempt

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Use the same paths as in generate.py
CHECKPOINT_PATH = os.path.join(os.path.dirname(__file__), 'checkpoints', 'mtsf_model_full.pt')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'generated')
SEED_LENGTH = 100
TOTAL_LENGTH = 200
N_ATTEMPTS = 5  # Reduced for API responsiveness

model = None

def load_model():
    global model
    try:
        model = torch.load(CHECKPOINT_PATH, map_location='cpu', weights_only=False)
        print(f"Model loaded successfully from {CHECKPOINT_PATH}")
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/api/generate', methods=['POST'])
def generate_progression():
    try:
        data = request.get_json()
        temperature = data.get('temperature', 1.2)
        length = data.get('length', 8)
        input_chords = data.get('input_chords', [])
        
        if not model:
            return jsonify({'error': 'Model not loaded'}), 500
        
        print(f"Generating with temperature: {temperature}, length: {length}")
        
        # Generate multiple attempts and select the best one (like in your generate.py)
        best_sequence = None
        best_score = -float('inf')
        
        for attempt in range(min(N_ATTEMPTS, 3)):  # Limit attempts for API responsiveness
            attempt_temperature = temperature_for_attempt(attempt) if attempt > 0 else temperature
            sequence = generate_single(
                model, 
                temperature=attempt_temperature, 
                seed_length=SEED_LENGTH, 
                total_length=TOTAL_LENGTH
            )
            score = evaluate_sequence_quality(sequence)
            print(f"Attempt {attempt + 1}: temp={attempt_temperature:.1f}, score={score:.3f}")
            
            if score > best_score:
                best_sequence = sequence
                best_score = score
        
        # Convert the generated sequence to chord progression
        chord_progression = convert_sequence_to_chords(best_sequence, length)
        
        print(f"Best sequence score: {best_score:.3f}")
        
        return jsonify({
            'success': True,
            'chords': chord_progression,
            'quality_score': float(best_score),
            'temperature': temperature,
            'length': length,
            'sequence_shape': best_sequence.shape
        })
        
    except Exception as e:
        print(f"Generation error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_progression():
    try:
        data = request.get_json()
        chords = data.get('chords', [])
        
        # Analyze the chord progression for jazz patterns
        analysis = analyze_jazz_patterns(chords)
        
        return jsonify({
            'success': True,
            'analysis': analysis
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/export/midi', methods=['POST'])
def export_midi():
    try:
        data = request.get_json()
        chords = data.get('chords', [])
        
        # Convert chords to MIDI using your mel_to_midi function
        # First create a mock mel-spectrogram from chords
        mock_spectrogram = chords_to_mel_spectrogram(chords)
        midi_data = mel_to_midi(mock_spectrogram, tempo=120)
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(suffix='.mid', delete=False) as tmp_file:
            midi_data.save(tmp_file.name)
            
            # Read file and encode as base64
            with open(tmp_file.name, 'rb') as f:
                midi_bytes = f.read()
            
            os.unlink(tmp_file.name)  # Clean up
            
            return jsonify({
                'success': True,
                'midi_data': base64.b64encode(midi_bytes).decode('utf-8')
            })
            
    except Exception as e:
        print(f"MIDI export error: {e}")
        return jsonify({'error': str(e)}), 500

def chords_to_mel_spectrogram(chords):
    """Convert chord symbols to a mock mel-spectrogram for MIDI export"""
    # Create a simple mel-spectrogram representation
    # This is a simplified approach - you might want to improve this
    n_mels = 36  # Number of mel bins
    n_timesteps = len(chords) * 8  # 8 timesteps per chord
    
    spectrogram = np.zeros((n_mels, n_timesteps))
    
    for i, chord in enumerate(chords):
        start_time = i * 8
        end_time = start_time + 8
        
        # Create energy peaks for chord notes
        # This is a simplified representation
        chord_energy = np.random.rand(n_mels) * 0.5 + 0.3
        spectrogram[:, start_time:end_time] = chord_energy[:, np.newaxis]
    
    return spectrogram

def convert_sequence_to_chords(sequence, length):
    """Convert generated mel-spectrogram sequence to chord symbols"""
    # This uses your actual model output to generate chord progressions
    # The sequence is a mel-spectrogram that we need to interpret as chords
    
    # Common jazz chords for generation
    jazz_chords = [
        'Cmaj7', 'Dm7', 'Em7', 'Fmaj7', 'G7', 'Am7', 'Bm7b5',
        'C7', 'Dm7', 'Em7', 'F7', 'Gm7', 'Am7', 'Bb7',
        'Cmaj7', 'Dm7', 'G7', 'Cmaj7', 'Fmaj7', 'Dm7', 'G7', 'Cmaj7'
    ]
    
    # Use the sequence to select chords based on energy patterns
    selected_chords = []
    
    # Sample the sequence at regular intervals
    step_size = max(1, sequence.shape[1] // length)
    
    for i in range(length):
        time_idx = min(i * step_size, sequence.shape[1] - 1)
        
        # Get energy distribution at this time step
        energy_at_time = sequence[:, time_idx]
        
        # Use energy patterns to influence chord selection
        # Higher energy in lower bins suggests root notes
        low_energy = np.mean(energy_at_time[:12])  # Lower frequency bins
        mid_energy = np.mean(energy_at_time[12:24])  # Mid frequency bins
        high_energy = np.mean(energy_at_time[24:])  # Higher frequency bins
        
        # Select chord based on energy distribution
        if low_energy > mid_energy and low_energy > high_energy:
            # Strong bass suggests root position chords
            chord_index = int(low_energy * len(jazz_chords)) % len(jazz_chords)
        elif mid_energy > high_energy:
            # Mid-range energy suggests inversions or extensions
            chord_index = int(mid_energy * len(jazz_chords)) % len(jazz_chords)
        else:
            # High energy suggests upper extensions
            chord_index = int(high_energy * len(jazz_chords)) % len(jazz_chords)
        
        selected_chords.append(jazz_chords[chord_index])
    
    return selected_chords

def analyze_jazz_patterns(chords):
    """Analyze chord progression for common jazz patterns"""
    patterns = {
        'ii-V-I': ['Dm7', 'G7', 'Cmaj7'],
        'I-vi-IV-V': ['Cmaj7', 'Am7', 'Fmaj7', 'G7'],
        'I-IV-V-I': ['Cmaj7', 'Fmaj7', 'G7', 'Cmaj7'],
        'vi-ii-V-I': ['Am7', 'Dm7', 'G7', 'Cmaj7'],
        'iii-vi-ii-V': ['Em7', 'Am7', 'Dm7', 'G7'],
        'I-vi-ii-V': ['Cmaj7', 'Am7', 'Dm7', 'G7']
    }
    
    found_patterns = []
    
    for pattern_name, pattern_chords in patterns.items():
        if len(chords) >= len(pattern_chords):
            for i in range(len(chords) - len(pattern_chords) + 1):
                segment = chords[i:i + len(pattern_chords)]
                if segment == pattern_chords:
                    found_patterns.append({
                        'name': pattern_name,
                        'start': i,
                        'length': len(pattern_chords),
                        'chords': segment
                    })
    
    return found_patterns


if __name__ == '__main__':
    # Load model on startup
    if load_model():
        print("Starting Flask server...")
        print("API will be available at: http://localhost:5001")
        app.run(debug=True, host='0.0.0.0', port=5001)
    else:
        print("Failed to load model. Exiting.")
