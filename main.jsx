import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY가 설정되지 않았습니다.' });
  }

  try {
    const { cardIndex } = req.body;
    const ai = new GoogleGenAI({ apiKey });

    const cardTypes = [
      "따뜻하고 위로가 되는 응원의 말",
      "에너지 넘치고 열정적인 동기부여의 말",
      "위트 있고 유쾌하게 웃음을 주는 응원의 말"
    ];
    const selectedType = cardTypes[cardIndex] || cardTypes[0];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `곧 다가올 12월 생일을 기다리는 내 소중한 친구를 위해 \${selectedType}을(를) 한 문장으로 다정하게 작성해줘. 반말 코드로 친근하게 작성해줘.`
    });

    const cheerMessage = response.text.trim();

    return res.status(200).json({ cheerMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'AI 응원말 생성에 실패했습니다.' });
  }
}
