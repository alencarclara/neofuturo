import { normalizeEmail } from './email.normalizer';

describe('normalizeEmail', () => {
    it('converte para minúsculas e remove espaços das pontas', () => {
        expect(normalizeEmail('  Maria@Email.COM ')).toBe('maria@email.com');
    });

    it.each(['aluno@ufrj.br', 'joao@empresa.com.br', 'nome.sobrenome@neofuturo.dev'])(
        'aceita %j',
        (entrada) => {
            expect(normalizeEmail(entrada)).toBe(entrada);
        },
    );

    it.each([
        'maria.email.com',
        'maria@',
        '@email.com',
        'maria@email',
        'ma ria@email.com',
        'maria@@email.com',
        '',
    ])('rejeita %j', (entrada) => {
        expect(() => normalizeEmail(entrada)).toThrow('E-mail inválido');
    });
});