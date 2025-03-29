# 🐣 uxpeep

> **UX-focused React components for smart form field hints.**

**uxpeep**는 입력 중 힌트, 오류, 성공 메시지를 직관적으로 보여주는 React 컴포넌트 라이브러리입니다.  
직관적인 UX 피드백을 통해 사용자 경험을 한층 더 개선하세요 🧠✨

---

## 📦 설치하기

```bash
npm install uxpeep
```

또는

```bash
pnpm add uxpeep
```

---

## ⚡ 빠른 사용법

### 📝 `Peep.Field`

```tsx
<Peep.Field
  name='email'
  label='이메일'
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
```

### 💬 `Peep.Textarea`

```tsx
<Peep.Textarea
  name='bio'
  label='자기소개'
  value={bio}
  onChange={(e) => setBio(e.target.value)}
  required
/>
```

### 🌍 `Peep.Select`

```tsx
<Peep.Select
  name='country'
  label='국가'
  value={country}
  onChange={(e) => setCountry(e.target.value)}
  options={[
    { label: '대한민국', value: 'kr' },
    { label: '미국', value: 'us' },
  ]}
  required
/>
```

### ✅ `Peep.Checkbox`

```tsx
<Peep.Checkbox
  name='terms'
  label='이용약관에 동의합니다'
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
  required
/>
```

---

## 🎯 주요 기능

- ✅ `required`만 설정하면 자동 힌트 노출
- ✨ `peep()` 함수를 통한 커스텀 메시지
- ⏱️ `peepDelay`로 UX 타이밍 조절
- 🎛️ `peepOn="focus" | "input" | "always"` 트리거 지정 가능
- 🎨 `className`으로 스타일 유연하게 조정
- 📦 모든 컴포넌트는 독립적 + 일관된 UX 제공

---

## 📚 제공 컴포넌트

| 컴포넌트        | 설명                   |
| --------------- | ---------------------- |
| `Peep.Field`    | 기본 텍스트 입력 필드  |
| `Peep.Textarea` | 멀티라인 텍스트 필드   |
| `Peep.Select`   | 커스텀 셀렉트 드롭다운 |
| `Peep.Checkbox` | 체크박스               |

---

## 📄 라이선스

MIT License

---

## ✨ 만든 사람

**@kohi** — [Github](https://github.com/consoledotkohi/uxpeep)

Made with ❤️ for delightful form UX!
