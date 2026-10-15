import { normalizeCep } from './cep.normalizer';

describe('normalizeCep', () => {
    it.each([
        ['01001000', '01001000'],
        ['01001-000', '01001000'],
        [' 01001 000 ', '01001000'],
        ['01.001-000', '01001000'],
    ])('normaliza %j para %j', (entrada, esperado) => {
        expect(normalizeCep(entrada)).toBe(esperado);
    });

    it.each(['', '123', '010010000', 'abcdefgh'])('rejeita %j', (entrada) => {
        expect(() => normalizeCep(entrada)).toThrow('CEP inválido');
    });
});