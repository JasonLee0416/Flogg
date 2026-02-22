// src/services/visionApi.js — GPT-4o / Gemini 멀티모달 인수증 OCR
// ⚠️ 실제 배포 시 API 키를 환경변수(.env)로 관리하세요!

const CONFIG = {
  OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY_HERE',
  OPENAI_ENDPOINT: 'https://api.openai.com/v1/chat/completions',
  OPENAI_MODEL: 'gpt-4o',
  GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE',
  GEMINI_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
};

const PROMPT = `당신은 화환 배송 인수증 데이터 추출 전문가입니다.
첨부된 인수증 이미지에서 다음 정보를 추출하여 반드시 JSON 형식으로만 응답하세요.
다른 텍스트 없이 순수 JSON만 반환하세요.

추출 필드:
- destination: 배송 목적지 (예식장, 장례식장, 주소 등)
- orderer: 발주처/보내는 화환 가게명
- product_detail: 화환 종류 및 상품 내역
- ribbon_text: 리본 문구 (축하/조의 문구)

응답 형식:
{"destination":"","orderer":"","product_detail":"","ribbon_text":""}

정보가 없는 필드는 빈 문자열("")로 채우세요.`;

export async function extractWithOpenAI(base64Image) {
  const response = await fetch(CONFIG.OPENAI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: CONFIG.OPENAI_MODEL,
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: PROMPT },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}`, detail: 'low' } },
        ],
      }],
      max_tokens: 300,
      temperature: 0.1,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI API error (${response.status})`);
  const data = await response.json();
  const content = data.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

  return {
    destination: parsed.destination || '',
    orderer: parsed.orderer || '',
    productDetail: parsed.product_detail || '',
    ribbonText: parsed.ribbon_text || '',
    rawResponse: content,
  };
}

export async function extractWithGemini(base64Image) {
  const url = `${CONFIG.GEMINI_ENDPOINT}?key=${CONFIG.GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [
        { text: PROMPT },
        { inline_data: { mime_type: 'image/jpeg', data: base64Image } },
      ]}],
      generationConfig: { temperature: 0.1, maxOutputTokens: 300, responseMimeType: 'application/json' },
    }),
  });

  if (!response.ok) throw new Error(`Gemini API error (${response.status})`);
  const data = await response.json();
  const content = data.candidates[0]?.content?.parts[0]?.text || '{}';
  const parsed = JSON.parse(content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

  return {
    destination: parsed.destination || '',
    orderer: parsed.orderer || '',
    productDetail: parsed.product_detail || '',
    ribbonText: parsed.ribbon_text || '',
    rawResponse: content,
  };
}

// 데모 데이터 (API 키 미설정 시)
function getDemoData() {
  const demos = [
    { destination: '코엑스 아셈홀 3층', orderer: '꽃마을 화원', productDetail: '근조 3단 화환', ribbonText: '삼가 고인의 명복을 빕니다', rawResponse: '{"demo":true}' },
    { destination: 'JW메리어트 그랜드볼룸', orderer: '행복한 꽃배달', productDetail: '축하 3단 화환', ribbonText: '결혼을 축하합니다', rawResponse: '{"demo":true}' },
    { destination: '벡스코 제1전시장', orderer: '부산꽃집', productDetail: '개업 축하 2단', ribbonText: '사업번창을 기원합니다', rawResponse: '{"demo":true}' },
  ];
  return demos[Math.floor(Math.random() * demos.length)];
}

export async function extractReceiptData(base64Image) {
  if (CONFIG.OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE' &&
      CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    console.log('⚠️ API 키 미설정 - 데모 모드');
    return getDemoData();
  }
  try {
    if (CONFIG.OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY_HERE') return await extractWithOpenAI(base64Image);
    if (CONFIG.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') return await extractWithGemini(base64Image);
  } catch (err) {
    console.warn('Primary API failed:', err.message);
    try {
      if (CONFIG.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') return await extractWithGemini(base64Image);
    } catch (e2) { console.error('Fallback also failed:', e2.message); }
  }
  throw new Error('모든 AI API 호출 실패. API 키와 네트워크를 확인하세요.');
}
