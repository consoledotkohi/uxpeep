import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

import { Peep } from '../src/components'

const App = () => {
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h1>uxpeep playground</h1>
      <div style={{ margin: '24px 0' }}>
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
          peepDelay={3000}
          peepOn='input' // 또는 "focus" / "always"
        />
      </div>
      <div style={{ margin: '24px 0' }}>
        <Peep.Textarea
          label='자기소개'
          name='bio'
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          peep={(v) =>
            v.length < 10
              ? { message: '10자 이상 입력해주세요', type: 'error' }
              : { message: '좋은 소개네요!', type: 'success' }
          }
        />
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
