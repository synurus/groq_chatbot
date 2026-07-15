// 질문 보내기 동작 (버튼 클릭, 엔터 둘 다에서 재사용)
function sendPrompt() {
  // id="q" 입력칸에 적은 질문 꺼내기
  const prompt = document.getElementById('q').value

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
    // 받은 답(reply)을 id="ans" 자리에 표시
    .then(data => { document.getElementById('ans').textContent = data.reply || data.error })
    // 서버가 안 켜져 있으면 안내 메시지
    .catch(() => { document.getElementById('ans').textContent = '❌ 요청 실패 (로컬 테스트는 vercel dev 로 실행)' })
}

// '보내기' 버튼에 클릭 동작 연결
document.getElementById('btn').addEventListener('click', sendPrompt)

// 입력칸에서 엔터 치면 바로 전송
document.getElementById('q').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendPrompt()
})