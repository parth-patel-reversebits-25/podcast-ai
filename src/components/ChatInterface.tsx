import { useState } from 'react'
import { Send } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  isDisabled: boolean
}

export default function ChatInterface({ isDisabled }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Welcome! Upload your documents and configure settings to generate your podcast.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim() || isDisabled) return

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInput('')

    // Simulate assistant response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I understand. Please make sure you have uploaded your documents and configured all settings in the left panel.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, response])
    }, 1000)
  }

  return (
    <div className="h-full flex flex-col">
      <div className={`bg-gray-800 rounded-xl shadow-sm border border-gray-700 flex-1 flex flex-col ${isDisabled ? 'opacity-50' : ''}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Chat</h2>
          <p className="text-xs text-gray-400">Ask questions about your podcast</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 border border-gray-600 text-gray-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isDisabled && handleSend()}
              placeholder={isDisabled ? "Upload configuration first..." : "Ask about your podcast..."}
              disabled={isDisabled}
              className="flex-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isDisabled}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
