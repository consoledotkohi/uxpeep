import React from 'react'
import ReactDOM from 'react-dom/client'

// 나중에 src에서 만든 PeepInput 가져오기
import { helloPeep } from '../src'

const App = () => {
  return (
    <div>
      <h1>👀 uxpeep playground</h1>
      <p>{helloPeep()}</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
