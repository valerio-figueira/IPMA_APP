export default interface IBilling {
    id_mensalidade?: number;
    id_conveniado: number;
    valor: number;
    mes_referencia: number;
    ano_referencia: number;
    status: 'Pendente' | 'Pago' | 'Anulado';
    data_referencia: Date;
    data_pagamento: Date | null;
    data_registro?: Date;
}