# MKS Advogados — landing golpe do Pix

Landing para o anúncio de golpe do Pix da Mendes, Kato & Sasaki Advogados Associados (Belém/PA).
HTML, CSS e JS puros, sem build. Mobile first.

- `index.html` — página
- `css/style.css` — estilos (tokens no `:root`)
- `js/main.js` — crossfade do hero, entradas, formulário de 3 perguntas
- `img/` — fotos do repositório do site institucional (MarceloCChaves/Mks-Advogados-Webpage), recortadas e em WebP
- `test/main.test.mjs` — `node test/main.test.mjs` (formatação do valor e mensagem do WhatsApp)

Rodar local: `python3 -m http.server 5178` e abrir http://localhost:5178.

## Formulário

1. Qual o seu nome?
2. Quanto dinheiro foi perdido no golpe? (máscara R$)
3. O golpista se passou por um agente do banco? (Sim / Não)

Ao enviar, abre `wa.me/5591985560099` com as respostas na mensagem. Nada é salvo no site.
Dispara o evento `generate_lead` no Google Analytics (mesmo ID do site, G-9BD24FG4YH).
Há também uma aba fixa de WhatsApp que aparece depois do primeiro screen.

## Conferir antes de publicar

- Números da OAB dos advogados e do escritório (o Código de Ética pede nome e inscrição na publicidade).
- Se o Dr. Vinicius Mendes é mesmo o responsável pelos casos de Pix (inferido da área: Direito Bancário).
- Texto do FAQ "Quanto custa?" e as respostas sobre MED e Súmula 479 do STJ.
- Pixel do Meta/Google Ads, se o anúncio usar.
- Banner de cookies/LGPD, se exigido pela campanha.
