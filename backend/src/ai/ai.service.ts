import { Injectable, BadGatewayException, GatewayTimeoutException, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private readonly client: OpenAI | null;

    constructor(config: ConfigService) {
        const apiKey = config.get<string>('OPENAI_API_KEY');
        this.client = apiKey ? new OpenAI({ apiKey, timeout: 20_000, maxRetries: 2 }) : null;
    }

    async generateContactSummary(contact: { fullName: string, email: string, phone: string, tags: string[] }) {
        if (!this.client) {
            throw new ServiceUnavailableException('Integração com IA não configurada (OPENAI_API_KEY ausente)');
        }

        try {
            const completion = await this.client.chat.completions.create({
                model: 'gpt-4o-mini',
                temperature: 0.3,
                max_tokens: 200,
                messages: [
                    {
                        role: 'system',
                        content:
                            'Você escreve resumos profissionais de contatos para uma equipe comercial. ' +
                            'Escreva em português, em terceira pessoa, em no máximo 3 frases, sem saudação e sem markdown. ' +
                            'Use apenas os dados fornecidos; não invente cargo, empresa ou histórico. ' +
                            'Se houver tags, use-as para descrever o contexto do contato.',
                    },
                    {
                        role: 'user',
                        content: JSON.stringify(contact),
                    },
                ],
            });

            const text = completion.choices[0]?.message?.content?.trim();
            if (!text) {
                throw new BadGatewayException('A IA não retornou conteúdo');
            }
            return text;
        } catch (error) {
            if (error instanceof OpenAI.APIConnectionTimeoutError) {
                throw new GatewayTimeoutException('A IA demorou demais para responder');
            }

            if (error instanceof OpenAI.APIError) {
                this.logger.error(`OpenAI respondeu ${error.status}: ${error.message}`);
                throw new BadGatewayException('Falha ao gerar o texto com IA');
            }
            throw error;
        }
    }
}
