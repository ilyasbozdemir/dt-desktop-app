# Doğrudan Temin Masaüstü Uygulaması (dt-desktop-app) Geliştirme Kuralları

Bu dosya, uygulamanın baştan yazılma sürecinde uyulması gereken mimari ve teknik kuralları içerir. Antigravity (AI) olarak, verilen her yeni görevde bu kuralları göz önünde bulunduracağım.

## 1. Temel Teknoloji Yığını

- **Arayüz (Frontend):** Electron.js + TSX (React) + Vite (veya Electron-Vite).
- **Stil:** Tailwind CSS (`rem` tabanlı, erişilebilir ölçüler) + Radix UI (Headless bileşenler).
- **Veritabanı:** Yerel SQLite (önerilen: `better-sqlite3`).
- **Dil:** TypeScript (tüm yapı sıkı tiplendirmeli olacak).

## 2. Mimari Prensipler

- **CQRS (Command Query Responsibility Segregation):** Veri yazma (Command) ve veri okuma (Query) işlemleri birbirinden tamamen ayrılacaktır. Her işlemin kendi handler'ı (işleyicisi) olacaktır.
- **Repository Pattern:** Veritabanı erişimleri doğrudan bileşenler veya handler'lar içinden yapılmayacak; veri erişimi Repository katmanı üzerinden soyutlanacaktır.

## 3. Uygulama İşlevselliği ve Özellikler (README Referanslı)

- **Çevrimdışı (Offline) Çalışma:** Uygulama tamamen çevrimdışı çalışmalıdır. Hiçbir veri buluta veya dış sunucuya gönderilmeyecektir.
- **.dtm Dosya Formatı:** Veriler ZIP tabanlı `.dtm` dosyalarında tutulacaktır. Bu dosya içinde `database.sqlite` (ana veri) ve `attachments/` (ekler) bulunacaktır.
- **Mevzuata Uygunluk:** 4734 Sayılı Kamu İhale Kanunu Madde 22 kapsamında doğrudan temin süreçlerine uygun adım adım rehberli iş akışı sağlanacaktır.
- **Modülerlik:** Sınırsız dosya ve kalem eklenebilecek, kurumsal şablonlar `.docx`, `.xlsx` veya `.UDF` (DYS uyumlu) formatlarında dışa aktarılabilecektir.

## 4. Geliştirme Süreci (Antigravity İçin Talimatlar)

- Her yeni özellik eklendiğinde veya kod yazıldığında bu belgeye (mimari kurallara) uygunluk kontrol edilecektir.
- Dosya yapısı ve klasör isimlendirmeleri CQRS ve Repository pattern'e uygun şekilde (`commands`, `queries`, `handlers`, `repositories` vb.) dizayn edilecektir.
- Kodlar TypeScript ile sıkı tiplendirilerek (strict mode) yazılacak, `any` kullanımından kaçınılacaktır.
