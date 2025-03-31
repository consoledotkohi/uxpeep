import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

import { Peep } from '../src/components'

const App = () => {
  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  const [country, setCountry] = useState('')
  const [agreement, setAgreement] = useState(false)
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
          peepDelay={0}
          peepOn='input'
          required
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
      <div style={{ margin: '24px 0' }}>
        <Peep.Select
          name='country'
          label='국가 선택'
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          options={[
            { label: '대한민국', value: 'kr' },
            { label: '미국', value: 'us' },
          ]}
          required
        />
      </div>
      <div style={{ margin: '24px 0' }}>
        <Peep.Checkbox
          name='agreement'
          label='동의'
          checked={agreement}
          onChange={(e) => setAgreement(e.target.checked)}
          required
        />
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
