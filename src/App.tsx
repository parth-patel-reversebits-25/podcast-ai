import { useState } from 'react'
import PodcastForm from './components/PodcastForm'
import ChatInterface from './components/ChatInterface'
import GenerationPanel from './components/GenerationPanel'

function App() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">
          AI Podcast Generator
        </h1>
      </div>

      {/* Three Column Layout */}
      <div className="h-[calc(100vh-6rem)] grid grid-cols-12 gap-4">
        {/* Left Panel - Sources */}
        <div className="col-span-3 overflow-hidden">
          <PodcastForm onFormSubmit={() => setIsFormSubmitted(true)} />
        </div>

        {/* Center Panel - Chat */}
        <div className="col-span-5 overflow-hidden">
          <ChatInterface isDisabled={!isFormSubmitted} />
        </div>

        {/* Right Panel - Studio */}
        <div className="col-span-4 overflow-hidden">
          <GenerationPanel isDisabled={!isFormSubmitted} />
        </div>
      </div>
    </div>
  )
}

export default App
