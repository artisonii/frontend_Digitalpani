import { useState } from 'react'
import './App.css'
import Weather from './pages/Weather'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div id='app'>
      <Weather />
    </div>
  )
}

export default App
