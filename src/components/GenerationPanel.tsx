import { useState } from 'react'
import { Sparkles, Download, Play, Pause } from 'lucide-react'

interface GenerationPanelProps {
  isDisabled: boolean
}

export default function GenerationPanel({ isDisabled }: GenerationPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hasGenerated, setHasGenerated] = useState(false)

  const handleGenerate = () => {
    if (isDisabled) return
    setIsGenerating(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setHasGenerated(true)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <div className="h-full flex flex-col">
      <div className={`bg-gray-800 rounded-xl shadow-sm border border-gray-700 flex-1 flex flex-col ${isDisabled ? 'opacity-50' : ''}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Studio</h2>
          <p className="text-xs text-gray-400">Generate and preview</p>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          {!hasGenerated && !isGenerating && (
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className={`w-8 h-8 ${isDisabled ? 'text-gray-600' : 'text-blue-500'}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isDisabled ? 'Upload Configuration First' : 'Ready to Generate'}
              </h3>
              <p className="text-sm text-gray-400 mb-6 max-w-xs">
                {isDisabled
                  ? 'Please upload your documents and configure settings first'
                  : 'Click generate to create your podcast'}
              </p>
              <button
                onClick={handleGenerate}
                disabled={isDisabled}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Generate Podcast
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="text-center w-full max-w-xs">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Generating Podcast
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Creating your audio content...
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{progress}% complete</p>
            </div>
          )}

          {hasGenerated && !isGenerating && (
            <div className="text-center w-full max-w-sm">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Podcast Generated
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Your podcast is ready to preview
              </p>

              {/* Audio Player Mockup */}
              <div className="bg-gray-700 rounded-lg border border-gray-600 p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">0:00</span>
                  <span className="text-xs text-gray-400">10:00</span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-1.5 mb-4">
                  <div className="bg-blue-600 h-1.5 rounded-full w-1/3" />
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 ml-0.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2.5 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
