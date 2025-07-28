import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Call Python script to query the knowledge base
    const pythonScript = path.join(process.cwd(), 'scripts', 'query_knowledge_base.py')
    const venvPython = path.join(process.cwd(), 'venv', 'bin', 'python')
    
    const results = await new Promise((resolve, reject) => {
      const python = spawn(venvPython, [pythonScript, query])
      let output = ''
      let error = ''

      python.stdout.on('data', (data) => {
        output += data.toString()
      })

      python.stderr.on('data', (data) => {
        error += data.toString()
      })

      python.on('close', (code) => {
        if (code === 0) {
          try {
            const results = JSON.parse(output)
            resolve(results)
          } catch (e) {
            reject(new Error('Failed to parse Python script output'))
          }
        } else {
          reject(new Error(`Python script failed: ${error}`))
        }
      })
    })

    return NextResponse.json({ results })
    
  } catch (error) {
    console.error('Knowledge base query error:', error)
    return NextResponse.json(
      { error: 'Failed to query knowledge base' },
      { status: 500 }
    )
  }
}
