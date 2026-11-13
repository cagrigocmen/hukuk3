# Köybaşı Hukuk — Light, shaped.

Statik web sitesi. Derleme/npm gerekmez.

## Bilgisayarda açmak
`index.html` dosyasına çift tıklayın.
(Yazı tipleri Google Fonts'tan yüklenir; internet yoksa sistem serif/sans yazı tipleri kullanılır.)

## GitHub Pages ile yayınlamak
1. GitHub'da yeni bir repo oluşturun.
2. Bu klasörün **içindekileri** (klasörün kendisini değil) repoya yükleyin: *Add file → Upload files*.
3. Repo → **Settings → Pages → Branch: main / (root) → Save**.
4. Birkaç dakika sonra site `https://KULLANICI.github.io/REPO/` adresinde yayında olur.

## Yapı
- `index.html`, `objects.html`, `materials.html`, `our-approach.html`, `product.html?slug=lune`
- `css/style.css`, `js/app.js` (menü, sepet, animasyonlar), `js/products.js` (12 ürün verisi)
- `images/` — yer tutucu SVG görseller. Fotoğraf eklemek için `js/products.js` içindeki yolları değiştirin.

Sepet tarayıcının localStorage'ında saklanır. Checkout bağlı değildir (demo).
