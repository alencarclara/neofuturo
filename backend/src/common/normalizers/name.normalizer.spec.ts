import { normalizeName } from './name.normalizer';

describe('normalizeName', () => {
    it('mantém um nome que já está correto', () => {
        expect(normalizeName('Maria da Silva')).toBe('Maria da Silva');
    });

    it('remove espaços do início e do fim', () => {
        expect(normalizeName('  Maria da Silva  ')).toBe('Maria da Silva');
    });

    it('reduz espaços repetidos no meio a um só', () => {
        expect(normalizeName('Maria   da    Silva')).toBe('Maria da Silva');
    });

    it('trata tabs e quebras de linha como espaços', () => {
        expect(normalizeName('Maria\tda\nSilva')).toBe('Maria da Silva');
    });

    it.each(['', '   ', '\t\n'])('rejeita nome vazio ou só com espaços: %j', (entrada) => {
        expect(() => normalizeName(entrada)).toThrow('Nome inválido');
    });
});