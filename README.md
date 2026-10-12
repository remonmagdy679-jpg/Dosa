# Dosa — متجر الأجهزة الذكية

موقع static جاهز لـ **GitHub Pages**، من غير أي سيرفر.

## الملفات
```
index.html              ← الصفحة
assets/css/style.css    ← التصميم
assets/js/config.js     ← كل بيانات المتجر (عدّل هنا بس)
assets/js/app.js        ← البرمجة
assets/img/             ← حط صور المنتجات هنا
```

## الرفع على GitHub Pages
1. اعمل Repository جديد (مثلاً `dosa`).
2. ارفع كل الملفات والفولدرات زي ما هي (Add file ← Upload files).
3. Settings ← Pages ← Source: `Deploy from a branch` ← Branch: `main` / `root` ← Save.
4. بعد دقيقة الموقع هيكون على: `https://USERNAME.github.io/dosa/`

## قبل ما تنزله للعملاء (في config.js)
- `whatsapp`: رقمك بصيغة `2010xxxxxxxx`.
- `showThemePicker: false` عشان زرار الألوان يختفي.
- `defaultPalette`: اسم الباليتة اللي اخترتها (sunset / ocean / royal / forest / gold).
- `images`: لينكات صور المنتج الحقيقية، مثلاً `["assets/img/1.jpg","assets/img/2.jpg"]`.
- `video`: لينك فيديو يوتيوب.
- الأسعار والباقات والمواصفات والكوبونات.

## الطلبات
دلوقتي الطلب بيتبعت لك على **الواتساب** كرسالة جاهزة.
بعد ربط **صفقة**، السطر المكتوب عليه `TODO` في `app.js` هيبعت الطلب لـ Cloudflare Worker، وهو اللي يبعته لصفقة. **ممنوع تحط مفتاح الـ API في أي ملف هنا**، لأن أي حد يقدر يشوفه.
