import IBilling from "../interfaces/IBilling";

export default class BillingSchema {
    id_mensalidade?: number;
    id_conveniado: number;
    valor: number;
    mes_referencia: number;
    ano_referencia: number;
    status: 'Pendente' | 'Pago' | 'Anulado';
    data_referencia: Date;
    data_pagamento: Date | null;
    data_registro?: Date;

    constructor(body: IBilling) {
        this.id_mensalidade = body.id_mensalidade;
        this.id_conveniado = body.id_conveniado;
        this.valor = body.valor;
        this.mes_referencia = body.mes_referencia;
        this.ano_referencia = body.ano_referencia;
        this.status = body.status;
        this.data_referencia = body.data_referencia;
        this.data_pagamento = body.data_pagamento;
        this.data_registro = body.data_registro;
    }
}