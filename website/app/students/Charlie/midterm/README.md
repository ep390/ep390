# Jazz Chord Progression Generator

An AI-powered web application for generating and exploring jazz chord progressions using a trained PyTorch model.

## Features

- **Interactive Chord Input**: Build chord progressions using a visual interface
- **AI Generation**: Generate new progressions using your trained model
- **Pattern Analysis**: Automatically detect common jazz patterns (ii-V-I, I-vi-IV-V, etc.)
- **MIDI Playback**: Play generated progressions through MIDI output devices
- **MIDI Export**: Download generated progressions as MIDI files
- **Quality Scoring**: Evaluate the musical quality of generated progressions
- **Generation History**: Keep track of previous generations with quality scores

## Setup Instructions

### Prerequisites

- Python 3.7 or higher
- pip3
- Your trained model file (`mtsf_model_full.pt`) in the `checkpoints/` directory
- Node.js and npm (for the Next.js frontend)

### Backend Setup

1. **Create and activate virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Ensure your model is in place**:
   ```
   checkpoints/
   └── mtsf_model_full.pt
   ```

4. **Start the Flask API server**:
   ```bash
   ./start.sh
   ```
   
   Or manually:
   ```bash
   source venv/bin/activate
   python api.py
   ```

The API will be available at `http://localhost:5001`

### Frontend Setup

The web interface is already integrated into your Next.js website. Navigate to:
```
http://localhost:3000/students/Charlie/midterm
```

## Usage

### Input Chord Progression

1. Use the chord input interface to build your starting progression
2. Add chords manually or use common jazz patterns
3. Supported chord symbols: `Cmaj7`, `Dm7`, `G7`, `Am7b5`, etc.

### Generate New Progressions

1. Adjust the **Temperature** slider (0.5-2.0):
   - Lower values = more conservative/predictable
   - Higher values = more creative/unexpected

2. Set the **Length** (4-16 chords) for the generated progression

3. Click **Generate Progression** to create new chords using your model

### Play and Export

1. **MIDI Playback**: Select a MIDI output device and click Play to hear the progression
2. **MIDI Export**: Download the progression as a MIDI file for use in DAWs

### Pattern Analysis

The app automatically analyzes generated progressions for common jazz patterns:
- ii-V-I progressions
- I-vi-IV-V progressions  
- Circle of fifths progressions
- And more...

## API Endpoints

- `GET /api/health` - Check server and model status
- `POST /api/generate` - Generate new chord progression
- `POST /api/analyze` - Analyze chord progression for patterns
- `POST /api/export/midi` - Export progression as MIDI file

## Model Integration

The web interface connects to your PyTorch model through the Flask API using your actual `generate.py` file. The API:

1. **Imports your functions**: `generate_single`, `mel_to_midi`, `evaluate_sequence_quality`, `temperature_for_attempt`
2. **Uses your model**: Loads `mtsf_model_full.pt` from the checkpoints directory
3. **Generates sequences**: Creates mel-spectrogram sequences using your trained model
4. **Converts to chords**: Interprets mel-spectrogram energy patterns as chord progressions
5. **Evaluates quality**: Uses your `evaluate_sequence_quality` function for scoring
6. **Exports MIDI**: Uses your `mel_to_midi` function for MIDI file generation

## Troubleshooting

### Model Not Loading
- Ensure `mtsf_model_full.pt` is in the `checkpoints/` directory
- Check that PyTorch is properly installed
- Verify the model file is not corrupted

### API Connection Issues
- Make sure the Flask server is running on port 5000
- Check for firewall or port conflicts
- The frontend will fall back to mock data if the API is unavailable

### MIDI Issues
- Ensure MIDI output devices are properly connected
- Check browser MIDI permissions
- Try refreshing the page if MIDI devices aren't detected

## Technical Details

### Architecture
- **Frontend**: React/Next.js with Tailwind CSS
- **Backend**: Flask API with PyTorch model integration
- **MIDI**: Web MIDI API for real-time playback
- **File Export**: Base64-encoded MIDI file downloads

### Model Integration
The Flask API loads your trained model and provides endpoints for:
- Generating new progressions from input chords
- Converting model output to chord symbols
- Evaluating progression quality
- Exporting to MIDI format

### Chord Symbol Support
Supports standard jazz chord notation:
- Major: `Cmaj7`, `Fmaj7`
- Minor: `Dm7`, `Am7`
- Dominant: `G7`, `Bb7`
- Altered: `G7#5`, `Dm7b5`
- Suspended: `Csus2`, `Fsus4`

## Future Enhancements

- Real-time chord progression generation
- Style-specific generation (bebop, modal, contemporary)
- Voicing suggestions for each chord
- Integration with DAW plugins
- Educational explanations of jazz theory
- Collaborative progression building
