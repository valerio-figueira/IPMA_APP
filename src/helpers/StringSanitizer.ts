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
}