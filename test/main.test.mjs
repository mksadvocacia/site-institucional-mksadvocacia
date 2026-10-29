// node test/main.test.mjs — checa a máscara do telefone e a mensagem do WhatsApp
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx = { matchMedia: () => ({ matches: false }) };
vm.runInNewContext(readFileSync(new URL('../js/main.js', import.meta.url), 'utf8') + ';this.f=formatPhone;this.ok=phoneOk;this.b=buildMessage;', ctx);

assert.equal(ctx.f(''), '');
assert.equal(ctx.f('9'), '(9');
assert.equal(ctx.f('91988'), '(91) 988');
assert.equal(ctx.f('91988887777'), '(91) 98888-7777');
assert.equal(ctx.f('9132221111'), '(91) 3222-1111');
assert.equal(ctx.f('+55 91 98888-7777'), '(91) 98888-7777');
assert.equal(ctx.f('919888877779999'), '(91) 98888-7777'); // corta em 11 dígitos
assert.ok(ctx.ok('(91) 98888-7777'));
assert.ok(!ctx.ok('(91) 9888'));
const msg = ctx.b({ nome: 'Ana Lima', whatsapp: '(91) 98888-7777', valor: 'Até R$ 5.000', quando: 'Menos de 48 horas', banco: 'Banpará' });
for (const part of ['Nome: Ana Lima', 'WhatsApp: (91) 98888-7777', 'Valor perdido: Até R$ 5.000', 'Quando ocorreu: Menos de 48 horas', 'Banco: Banpará'])
  assert.ok(msg.includes(part), part);
console.log('ok');
