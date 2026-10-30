# MKS Advogados — landing golpe do Pix

Landing para o anúncio de golpe do Pix da Mendes, Kato & Sasaki Advogados Associados (Belém/PA).
HTML, CSS e JS puros, sem build. Mobile first.

- `index.html` — página
- `css/style.css` — estilos (tokens no `:root`)
- `js/main.js` — entradas ao rolar, aba do WhatsApp, formulário em 3 etapas
- `img/` — fotos do repositório do site institucional (MarceloCChaves/Mks-Advogados-Webpage), recortadas e em WebP
- `test/main.test.mjs` — `node test/main.test.mjs` (máscara do telefone e mensagem do WhatsApp)
- `HANDOFF.md` — explicação completa do projeto e pendências

Rodar local: `python3 -m http.server 5178` e abrir http://localhost:5178.

## Formulário

Três etapas, uma para cada divisa do logo:

1. Nome completo e WhatsApp com DDD (máscara de telefone)
2. Valor aproximado perdido (3 faixas) e há quanto tempo ocorreu (4 opções)
3. Nome do banco (com sugestões)

Ao enviar:
- manda uma cópia do lead por e-mail via FormSubmit (`mks.advogados01@gmail.com`, o mesmo do site institucional);
- abre `wa.me/5591933009749` (WhatsApp profissional de leads) com as respostas na mensagem;
- dispara o evento `generate_lead` no Google Analytics (G-9BD24FG4YH).

`privacidade.html` tem a Política de Privacidade e os Termos de Uso.

## Conferir antes de publicar

- O FormSubmit pede confirmação por e-mail no primeiro envio AJAX: fazer um envio de teste e clicar no link que chega.
- Política de Privacidade: prazo de 6 meses para excluir dados e demais textos são sugestões; revisar.
- Confirmar que o sócio de gravata vermelha na foto `img/socios-wide.webp` é o Dr. Felipe Kato.
- Aviso anti-golpe diz que a MKS só atende pelo (91) 93300-9749 e nunca cobra pela análise: confirmar.
- Pixel do Meta/Google Ads, se o anúncio usar.
