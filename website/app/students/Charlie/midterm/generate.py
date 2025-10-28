import torch
import numpy as np
import os
import random
try:
    from mido import MidiFile, MidiTrack, Message, MetaMessage
    import mido
except ImportError:
    mido = None

# Config
CHECKPOINT_PATH = 'checkpoints/mtsf_model_full.pt'
METADATA_CSV = 'data/metadata.csv'
OUTPUT_DIR = 'generated'
SEED_LENGTH = 100
TOTAL_LENGTH = 200
N_ATTEMPTS = 100


def ensure_dir(path: str) -> None:
    if not os.path.isdir(path):
        os.makedirs(path, exist_ok=True)

def mel_to_midi(mel_spectrogram, tempo=120):
    """Convert mel-spectrogram to dynamic chord progression MIDI with improved musical logic."""
    mid = MidiFile()
    mid.ticks_per_beat = 480
    track = MidiTrack()
    mid.tracks.append(track)
    if mido is not None:
        track.append(MetaMessage('set_tempo', tempo=mido.bpm2tempo(tempo), time=0))

    n_mels, n_timesteps = mel_spectrogram.shape
    midi_notes = np.linspace(48, 84, n_mels).astype(int)  # C3–C6

    # Much shorter windows for maximum chord changes
    window_steps = 4               # Very short chord hold for rapid changes
    ticks_per_step = 120
    chord_ticks = window_steps * ticks_per_step

    # Chord progression patterns for better musical flow
    progression_patterns = [
        [0, 5, 3, 4],    # I-vi-IV-V (common pop progression)
        [0, 2, 5, 0],    # I-iii-vi-I
        [0, 4, 2, 5],    # I-V-iii-vi
        [0, 3, 4, 0],    # I-IV-V-I
        [0, 5, 2, 4],    # I-vi-iii-V
    ]
    
    pattern_idx = 0
    chord_in_pattern = 0
    prev_root = None

    for start in range(0, n_timesteps, window_steps):
        end = min(n_timesteps, start + window_steps)
        window = mel_spectrogram[:, start:end]
        avg_energy = window.mean(axis=1)

        # Enhanced root detection with multiple frequency bands
        low_band = max(1, int(0.3 * n_mels))
        mid_band = max(1, int(0.6 * n_mels))
        
        # Weight different frequency bands
        low_energy = avg_energy[:low_band]
        mid_energy = avg_energy[low_band:mid_band]
        
        # Find strongest root candidates
        low_root_idx = int(np.argmax(low_energy))
        mid_root_idx = int(np.argmax(mid_energy)) + low_band
        
        # Choose root based on energy and musical context
        if low_energy[low_root_idx] > mid_energy[mid_root_idx - low_band] * 1.2:
            root_idx = low_root_idx
        else:
            root_idx = mid_root_idx
            
        root_midi = int(midi_notes[root_idx])

        # Use progression patterns for better musical flow
        if start % (window_steps * 8) == 0:  # Change pattern every 8 chords
            pattern_idx = (pattern_idx + 1) % len(progression_patterns)
            chord_in_pattern = 0
        
        # Get chord degree from pattern
        chord_degree = progression_patterns[pattern_idx][chord_in_pattern % len(progression_patterns[pattern_idx])]
        chord_in_pattern += 1
        
        # Apply chord degree to root (simplified circle of fifths)
        degree_offsets = [0, 2, 4, 5, 7, 9, 11]  # I, ii, iii, IV, V, vi, vii
        if chord_degree < len(degree_offsets):
            root_midi = (root_midi + degree_offsets[chord_degree]) % 12 + 48  # Keep in C3-C6 range

        # Enhanced chord quality detection
        major_intervals = [0, 4, 7]
        minor_intervals = [0, 3, 7]
        sus2_intervals = [0, 2, 7]
        sus4_intervals = [0, 5, 7]

        def nearest_bin(target_midi):
            return int(np.argmin(np.abs(midi_notes - target_midi)))

        def chord_score(intervals):
            bins = [nearest_bin(root_midi + iv) for iv in intervals]
            return float(avg_energy[bins].sum())

        # Choose chord quality based on energy fit
        chord_types = [major_intervals, minor_intervals, sus2_intervals, sus4_intervals]
        chord_scores = [chord_score(intervals) for intervals in chord_types]
        best_chord_idx = np.argmax(chord_scores)
        intervals = chord_types[best_chord_idx]
        
        chord_core = [root_midi + iv for iv in intervals]

        # Add bass note with octave variation
        bass_octave = max(1, (root_midi - 48) // 12)  # Dynamic octave
        bass_note = max(24, root_midi - 12 * bass_octave)  # Lower bass
        chord_notes = [bass_note] + chord_core

        # Add chord extensions for richer sound
        if np.random.random() > 0.6:  # 40% chance
            extension = root_midi + 10  # Major 7th
            if extension <= 84:
                chord_notes.append(extension)

        # Dynamic velocities based on energy and position
        base_vel = int(70 + avg_energy.mean() * 20)
        spread = 15
        velocities = [int(np.clip(base_vel + np.random.randint(-spread, spread + 1), 40, 120)) for _ in chord_notes]

        # Emit chord with dynamic timing
        first = True
        for note, vel in zip(chord_notes, velocities):
            track.append(Message('note_on', channel=0, note=int(note), velocity=vel, time=0 if not first else 0))
            first = False

        # Vary chord duration slightly
        duration_variation = np.random.randint(-20, 21)
        actual_ticks = max(60, chord_ticks + duration_variation)
        
        first_off = True
        for note in chord_notes:
            track.append(Message('note_off', channel=0, note=int(note), velocity=64, time=actual_ticks if first_off else 0))
            first_off = False

        prev_root = root_midi

    return mid

def get_real_seed():
    """Get a real chord progression segment as seed instead of random noise."""
    try:
        # Load metadata to get available files
        with open(METADATA_CSV, 'r') as f:
            lines = f.readlines()[1:]  # Skip header
            random_file = random.choice(lines).strip().split(',')[2]  # Get feature_path
        
        # Load real data
        real_data = np.load(random_file)
        
        # Pick a random segment
        if real_data.shape[1] > SEED_LENGTH:
            start_idx = random.randint(0, real_data.shape[1] - SEED_LENGTH)
            seed_data = real_data[:, start_idx:start_idx+SEED_LENGTH]
        else:
            # Pad if too short
            seed_data = np.pad(real_data, ((0, 0), (0, SEED_LENGTH - real_data.shape[1])), mode='constant')
        
        return torch.tensor(seed_data.T, dtype=torch.float32).unsqueeze(0)  # (1, SEED_LENGTH, n_mels)
    except:
        # Fallback to random if real data fails
        return torch.randn(1, SEED_LENGTH, 64) * 0.1

def generate_single(model, temperature=0.8, seed_length=SEED_LENGTH, total_length=TOTAL_LENGTH):
    """Generate a single sequence with maximum variation and musical progression."""
    backbone, head = model[0], model[1]
    Hin = backbone.input_size
    
    model.eval()
    with torch.no_grad():
        # Use real seed data
        generated = get_real_seed()
        
        # Generate new timesteps with aggressive variation
        for i in range(total_length - seed_length):
            last_input = generated[:, -1:, :]
            output, _ = backbone(last_input)
            next_frame = head(output)
            
            # Much higher noise for maximum variation
            noise = torch.randn_like(next_frame) * temperature * 0.3
            next_frame = next_frame + noise
            
            # Minimal smoothing for maximum change
            next_frame = next_frame * 0.98 + last_input * 0.02
            
            # Frequent "surprise" variations
            if i % 8 == 0:  # Every 8 timesteps (more frequent)
                surprise = torch.randn_like(next_frame) * temperature * 0.4
                next_frame = next_frame + surprise
            
            # Add harmonic jumps every 15 timesteps
            if i % 15 == 0:
                harmonic_jump = torch.randn_like(next_frame) * temperature * 0.5
                next_frame = next_frame + harmonic_jump
            
            # Add rhythmic variations every 12 timesteps
            if i % 12 == 0:
                rhythmic_variation = torch.randn_like(next_frame) * temperature * 0.2
                next_frame = next_frame + rhythmic_variation
            
            generated = torch.cat([generated, next_frame], dim=1)
    
    return generated.squeeze(0).numpy()

def evaluate_sequence_quality(sequence):
    """Quality score that rewards variation and musical richness"""
    # Calculate smoothness (but don't over-penalize)
    smoothness = -np.mean(np.std(np.diff(sequence, axis=0), axis=0)) * 0.5
    
    # Calculate harmonic richness (energy distribution)
    energy_per_bin = np.mean(sequence, axis=0)
    harmonic_richness = np.sum(energy_per_bin > np.percentile(energy_per_bin, 70))
    
    # Calculate dynamic range
    dynamic_range = np.max(sequence) - np.min(sequence)
    
    # Reward variation (higher variation = better)
    variation_score = np.std(np.diff(sequence, axis=0)) * 0.3
    
    # Reward chord changes (count significant energy shifts)
    energy_changes = np.sum(np.abs(np.diff(sequence, axis=0)) > np.std(sequence) * 0.5)
    change_bonus = energy_changes * 0.01
    
    # Combined score (variation is now rewarded)
    score = smoothness + harmonic_richness * 0.1 + dynamic_range * 0.01 + variation_score + change_bonus
    return score

def temperature_for_attempt(attempt_index: int) -> float:
    """Schedule temperatures for attempts (extreme range for maximum variation)."""
    return 1.0 + attempt_index * 0.6


def generate():
    """Generate from trained model with quality improvements."""
    model = torch.load(CHECKPOINT_PATH, map_location='cpu', weights_only=False)

    print("Generating multiple sequences and selecting best...")
    best_sequence = None
    best_score = -float('inf')

    for attempt in range(N_ATTEMPTS):
        print(f"Attempt {attempt + 1}/{N_ATTEMPTS}")
        temperature = temperature_for_attempt(attempt)
        sequence = generate_single(model, temperature=temperature, seed_length=SEED_LENGTH, total_length=TOTAL_LENGTH)
        score = evaluate_sequence_quality(sequence)
        print(f"  Temperature: {temperature:.1f}, Score: {score:.3f}")
        if score > best_score:
            best_sequence = sequence
            best_score = score

    print(f"Best sequence score: {best_score:.3f}")
    ensure_dir(OUTPUT_DIR)
    np.save(os.path.join(OUTPUT_DIR, 'new_progression.npy'), best_sequence)
    print(f"NPY saved: {best_sequence.shape} -> {os.path.join(OUTPUT_DIR, 'new_progression.npy')}")
    if mido:
        midi_file = mel_to_midi(best_sequence.T)
        midi_path = os.path.join(OUTPUT_DIR, 'new_progression.mid')
        midi_file.save(midi_path)
        print(f"MIDI saved: {midi_path}")
    else:
        print("Install mido: pip install mido")

if __name__ == '__main__':
    generate()