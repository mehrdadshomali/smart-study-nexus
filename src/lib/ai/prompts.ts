/**
 * AI Prompt Templates
 */

export const PROMPTS = {
  // Note summarization
  SUMMARIZE_NOTE: `Sen bir öğrenme asistanısın. Aşağıdaki notu özetle.
Özet:
- Kısa ve öz olmalı (maksimum 3-4 cümle)
- Ana fikirleri içermeli
- Türkçe olmalı

Not içeriği:
{content}

Özet:`,

  // Question generation from note
  GENERATE_QUESTIONS: `Sen bir eğitim uzmanısın. Aşağıdaki not içeriğinden {count} adet çalışma sorusu oluştur.

Kurallar:
- Sorular içerikle doğrudan ilgili olmalı
- Farklı zorluk seviyelerinde olmalı
- Çoktan seçmeli, doğru/yanlış ve kısa cevaplı sorular karışık olmalı
- Her soru için doğru cevabı ve kısa bir açıklama ekle
- Türkçe olmalı

Not içeriği:
{content}

JSON formatında yanıt ver:
{
  "questions": [
    {
      "type": "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER",
      "questionText": "Soru metni",
      "options": ["A", "B", "C", "D"] | null,
      "correctAnswer": "Doğru cevap",
      "explanation": "Açıklama",
      "difficulty": "EASY" | "MEDIUM" | "HARD"
    }
  ]
}`,

  // PDF RAG - Answer generation
  RAG_ANSWER: `Sen bir yardımcı asistansın. Kullanıcının sorusunu verilen bağlam bilgisini kullanarak yanıtla.

Kurallar:
- Sadece verilen bağlamdaki bilgileri kullan
- Bağlamda olmayan bilgileri uydurma
- Emin değilsen "Bu bilgi dokümanda bulunamadı" de
- Yanıtın sonunda kaynak sayfa numaralarını belirt
- Türkçe yanıt ver

Bağlam:
{context}

Kullanıcı Sorusu: {question}

Yanıt:`,

  // Flashcard generation
  GENERATE_FLASHCARDS: `Sen bir öğrenme asistanısın. Aşağıdaki içerikten {count} adet flashcard (çalışma kartı) oluştur.

Kurallar:
- Her kartın ön yüzünde soru/kavram, arka yüzünde cevap/açıklama olmalı
- Kartlar öğrenmeyi kolaylaştıracak şekilde tasarlanmalı
- Türkçe olmalı

İçerik:
{content}

JSON formatında yanıt ver:
{
  "flashcards": [
    {
      "front": "Ön yüz (soru/kavram)",
      "back": "Arka yüz (cevap/açıklama)"
    }
  ]
}`,

  // OCR text correction
  CORRECT_OCR: `Aşağıdaki metin OCR (optik karakter tanıma) ile çıkarılmıştır ve hatalar içerebilir.
Metni düzelt ve temizle. Anlam bütünlüğünü koru.

OCR Metni:
{text}

Düzeltilmiş Metin:`,

  // Mind map suggestions
  SUGGEST_CONNECTIONS: `Aşağıdaki not başlıkları ve içerik özetleri verilmiştir.
Aralarındaki mantıksal bağlantıları tespit et.

Notlar:
{notes}

JSON formatında yanıt ver:
{
  "connections": [
    {
      "sourceId": "not1_id",
      "targetId": "not2_id",
      "reason": "Bağlantı nedeni"
    }
  ]
}`,
}

/**
 * Fill prompt template with values
 */
export function fillPrompt(template: string, values: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  }
  return result
}
