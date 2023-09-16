export default class StringSanitizer {
  static convertToUpperCase(key: string, data: any) {
      if (key === 'email') return data
      if (!data) return null;
      if (typeof data === 'string') {
          return data.toUpperCase();
      }
      return data
  }

  static sanitizeEmptyFields(data: any) {
      return data === '' ? null : data
  }

  static sanitizeLetters(text: string) {
      if (typeof text === 'string') {
          return text
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');
      }
      return text
  }

  static sanitizeDate(date: string) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if(!date) return null;
    if(!regex.test(date)) {
        return this.convertDate(date)
    }
  }

  static convertDate(date: string) {
    return date.replace(/\//g, '-');
  }
}