import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PYTHON_PROJECT = '/Users/lishi/Desktop/AdvanceTheroyDataSet/ChordProgressionTransformer'
const PYTHON_IN_VENV = '/Users/lishi/Desktop/AdvanceTheroyDataSet/venv/bin/python'
const PYTHON_CMD = fs.existsSync(PYTHON_IN_VENV) ? PYTHON_IN_VENV : 'python3'
const SCRIPT_PATH = path.join(PYTHON_PROJECT, 'web_generate.py')

async function runPython(args: string[]) {
  return new Promise<Record<string, unknown>>((resolve, reject) => {
    const proc = spawn(PYTHON_CMD, [SCRIPT_PATH, ...args], {
      cwd: PYTHON_PROJECT,
      env: {
        ...process.env,
        PYTHONPATH: [PYTHON_PROJECT, process.env.PYTHONPATH].filter(Boolean).join(':'),
      },
    })

    let stdout = ''
    let stderr = ''

    const killTimer = setTimeout(() => {
      proc.kill('SIGKILL')
      reject(new Error('Generation timed out'))
    }, 30000)

    proc.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    proc.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    proc.on('error', (err) => {
      clearTimeout(killTimer)
      reject(err)
    })

    proc.on('close', (code) => {
      clearTimeout(killTimer)
      if (code !== 0 && !stdout.trim()) {
        reject(new Error(stderr || `Python exited with code ${code}`))
        return
      }

      try {
        const payload = JSON.parse(stdout.trim()) as any
        if (payload?.success === false) {
          reject(new Error(typeof payload.error === 'string' ? payload.error : 'Python error'))
          return
        }
        resolve(payload as Record<string, unknown>)
      } catch (err) {
        reject(new Error(`Failed to parse python response: ${(err as Error).message}. Raw: ${stdout || stderr}`))
      }
    })
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      numBars = 8,
      chordsPerBar = 2,
      temperature = 0.9,
      numCandidates = 8,
      topK = 50,
      topP = 0.95,
    } = body || {}

    const args = [
      '--num_bars',
      String(numBars),
      '--chords_per_bar',
      String(chordsPerBar),
      '--temperature',
      String(temperature),
      '--num_candidates',
      String(numCandidates),
      '--top_k',
      String(topK),
      '--top_p',
      String(topP),
    ]

    const payload = await runPython(args)
    return NextResponse.json(payload)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
