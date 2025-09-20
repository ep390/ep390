# Web MIDI Chord Instrument

This is a minimal, easy-to-read React + TypeScript Web MIDI “Chord Instrument.”

## How to Run

This project is set up as a Next.js page and can be run within the existing project structure.

1.  **Navigate to the `website` directory:**
    ```bash
    cd website
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open your browser to `http://localhost:3000/students/Charlie/hw3` to see the instrument.

## How to Enable Web MIDI in Chrome

1.  **Open Chrome Settings:** Go to `chrome://settings/content/midi`.
2.  **Allow MIDI Devices:** Make sure the toggle for "Allow sites to use MIDI devices" is enabled.
3.  **Connect a MIDI Device:** When you load the page, Chrome will ask for permission to access your MIDI devices. Click "Allow".

## How to Select a Virtual MIDI Output

If you don't have a physical MIDI synthesizer, you can use a virtual one on your computer.

*   **macOS:**
    1.  Open the "Audio MIDI Setup" application (you can find it in Utilities).
    2.  Go to `Window > Show MIDI Studio`.
    3.  Double-click the "IAC Driver" icon.
    4.  In the properties window, check the box for "Device is online."
    5.  In your Digital Audio Workstation (DAW) like GarageBand, Logic Pro, or Ableton Live, create a new software instrument track and set its MIDI input to "IAC Driver Bus 1."

*   **Windows:**
    1.  You may need to install a virtual MIDI driver like `loopMIDI` by Tobias Erichsen.
    2.  After installing, run `loopMIDI` and create a new virtual MIDI port.
    3.  In your DAW, set the MIDI input of a software instrument track to the virtual port you created.

Once set up, the Chord Instrument web page should be able to send MIDI to your DAW.
