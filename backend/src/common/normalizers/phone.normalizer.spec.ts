import { normalizePhone } from './phone.normalizer';

describe('normalizePhone', () => {
    it.each([
        ['21987654321', '(21) 98765-4321'],
        ['(21) 98765-4321', '(21) 98765-4321'],
        ['21 98765-4321', '(21) 98765-4321'],
        ['+55 21 98765-4321', '(21) 98765-4321'],
        ['5521987654321', '(21) 98765-4321'],
    ])('normaliza %j para %j', (entrada, esperado) => {
        expect(normalizePhone(entrada)).toBe(esperado);
    });

    describe('rejeita tamanho errado', () => {
        it.each(['2198765', '219876543210', '1121987654321', ''])('%j', (entrada) => {
            expect(() => normalizePhone(entrada)).toThrow('deve ter 11 dígitos');
        });
    });

    describe('rejeita formato inválido', () => {
        it('DDD começando com 0', () => {
            expect(() => normalizePhone('01987654321')).toThrow('DDD válido');
        });

        it('número que não começa com 9 (fixo)', () => {
            expect(() => normalizePhone('21887654321')).toThrow('começar com 9');
        });
    });
});