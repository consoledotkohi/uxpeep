import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

import { Peep } from '../src/components/Peep'

const App = () => {
  const [nickname, setNickname] = useState('')

  return (
    <div style={{ padding: '2rem' }}>
      <h1>uxpeep playground</h1>
      <Peep.Field
        label='닉네임'
        name='nickname'
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        peep={(v) => (!v ? '이름이 비어 있어요' : '')}
        peepDelay={300}
        peepOn='focus' // 또는 "input" / "always"
      />
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
