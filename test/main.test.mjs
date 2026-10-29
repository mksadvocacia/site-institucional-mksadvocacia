// node test/main.test.mjs — checa a formatação do valor e a mensagem do WhatsApp
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const ctx = { matchMedia: () => ({ matches: false }) };
vm.runInNewContext(readFileSync(new URL('../js/main.js', import.meta.url), 'utf8') + ';this.f=formatBRL;this.b=buildMessage;', ctx);

assert.equal(ctx.f(''), '');
assert.equal(ctx.f('5'), '0,05');
assert.equal(ctx.f('150000'), '1.500,00');
assert.equal(ctx.f('R$ 12.345,67'), '12.345,67');
assert.equal(ctx.f('00012'), '0,12');
assert.equal(ctx.f('123456789012345'), '123.456.789,01'); // corta em 11 dígitos
const msg = ctx.b({ nome: 'Ana', valor: '1.500,00', banco: 'Sim' });
assert.match(msg, /Nome: Ana/);
assert.match(msg, /R\$ 1\.500,00/);
assert.match(msg, /agente do banco: Sim/);
console.log('ok');
