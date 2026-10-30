# Handoff — landing golpe do Pix (MKS Advogados)

Estado em 30/10/2026. Repo privado: `git@github.com:acostadanilo23/mks-golpe-pix.git`, branch `main`.

## O que é

Landing de uma página para o anúncio "golpe do Pix da falsa central" da **Mendes, Kato & Sasaki Advogados Associados** (Belém/PA, CNPJ 62.937.955/0001-27). Objetivo único: transformar o clique do anúncio em conversa no WhatsApp de leads, **(91) 93300-9749**.

Stack: HTML, CSS e JS puros. Sem build, sem dependência, sem framework. Mobile first. Qualquer hospedagem estática serve (GitHub Pages, Netlify, Vercel, cPanel).

```
index.html         a landing
privacidade.html   Política de Privacidade + Termos de Uso (#termos)
css/style.css      todos os estilos; tokens de cor e fonte no :root
js/main.js         animações de entrada, cabeçalho, aba do WhatsApp, formulário
img/*.webp         fotos (vêm do repo do site institucional, recortadas)
test/main.test.mjs testes da máscara de telefone e da mensagem
favicon.ico
```

Rodar local:

```bash
python3 -m http.server 5178
```

Testes (devem imprimir `ok`):

```bash
node test/main.test.mjs
```

## Como a página está montada (de cima para baixo)

1. **Cabeçalho fixo** (`.top`): logo com as divisas, menu, botão dourado "Análise gratuita". Fica branco ao rolar (`.is-solid`).
2. **Hero**: foto dos sócios (`socios-wide.webp`) com véu azul-marinho, título "Caiu no golpe do Pix da falsa central?", promessa em itálico dourado, botão verde do WhatsApp e o **card branco do formulário** (`#analise`).
3. **Faixa de fundamentos** (`.basis`): Súmula 479 do STJ, CDC art. 14, MED do Pix.
4. **Prazo** (`#prazo`): "Por que o tempo é o seu maior inimigo?" com lista de chances por prazo.
5. **Como funciona** (`#como`): Preenchimento → Análise do caso → Direcionamento jurídico.
6. **Equipe** (`#equipe`):
   - Dr. Felipe Kato, sócio e advogado responsável, OAB/PA 40.586-B;
   - Dr. Hikaru Sasaki, sócio, OAB/PA 37.982;
   - card do escritório com endereço, CNPJ e @mks.advogados.
7. **Alerta** "Cuidado com um segundo golpe": o escritório só atende pelo número oficial e não cobra pela análise.
8. **FAQ** (`#duvidas`): acordeão `<details>` + botão do WhatsApp.
9. **Fechamento**: "Quanto antes, melhor." com botão grande do WhatsApp.
10. **Rodapé**: endereço (Av. Gov. José Malcher, 153, CEP 66.035-065), contato, Instagram, OAB do responsável, links legais.
11. **Aba flutuante do WhatsApp** (`.wa-tab`): aparece depois do hero e some quando o formulário, o FAQ ou o fechamento estão na tela, para não cobrir nada. No celular mostra só o ícone.

## Formulário (o coração da página)

São três etapas, uma para cada divisa do logo, que acende conforme avança:

1. Nome completo + WhatsApp com DDD (máscara `(91) 98765-4321`)
2. Valor perdido (até R$ 5 mil / 5 a 20 mil / acima de 20 mil) + há quanto tempo (menos de 48 h / menos de 7 dias / 7 a 30 dias / mais de 30 dias)
3. Nome do banco (com sugestões via `<datalist>`)

Cada etapa valida antes de seguir; Enter avança.

Ao enviar, `js/main.js`:

1. Manda uma cópia do lead por e-mail via **FormSubmit**, por AJAX, para `mks.advogados01@gmail.com`. Se falhar, o fluxo segue sem travar.
2. Dispara `generate_lead` no **Google Analytics** `G-9BD24FG4YH`.
3. Abre `wa.me/5591933009749` com a mensagem pronta:

