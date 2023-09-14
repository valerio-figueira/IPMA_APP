export default class CustomError extends Error {
    status;

    constructor(message: any, status: number) {
      super(message);
      this.status = status;
      this.name = this.constructor.name;
    }
}