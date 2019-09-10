export class UserToken {
    constructor(
        private _token: string,
      ) {
      }
      get token() {
        return this._token;
      }
}
