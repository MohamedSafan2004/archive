# الأرشيف السري — Birthday Experience

## التشغيل

```bash
npm install
npm run dev
```

بعدين افتح: http://localhost:3000

## هتحتاج تحط الملفات دي (الأسماء موجودة في `src/lib/content.ts`)

### `public/images/`
- placeholder-1.jpg إلى placeholder-8.jpg (صور الذكريات)
- placeholder-secret.jpg (الذكرى السرية)
- vhs-poster-1.jpg, vhs-poster-2.jpg (بوسترات الفيديوهات)

### `public/videos/`
- placeholder-1.mp4, placeholder-2.mp4

### `public/audio/`
- ambient-theme.mp3 (موسيقى الخلفية)

## هتعدل ايه في `src/lib/content.ts`

1. **GATE_QUESTIONS** — الأسئلة السرية وإجاباتها المقبولة
2. **MEMORIES** — الذكريات، السنين، الوصف، الصور
3. **VHS_VIDEOS** — عناوين الفيديوهات
4. **LETTER_CONTENT** — نص الرسالة الأخيرة

## الـ Easter Eggs

- **Konami code**: ↑↑↓↓←→←→ba (لوحة المفاتيح) — بيفتح ذكرى سرية
- **الضغط على اللوجو 5 مرات** في الـ dashboard (فيه `id="archive-logo"`) — بيفتح ذكرى تانية

## ملاحظات تقنية

- الـ smooth scroll (Lenis) بيتفعل بس بعد الـ gate (dashboard, timeline, ending)
- كل صورة بتستخدم واحد من 3 transitions: `reveal-slide` / `mask-wipe` / `parallax-stack` — بتتحدد في `MEMORIES` لكل memory
- الصوت بيبدأ تلقائي أول ما تدخل الـ dashboard (لو مش muted)
- الموقع كله RTL (عربي)

## لو حابب تضيف صور حقيقية بسرعة للتجربة

حط أي صور بنفس الأسماء المذكورة فوق في `public/images/` وهتشتغل على طول من غير أي تعديل في الكود.
