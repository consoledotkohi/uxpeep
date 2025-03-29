import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

import { Peep } from '../src/components'

const App = () => {
  const [nickname, setNickname] = useState('')

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h1>uxpeep playground</h1>
      <Peep.Field
        label='닉네임'
        name='nickname'
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        peep={(v) => {
          if (!v) return { message: '닉네임을 입력해주세요', type: 'error' }
          if (v.length < 3)
            return { message: '3자 이상 입력해주세요', type: 'error' }
          return { message: '좋은 닉네임이에요!', type: 'success' }
        }}
        peepDelay={30}
        peepOn='input' // 또는 "focus" / "always"
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
