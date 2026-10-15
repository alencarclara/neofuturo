import { Injectable, BadGatewayException, GatewayTimeoutException, Logger, NotFoundException } from '@nestjs/common';

interface ViaCepResponse {
    cep?: string;
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
    erro?: string | boolean;
}

export interface Address {
    cep: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    uf: string;
}

@Injectable()
export class AddressService {
    private readonly logger = new Logger(AddressService.name);

    async lookupCep(cep: string): Promise<Address> {
        let response: Response;
        try {
            response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: AbortSignal.timeout(5000) });
        } catch (error) {
            if (error instanceof Error && error.name == 'TimeoutError') {
                throw new GatewayTimeoutException('O serviço de CEP demorou demais para responder');
            }
            this.logger.error(`Falha de conexão com a ViaCEP: ${(error as Error).message}`);
            throw new BadGatewayException('Não foi possível consultar o serviço de CEP');
        }

        if (!response.ok) {
            this.logger.error(`ViaCEP respondeu ${response.status}`);
            throw new BadGatewayException(`O serviço de CEP retornou um erro`);
        }

        const data = (await response.json()) as ViaCepResponse;

        if (data.erro) {
            throw new NotFoundException(`CEP ${cep} não encontrado`);
        }

        return {
            cep: data.cep ?? cep,
            logradouro: data.logradouro ?? '',
            bairro: data.bairro ?? '',
            cidade: data.localidade ?? '',
            uf: data.uf ?? ''
        };
    }
}
