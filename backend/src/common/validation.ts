import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

// Converte os erros do class-validator em mensagens. O erro de campo não permitido
// (forbidNonWhitelisted) vem fixo em inglês, então é traduzido aqui.
export function validationMessages(errors: ValidationError[]): string[] {
    return errors.flatMap((e) =>
        Object.entries(e.constraints ?? {}).map(([constraint, message]) =>
            constraint === 'whitelistValidation' ? `O campo "${e.property}" não é permitido` : message,
        ),
    );
}

// ParseIntPipe com mensagem em português no lugar de "Validation failed (numeric string is expected)".
export function parseIntParam(label: string): ParseIntPipe {
    return new ParseIntPipe({
        exceptionFactory: () => new BadRequestException(`${label} deve ser um número inteiro`),
    });
}
