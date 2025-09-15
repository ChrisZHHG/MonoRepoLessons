import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState<number>(0)
  const [name, setName] = useState<string>('')
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="App-header">
        <h1>Welcome to CS 5500, Chris!</h1>
        <p>This is my first React Vite TypeScript project.</p>
        
        <div className="interactive-section">
          <button onClick={() => setCount(count + 1)}>
            Count: {count}
          </button>
          
          <div className="input-section">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {name && <p>Hello, {name}!</p>}
          </div>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="toggle-button"
          >
            {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </header>
    </div>
  )
}

export default App