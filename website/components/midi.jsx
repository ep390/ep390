'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

export function useMidiPermissionStatus() {
  const [midiPermission, setMidiPermission] = useState('unknown')

  useEffect(() => {
    let isMounted = true
    let permissionStatus = null

    const handleChange = () => {
      if (!isMounted || !permissionStatus) return
      setMidiPermission(permissionStatus.state)
    }

    const checkMidiPermission = async () => {
      if (!('permissions' in navigator)) {
        setMidiPermission('unsupported')
        return
      }
      try {
        permissionStatus = await navigator.permissions.query({ name: 'midi', sysex: false })
        if (!isMounted) return
        setMidiPermission(permissionStatus.state)
        permissionStatus.addEventListener('change', handleChange)
      } catch (err) {
        if (!isMounted) return
        setMidiPermission('unsupported')
      }
    }

    checkMidiPermission()

    return () => {
      isMounted = false
      if (permissionStatus) {
        permissionStatus.removeEventListener('change', handleChange)
      }
    }
  }, [])

  return midiPermission
}

/**
 * Hook to request and hold a Web MIDI access object. Returns the current access
 * object (or null), any error message, and a request function that must be
 * called from a user gesture to obtain access.
 */
export function useMidiAccess() {
  const [midiAccess, setMidiAccess] = useState(null)
  const [error, setError] = useState(null)
  const [inputs, setInputs] = useState([])
  const [outputs, setOutputs] = useState([])

  const request = useCallback(async () => {
    try {
      if (navigator && navigator.requestMIDIAccess) {
        const access = await navigator.requestMIDIAccess({ sysex: false })
        setMidiAccess(access)
        setError(null)
        setInputs(Array.from(access.inputs.values()))
        setOutputs(Array.from(access.outputs.values()))
      } else {
        setError('Web MIDI API is not supported in this browser.')
      }
    } catch (err) {
      setError(`MIDI Access Error: ${err.message}`)
    }
  }, [])

  useEffect(() => {
    if (!midiAccess) return
    // Initialize from current access maps
    setInputs(Array.from(midiAccess.inputs.values()))
    setOutputs(Array.from(midiAccess.outputs.values()))

    const handler = () => {
      setInputs(Array.from(midiAccess.inputs.values()))
      setOutputs(Array.from(midiAccess.outputs.values()))
    }
    midiAccess.addEventListener('statechange', handler)
    return () => {
      midiAccess.removeEventListener('statechange', handler)
    }
  }, [midiAccess])

  const value = useMemo(() => ({ midiAccess, inputs, outputs, error, request }), [midiAccess, inputs, outputs, error, request])
  return value
}

/**
 * Combined hook: exposes permission status plus MIDI resources and an enable() action.
 */
export function useMidi() {
  const status = useMidiPermissionStatus()
  const { midiAccess, inputs, outputs, error, request } = useMidiAccess()

  const enable = useCallback(async () => {
    // Always attempt to request; if already granted, this resolves without prompting
    await request()
  }, [request])

  const value = useMemo(() => ({ status, midiAccess, inputs, outputs, error, enable }), [status, midiAccess, inputs, outputs, error, enable])
  return value
}

// Slimmer device-focused hook for prop drilling
export function useMidiDevices() {
  const { status, inputs, outputs, error, enable } = useMidi()
  return useMemo(() => ({ status, inputs, outputs, error, enable }), [status, inputs, outputs, error, enable])
}

// Selection hook for choosing one output from a list (prop-drill friendly)
export function useSelectedMidiOutput(outputs, initialId = null) {
  const [selectedOutputId, setSelectedOutputId] = useState(initialId)

  useEffect(() => {
    if (!outputs || outputs.length === 0) {
      if (selectedOutputId !== null) setSelectedOutputId(null)
      return
    }
    if (selectedOutputId && outputs.some((o) => o.id === selectedOutputId)) {
      return
    }
    setSelectedOutputId(outputs[0].id)
  }, [outputs, selectedOutputId])

  const selectedOutput = useMemo(() => {
    if (!outputs || outputs.length === 0 || !selectedOutputId) return null
    return outputs.find((o) => o.id === selectedOutputId) || null
  }, [outputs, selectedOutputId])

  const selectOutput = useCallback((id) => {
    setSelectedOutputId(id || null)
  }, [])

  return useMemo(() => ({ selectedOutput, selectedOutputId, selectOutput }), [selectedOutput, selectedOutputId, selectOutput])
}


/**
 * A component that reactively update the status of MIDI permission in the browser
 */
export function MidiStatus() {
  const midiPermission = useMidiPermissionStatus()

  const getStatusColor = (status) => {
    switch (status) {
      case 'granted':
        return 'text-green-600'
      case 'denied':
        return 'text-red-600'
      case 'prompt':
        return 'text-yellow-600'
      case 'unsupported':
        return 'text-gray-600'
      default:
        return 'text-blue-600'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'granted':
        return 'MIDI permission: Granted'
      case 'denied':
        return 'MIDI permission: Denied'
      case 'prompt':
        return 'MIDI permission: Prompt (awaiting user decision)'
      case 'unsupported':
        return 'MIDI permission: Not supported by Permissions API'
      default:
        return 'MIDI permission: Checking...'
    }
  }

  return (
    <div className="mb-4">
      <p className={`text-sm ${getStatusColor(midiPermission)}`}>
        {getStatusText(midiPermission)}
      </p>
    </div>
  )
}
/**
 * A component to request and display MIDI access status.
 */
export function MidiAccess() {
  const { status: midiPermission, midiAccess, inputs, outputs, error, enable } = useMidi()
  console.log(midiAccess)

  return (
    <div className="p-4 border rounded-lg mb-6">
      <h2 className="text-2xl font-semibold mb-2">1. MIDI Access</h2>
      {midiPermission === 'granted' && !midiAccess ? (
        <p className="text-green-600">MIDI Access Granted!</p>
      ) : (
        <button
          onClick={enable}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Request MIDI Access
        </button>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {midiAccess && <MidiDeviceSelector midiAccess={midiAccess} inputs={inputs} outputs={outputs} />}
    </div>
  )
}

/**
 * A component to select a MIDI output device and send notes.
 */
export function MidiDeviceSelector({ midiAccess, inputs, outputs }) {
  const [selectedOutput, setSelectedOutput] = useState(null)

  useEffect(() => {
    if (outputs.length > 0) {
      setSelectedOutput(outputs[0])
    }
  }, [midiAccess, outputs])

  const handleSendNote = () => {
    if (!selectedOutput) {
      alert('Please select a MIDI output device.')
      return
    }
    // Note On: channel 1, note 60 (C4), velocity 127
    selectedOutput.send([0x90, 60, 127])

    // Note Off: channel 1, note 60 (C4), velocity 0, after 1 second
    setTimeout(() => {
      selectedOutput.send([0x80, 60, 0])
    }, 1000)
  }

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2">2. Select MIDI Output</h3>
      {outputs.length > 0 ? (
        <div className="flex items-center gap-4">
          <select
            onChange={(e) => {
              const output = outputs.find((o) => o.id === e.target.value)
              setSelectedOutput(output || null)
            }}
            className="p-2 border rounded-lg"
          >
            {outputs.map((output) => (
              <option key={output.id} value={output.id}>
                {output.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSendNote}
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Send C4 Note
          </button>
        </div>
      ) : (
        <p>No MIDI output devices found.</p>
      )}
    </div>
  )
}
