import { IHolder } from "../../interfaces/IHolder";

export default class UserValidation {
    regex = /[0-9]/;
    alphabeth = /[A-z]/;
    alphnumeric = /[A-z-0-9]/;

    static validateUserBody(body: IHolder) {

    }

    static validateMatricula(matricula: number) {
        if(typeof matricula !== 'number') throw new Error('');
        if(matricula === undefined) throw new Error('');
        if(matricula === null) throw new Error('');
    }

    static validateNome() {}

    static validateIdentidade() {}

    static validateDataExp() {}

    static validateOrgaoEmissor() {}

    static validateCPF() {}

    static validateSexo() {}

    static validateEstadoCivil() {}

    static validateDataNasc() {}

    static validateCartaoSus() {}

    static validateEndereco() {}

    static validateNumEnd() {}
    
    static validateBairro() {}

    static validateCidade() {}

    static validateNomeMae() {}

    static validateNomePai() {}

    static validateAposentado() {}

}