const messagesEl = document.getElementById('messages')

// 대화창에 말풍선 하나 추가하고, 나중에 내용을 바꿀 수 있게 그 엘리먼트를 돌려줌
function appendMessage(text, sender) {
  const el = document.createElement('div')
  el.className = 'msg ' + sender
  el.textContent = text
  messagesEl.appendChild(el)
  // 새 메시지가 보이도록 맨 아래로 스크롤
  messagesEl.scrollTop = messagesEl.scrollHeight
  return el
}

// 질문 보내기 동작 (버튼 클릭, 엔터 둘 다에서 재사용)
function sendPrompt() {
  const input = document.getElementById('q')
  const prompt = input.value.trim()
  if (!prompt) return

  // 내가 보낸 말풍선 먼저 표시
  appendMessage(prompt, 'user')
  input.value = ''

  // 응답 기다리는 동안 보여줄 임시 말풍선
  const pending = appendMessage('…', 'bot pending')

  // 내 서버(프록시) 창구로 요청 (키 없음)
  // fetch(...).then(...).then(...).catch(...) 처럼 점(.)으로 쭉 이어붙이는 걸 "메서드 체이닝"이라 함
  // "요청 보내고(fetch) → 성공하면(then) → 또 처리하고(then) → 실패하면(catch)" 순서로 연결됨
  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // 입력칸 값을 문자열로 바꿔 보내기
    body: JSON.stringify({ prompt })
  })
    // 응답을 객체로 변환
    .then(res => res.json())
    // 받은 답(reply)을 임시 말풍선 자리에 채워넣기
    .then(data => {
      pending.textContent = data.reply || data.error
      pending.classList.remove('pending')
    })
    // 서버가 안 켜져 있으면 안내 메시지
    .catch(() => {
      pending.textContent = '❌ 요청 실패 (로컬 테스트는 vercel dev 로 실행)'
      pending.classList.remove('pending')
    })
}

// '보내기' 버튼에 클릭 동작 연결
document.getElementById('btn').addEventListener('click', sendPrompt)

// 입력칸에서 엔터 치면 바로 전송
document.getElementById('q').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendPrompt()
})
