import { useState } from 'react'
import './App.css'
import responses from './data/responses.json'
import stringSimilarity from 'string-similarity'

function App() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const findBotResponse = (userInput) => {
    const lowercaseInput = userInput.toLowerCase()
    
    // Find best matching response using fuzzy matching
    let bestMatch = null
    let highestSimilarity = 0.4 // Threshold for minimum similarity (0 to 1)

    responses.responses.forEach(item => {
      item.keywords.forEach(keyword => {
        // Check for exact matches first
        if (lowercaseInput.includes(keyword.toLowerCase())) {
          bestMatch = item
          highestSimilarity = 1
          return
        }

        // Check for fuzzy matches
        const similarity = stringSimilarity.compareTwoStrings(
          lowercaseInput,
          keyword.toLowerCase()
        )

        if (similarity > highestSimilarity) {
          highestSimilarity = similarity
          bestMatch = item
        }
      })
    })
    
    return bestMatch ? bestMatch.response : responses.defaultResponse
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessageObj = { text: inputMessage, sender: 'user' }
    setMessages([...messages, userMessageObj])
    setInputMessage('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [
        ...prev,
        { text: findBotResponse(inputMessage), sender: 'bot' }
      ])
    }, 1000)
  }

  return (
    <div className="container">
      <h1>ChatBot</h1>
      <div className="chat-box">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender}-message`}
            >
              {message.text}
            </div>
          ))}
          {isTyping && (
            <div className="message bot-message typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default App

