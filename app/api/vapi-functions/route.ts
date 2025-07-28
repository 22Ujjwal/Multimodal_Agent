import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Vapi function call received:', body)
    
    // Handle different function calls
    if (body.function?.name === 'search_knowledge_base') {
      const query = body.function.parameters?.query
      
      if (!query) {
        return NextResponse.json({
          result: 'No search query provided'
        })
      }

      console.log('Searching knowledge base for:', query)

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

        // Timeout after 30 seconds
        setTimeout(() => {
          python.kill()
          reject(new Error('Knowledge base query timed out'))
        }, 30000)
      })

      console.log('Knowledge base results:', results)

      // Format results for Vapi
      if (results && typeof results === 'object' && (results as any).success) {
        const kbResults = (results as any).results
        if (kbResults && kbResults.length > 0) {
          // Create a summary of the top results
          const topResults = kbResults.slice(0, 3)
          const summary = topResults.map((result: any, index: number) => 
            `${index + 1}. From ${result.title} (Relevance: ${(result.score * 100).toFixed(1)}%): ${result.content.substring(0, 200)}...`
          ).join('\n\n')
          
          return NextResponse.json({
            result: `Found ${kbResults.length} relevant results for "${query}":\n\n${summary}\n\nBased on this information from AVEN's website, I can help answer your question.`
          })
        } else {
          return NextResponse.json({
            result: `I searched AVEN's knowledge base for "${query}" but didn't find specific information. However, I can provide general guidance about AVEN's services. For detailed information, I recommend contacting AVEN customer service at 1-800-AVEN-123.`
          })
        }
      } else {
        return NextResponse.json({
          result: 'I encountered an issue searching the knowledge base. Let me provide you with general information about AVEN\'s services, or you can contact customer service at 1-800-AVEN-123 for specific details.'
        })
      }
    }

    // Handle other function calls
    return NextResponse.json({
      result: 'Function not recognized'
    })
    
  } catch (error) {
    console.error('Vapi function call error:', error)
    return NextResponse.json(
      { result: 'I\'m experiencing technical difficulties. Please try again or contact AVEN customer service at 1-800-AVEN-123.' },
      { status: 500 }
    )
  }
}
