import { useState, useRef } from 'react'
import { Upload, FileText, X, Volume2 } from 'lucide-react'
import { processPodcastData } from '../services/aiService'

interface PodcastConfig {
  files: File[]
  length: string
  tone: string
  audience: string
  focusAreas: string
  depthLevel: string
  hostVoice: string
  guestVoice: string
}

interface PodcastFormProps {
  onFormSubmit: () => void
}

export default function PodcastForm({ onFormSubmit }: PodcastFormProps) {
  const [config, setConfig] = useState<PodcastConfig>({
    files: [],
    length: '10',
    tone: 'educational',
    audience: 'general',
    focusAreas: '',
    depthLevel: 'balanced',
    hostVoice: 'David',
    guestVoice: 'Vincent'
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)

  const playVoiceSample = (voiceId: string) => {
    const audio = new Audio(`/sounds/${voiceId}.mp3`)
    setPlayingVoice(voiceId)
    audio.play().catch(err => {
      console.error('Error playing audio:', err)
      setPlayingVoice(null)
    })
    audio.onended = () => setPlayingVoice(null)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setConfig(prev => ({ ...prev, files: [...prev.files, ...newFiles] }))
    }
  }

  const removeFile = (index: number) => {
    setConfig(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await processPodcastData(config)
    onFormSubmit()
  }

  const hostVoiceOptions = [
    { value: 'David', voiceId: 'asDeXBMC8hUkhqqL7agO' },
    { value: 'Hale', voiceId: 'dXtC3XhB9GtPusIpNtQx' },
    { value: 'Stokes', voiceId: 'kHhWB9Fw3aF6ly7JvltC' },
    { value: 'Christina', voiceId: '2qfp6zPuviqeCOZIE9RZ' },
    { value: 'PodcastPat', voiceId: 'kzwbkY5EoyqzZKmPYLBN' }
  ]

  const guestVoiceOptions = [
    { value: 'Vincent', voiceId: 'Qe9WSybioZxssVEwlBSo' },
    { value: 'Bill Oxley', voiceId: 'T5cu6IU92Krx4mh43osx' },
    { value: 'Fiona', voiceId: 'RXtWW6etvimS8QJ5nhVk' },
    { value: 'Ms. Walker', voiceId: 'DLsHlh26Ugcm6ELvS0qi' },
    { value: 'Gracie', voiceId: '8vf2Pg7VZD0Piv8GA8v9' }
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white mb-1">
            Sources
          </h2>
          <p className="text-gray-400 text-xs">
            Upload your content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-scroll px-6 pb-4 scrollbar-hide">
            <div className="space-y-5">
              {/* File Upload Section */}
              <div>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 hover:bg-gray-700/50 transition-colors bg-gray-700/30"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300 mb-1 font-medium">
                    Add documents
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, Word, or text files
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Uploaded Files List */}
                {config.files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {config.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2.5 bg-gray-700 rounded-lg border border-gray-600"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs font-medium text-gray-200">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-gray-600 rounded transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Podcast Configuration */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <h3 className="text-sm font-semibold text-white">
                  Configuration
                </h3>

                {/* Length Preference */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Length
                  </label>
                  <select
                    value={config.length}
                    onChange={(e) => setConfig(prev => ({ ...prev, length: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="20">20+ minutes</option>
                  </select>
                </div>

                {/* Tone/Style */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Tone & Style
                  </label>
                  <select
                    value={config.tone}
                    onChange={(e) => setConfig(prev => ({ ...prev, tone: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="educational">Educational</option>
                    <option value="entertaining">Entertaining</option>
                    <option value="deep-dive">Deep Dive</option>
                    <option value="summary">Summary</option>
                    <option value="debate">Debate Style</option>
                  </select>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Target Audience
                  </label>
                  <select
                    value={config.audience}
                    onChange={(e) => setConfig(prev => ({ ...prev, audience: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="expert">Expert</option>
                    <option value="general">General Public</option>
                    <option value="students">Students</option>
                  </select>
                </div>

                {/* Voice Configuration */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Host Voice
                    </label>
                    <div className="relative">
                      <select
                        value={config.hostVoice}
                        onChange={(e) => setConfig(prev => ({ ...prev, hostVoice: e.target.value }))}
                        className="w-full px-3 py-2 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none"
                      >
                        {hostVoiceOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.value}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                        <button
                          type="button"
                          onClick={() => {
                            const selectedVoice = hostVoiceOptions.find(v => v.value === config.hostVoice)
                            if (selectedVoice) playVoiceSample(selectedVoice.voiceId)
                          }}
                          className="p-1 hover:bg-gray-600 rounded transition-colors pointer-events-auto"
                          title="Play voice sample"
                        >
                          <Volume2 className={`w-4 h-4 ${playingVoice === hostVoiceOptions.find(v => v.value === config.hostVoice)?.voiceId ? 'text-blue-400' : 'text-gray-400'}`} />
                        </button>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Guest Voice
                    </label>
                    <div className="relative">
                      <select
                        value={config.guestVoice}
                        onChange={(e) => setConfig(prev => ({ ...prev, guestVoice: e.target.value }))}
                        className="w-full px-3 py-2 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent appearance-none"
                      >
                        {guestVoiceOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.value}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                        <button
                          type="button"
                          onClick={() => {
                            const selectedVoice = guestVoiceOptions.find(v => v.value === config.guestVoice)
                            if (selectedVoice) playVoiceSample(selectedVoice.voiceId)
                          }}
                          className="p-1 hover:bg-gray-600 rounded transition-colors pointer-events-auto"
                          title="Play voice sample"
                        >
                          <Volume2 className={`w-4 h-4 ${playingVoice === guestVoiceOptions.find(v => v.value === config.guestVoice)?.voiceId ? 'text-blue-400' : 'text-gray-400'}`} />
                        </button>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Focus Areas */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Focus Areas
                  </label>
                  <textarea
                    value={config.focusAreas}
                    onChange={(e) => setConfig(prev => ({ ...prev, focusAreas: e.target.value }))}
                    placeholder="What aspects should the podcast emphasize?"
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Depth Level */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Depth Level
                  </label>
                  <select
                    value={config.depthLevel}
                    onChange={(e) => setConfig(prev => ({ ...prev, depthLevel: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-xs text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  >
                    <option value="surface">Surface Overview</option>
                    <option value="balanced">Balanced</option>
                    <option value="detailed">Detailed Analysis</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Button - Fixed at bottom */}
          <div className="p-6 pt-4 border-t border-gray-700 bg-gray-800 flex-shrink-0">
            <button
              type="submit"
              disabled={config.files.length === 0}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-sm"
            >
              Upload Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
