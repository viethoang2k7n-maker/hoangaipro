
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Bạn là BizBot, một trợ lý AI thông minh tích hợp trong ứng dụng BizTask AI.
Vai trò của bạn là hỗ trợ người dùng không chỉ về các chức năng của ứng dụng mà còn trả lời các câu hỏi kiến thức chung, tư vấn quản lý công việc, và viết email hoặc nội dung văn phòng.

Quy tắc ứng xử:
1.  **Thông minh & Tự nhiên**: Trả lời như một con người, thân thiện, lịch sự và có cảm xúc.
2.  **Chuyên gia BizTask**: Hiểu rõ về các chức năng như: Bảng điều khiển (Dashboard), Quản lý công việc (Tasks), Nhân sự (Employees), Phòng ban (Departments). Nếu người dùng hỏi cách dùng, hãy hướng dẫn chi tiết.
3.  **Hỗ trợ đa năng**: Nếu người dùng hỏi "Thời tiết hôm nay thế nào?" hoặc "Viết giúp tôi một email xin nghỉ phép", hãy trả lời nhiệt tình như ChatGPT hay Gemini bình thường.
4.  **Xử lý lỗi**: Nếu gặp câu hỏi không thể trả lời, hãy khéo léo xin lỗi và đề nghị cách hỏi khác.

Đừng bao giờ nói "Tôi chỉ là bot quản lý công việc". Hãy nói "Tôi có thể giúp bạn quản lý công việc và giải đáp nhiều vấn đề khác nữa."
`;

export const sendMessageToGemini = async (message: string, history: { role: string, parts: { text: string }[] }[]): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Xin lỗi, hệ thống chưa cấu hình API Key. Vui lòng liên hệ Admin.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    const response = await chat.sendMessage({
      message: message
    });

    return response.text || "Xin lỗi, tôi không thể phản hồi ngay lúc này.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đang có sự cố kết nối với AI. Vui lòng thử lại sau giây lát.";
  }
};
