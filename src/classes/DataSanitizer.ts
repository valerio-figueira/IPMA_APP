import { IHolderRequest } from "../interfaces/IHolder";

export default class DataSanitizer {
  static convertToUpperCase(data: any): any {
    if (!data) return null;
    if (typeof data === 'string') {
      return data.toUpperCase();
    }
  }

  static convertEmptyToNull(data: any): any {
    return data === '' ? null : data
  }

  static convertDateStringsToDate(data: any): any {
    if (!data) return null;
    if (typeof data === 'string') {
      const date = new Date(data);
      return isNaN(date.getTime()) ? null : date;
    }
  }

  static sanitizeData(data: any): any {
    if (data.cpf) data.cpf = data.cpf.replace(/\D/g, '');
    if (data.identidade) data.identidade = data.identidade.replace(/\W/g, '');
    if (data.celular_1) data.celular_1 = data.celular_1.replace(/\D/g, '');
    if (data.celular_2) data.celular_2 = data.celular_2.replace(/\D/g, '');
    if (data.tel_residencial) data.tel_residencial = data.tel_residencial.replace(/\D/g, '');
  }

  static convertData(data: IHolderRequest) {
    this.sanitizeData(data);
    for (const key in data) {
      console.log(data[key])
      if (data.hasOwnProperty(key)) {
        data[key] = this.convertEmptyToNull(data[key]);
        if(key !== 'email') {
          data[key] = this.convertToUpperCase(data[key]);
        }
      }
    }
    console.log(data)
  }
}