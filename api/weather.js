// Vercel Serverless Function: /api/weather
// 국내 지역명을 받아 OpenWeatherMap 현재 날씨를 조회
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST만 허용됩니다' })
    return
  }

  const location = (req.body && req.body.location || '').trim()
  if (!location) {
    res.status(400).json({ error: '지역을 입력해주세요' })
    return
  }

  // Vercel 프로젝트 환경변수(Settings > Environment Variables)에서 읽음
  const key = process.env.OPENWEATHER_API_KEY
  // 키 없어도 멈추지 않게 가짜 날씨
  if (!key) {
    res.status(200).json({
      location,
      temp: 24,
      feelsLike: 25,
      tempMin: 20,
      tempMax: 27,
      humidity: 55,
      windSpeed: 2.1,
      description: '(mock) 맑음'
    })
    return
  }

  const url = 'https://api.openweathermap.org/data/2.5/weather'
    + '?q=' + encodeURIComponent(location) + ',KR'
    + '&appid=' + key
    + '&units=metric&lang=kr'

  const weatherRes = await fetch(url)
  const data = await weatherRes.json()

  if (String(data.cod) !== '200') {
    let message = '날씨 조회에 실패했어요 (' + data.cod + ')'
    if (String(data.cod) === '404') message = '해당 지역을 찾을 수 없어요'
    if (String(data.cod) === '401') message = 'API 키가 아직 유효하지 않아요 (발급 후 최대 2시간 정도 걸릴 수 있어요)'
    res.status(200).json({ error: message })
    return
  }

  res.status(200).json({
    location: data.name,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    windSpeed: data.wind ? data.wind.speed : 0,
    description: data.weather && data.weather[0] ? data.weather[0].description : ''
  })
}
