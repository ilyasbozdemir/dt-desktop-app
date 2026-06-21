const birler = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const onlar = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];

export function sayiyiYaziyaCevir(n: number): string {
  if (n === 0) return 'sıfır';
  if (n === 100) return 'yüz';
  if (n > 100 && n < 1000) {
    const yuzler = Math.floor(n / 100);
    const kalan = n % 100;
    const yuzMetin = yuzler === 1 ? 'yüz' : birler[yuzler] + ' yüz';
    return (yuzMetin + (kalan ? ' ' + sayiyiYaziyaCevir(kalan) : '')).trim();
  }
  const onlarBasamagi = Math.floor(n / 10);
  const birlerBasamagi = n % 10;
  return (onlar[onlarBasamagi] + (birlerBasamagi ? ' ' + birler[birlerBasamagi] : '')).trim();
}

export const SAYI_YAZI_MAP: Record<number | string, string> = {};

for (let i = 1; i <= 100; i++) {
  SAYI_YAZI_MAP[i] = `${i} (${sayiyiYaziyaCevir(i)})`;
}
