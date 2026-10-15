import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateContactDto } from '../contacts/dto/create-contact.dto';
import { parseIntParam, validationMessages } from './validation';

describe('validationMessages', () => {
    it('traduz o erro de campo não permitido', async () => {
        const dto = plainToInstance(CreateContactDto, {
            fullName: 'Campo Extra',
            email: 'extra@email.com',
            phone: '21999990000',
            idade: 30,
        });
        const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });

        expect(validationMessages(errors)).toEqual(['O campo "idade" não é permitido']);
    });

    it('mantém as mensagens próprias dos DTOs', async () => {
        const dto = plainToInstance(CreateContactDto, { email: 'a@b.com', phone: '21999990000' });
        const errors = await validate(dto);

        expect(validationMessages(errors)).toEqual(['O nome é obrigatório', 'O nome deve ser um texto']);
    });
});

describe('parseIntParam', () => {
    const pipe = parseIntParam('O id do contato');

    it('converte números', async () => {
        await expect(pipe.transform('42', { type: 'param' })).resolves.toBe(42);
    });

    it('rejeita texto com mensagem em português', async () => {
        await expect(pipe.transform('abc', { type: 'param' })).rejects.toThrow(
            'O id do contato deve ser um número inteiro',
        );
    });
});
