interface Enrolled {
    id_conveniado?: number;
    id_titular: number;
    id_dependente?: number | null;
    id_convenio: number;
    ativo: boolean;
    data_registro: Date;
    data_exclusao?: Date | null;
}

export default Enrolled;
