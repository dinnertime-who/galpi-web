"use server";

import { genAi } from "../core";

export async function extractTextAction(formdata: FormData) {
  const base64Image = formdata.get("base64Image") as string;

  const prompt = `
    제공된 이미지는 책의 일부 텍스트만 남기고 나머지 배경은 모두 지워버린 뒤, 그 영역만 딱 맞게 오려낸(Cropped) 이미지이다.
    다음 규칙을 지켜서 텍스트를 추출해라:
    1. 이미지에 보이는 글자만 그대로 적어라.
    2. 잘려나가서 읽을 수 없는 글자는 제외해라.
    3. 문맥을 파악해서 오타(OCR 오류)가 있다면 자연스럽게 교정해라.
    4. 불필요한 기호나 설명 없이 오직 텍스트만 출력해라.
    5. 줄바꿈으로 인해 단어가 잘린 경우, 자연스럽게 이어서 출력해라.
  `;

  try {
    const response = await genAi.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        prompt, // 텍스트 프롬프트
        { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
      ],
    });

    return {
      result: response.text || "텍스트를 추출하지 못했습니다.",
    };
  } catch (error) {
    console.error(error);
    return {
      error: "텍스트를 추출하지 못했습니다. 다시 시도해주세요.",
    };
  }
}
