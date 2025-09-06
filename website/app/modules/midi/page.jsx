'use client'

import { useSelectedMidiOutput, useMidiAccess, useMidiPermissionStatus } from '../../../components/midi'

export default function MidiPage() {
  const status = useMidiPermissionStatus()
  const { inputs, outputs, error, enable } = useMidiAccess()
  const { selectedOutput, selectedOutputId, selectOutput } = useSelectedMidiOutput(outputs)
  return (
    <>
      <h1 className="text-4xl font-bold mb-4">MIDI Test Section</h1>
      <p className="mb-2">This section is for testing the MIDI functionality.</p>
      <div className="p-4 border rounded-lg mb-6">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={enable}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Enable MIDI
          </button>
          <span className="text-sm text-gray-700">Status: {status}</span>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Inputs</h3>
            {inputs.length ? (
              <ul className="list-disc list-inside">
                {inputs.map((inp) => (
                  <li key={inp.id}>{inp.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">No inputs found.</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Outputs</h3>
            {outputs.length ? (
              <>
                <div className="flex items-center gap-4 mb-3">
                  <select
                    value={selectedOutputId || ''}
                    onChange={(e) => selectOutput(e.target.value)}
                    className="p-2 border rounded-lg"
                  >
                    {outputs.map((out) => (
                      <option key={out.id} value={out.id}>
                        {out.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (!selectedOutput) return
                      selectedOutput.send([0x90, 60, 127])
                      setTimeout(() => selectedOutput.send([0x80, 60, 0]), 1000)
                    }}
                    disabled={!selectedOutput}
                    className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Send C4 Note
                  </button>
                </div>
                <ul className="list-disc list-inside">
                  {outputs.map((out) => (
                    <li key={out.id}>{out.name}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-gray-600">No outputs found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}