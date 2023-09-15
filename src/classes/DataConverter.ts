import { IHolderRequest } from "../interfaces/IHolder";

export default class DataConverter {
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
    if (data.cpf) return data.cpf.replace(/\D/g, '');
    if (data.identidade) return data.identidade.replace(/\W/g, '');
    if (data.celular_1) return data.celular_1.replace(/\D/g, '');
    if (data.celular_2) return data.celular_2.replace(/\D/g, '');
    if (data.tel_residencial) return data.tel_residencial.replace(/\D/g, '');
  }

  static convertData(data: IHolderRequest) {
    console.log('entrou no convertData')
    for (const key in data) {
      console.log(data[key])
      if (data.hasOwnProperty(key)) {
        // Aplicar as conversões desejadas aos campos
        data[key] = this.sanitizeData(data[key]);
        data[key] = this.convertToUpperCase(data[key]);
        data[key] = this.convertEmptyToNull(data[key]);
      }
    }
    console.log(data)
  }
}