```
Olá! Vim pelo site da MKS Advogados. Caí no golpe do Pix da falsa central.
Nome: …
WhatsApp: …
Valor perdido: …
Quando ocorreu: …
Banco: …
Quero recuperar meu dinheiro.
```

Para trocar o número ou o e-mail, mexa nas constantes `WA` e `LEADS` no topo do `js/main.js` **e** procure `5591933009749` no `index.html`, porque os links dos botões são estáticos.

## Visual

- **Direção**: "claro e premium", inspirada nos sites de Pinheiro Neto, Demarest, Veirano, Lefosse e BMA: foto com véu, título serifado, muito branco, dourado como detalhe.
- **Cores**:
  - branco;
  - névoa (fundo claro de seções);
  - azul-marinho `#0e1a2e`;
  - dourado `#c39a45`;
  - verde WhatsApp `#25d366` com texto `#052e16`.
- **Fontes**: Cormorant Garamond (títulos) + Instrument Sans (texto), pelo Google Fonts.
- **Animações**:
  - seções entram ao rolar (IntersectionObserver);
  - os botões verdes têm brilho que passa (`wa-sheen`) e pulso (`wa-pulse`), pedido do cliente para chamar atenção;
  - tudo desliga com `prefers-reduced-motion`.
- **Regra da casa**: sem gradientes, sombras ou ícones decorativos. A exceção é o brilho e o pulso do botão verde, marcados com `/* taste-skill-ignore */`.

## Decisões e dados confirmados com o escritório

- **Responsável técnico**: Dr. Felipe Kato, OAB/PA 40.586-B.
- **Dr. Hikaru Sasaki**: OAB/PA 37.982.
- **Vinicius Mendes saiu do escritório**: nenhuma foto nem menção a ele. A foto do escritório onde ele aparecia foi removida.
- **"Análise gratuita"**: liberado pelo escritório.
- **Destino dos leads**: WhatsApp (91) 93300-9749, com cópia no e-mail mks.advogados01@gmail.com.
- **Marcelo Chaves**: é dev parceiro (fez o site institucional), não advogado. Não aparece na página.
- **Domínio**: mksadvogados.adv.br não resolvia durante o trabalho; as fotos vieram do repo `MarceloCChaves/Mks-Advogados-Webpage`.

## Falta antes de publicar

- [ ] **Ativar o FormSubmit**. O primeiro envio dispara um e-mail de confirmação para mks.advogados01@gmail.com; alguém precisa clicar no link, senão os leads não chegam por e-mail. O WhatsApp funciona de qualquer jeito.
- [ ] Confirmar que o sócio de **gravata vermelha** em `img/socios-wide.webp` é o Dr. Felipe Kato.
- [ ] Confirmar o texto anti-golpe: "só atendemos pelo (91) 93300-9749 e nunca cobramos pela análise".
- [ ] Revisar a Política de Privacidade. O prazo de 6 meses para excluir dados é sugestão.
- [ ] Pixel do Meta e/ou tag do Google Ads, se o anúncio for medir conversão. O lugar natural é junto do `gtag` no `<head>` do `index.html` e do evento de envio no `js/main.js`.
- [ ] **Hospedar** (ainda não está no ar) e apontar domínio ou subdomínio.
- [ ] Teste final no celular real: preencher o formulário até abrir o WhatsApp.

## Histórico resumido

1. Primeira versão: hero, quiz de 3 perguntas, equipe, FAQ.
2. Removido o número gigante do WhatsApp; entrou a copy nova do cliente (falsa central, 5 campos, urgência, passo a passo, privacidade).
3. Aplicadas as respostas do escritório (Vinicius fora, número de leads, CNPJ, OABs).
4. Dois redesenhos completos, porque o visual anterior estava escuro e não parecia advocacia. O atual veio da pesquisa dos grandes escritórios.
5. CTA verde com logo do WhatsApp, brilho e pulso; Instagram dos sócios e do escritório.
6. Corrigido o botão de envio que estourava o card no desktop.
7. Número de leads trocado para (91) 93300-9749; Instagram dos sócios removido (fica só o @mks.advogados).
