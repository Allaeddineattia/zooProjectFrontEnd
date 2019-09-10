import { API_URL, AUTHENTICATE_URL, SIGN_UP_URL } from './../_globals/globalURLs';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserToken } from '../_models/UserToken';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';



export interface AuthResponseData {
  token: string;
}

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  userToken = new BehaviorSubject<UserToken>(null);
  private tokenExpirationTimer: any;



  constructor(private http: HttpClient, private router: Router) {}

  signup(signUpBody) {
    return this.http
      .post<AuthResponseData>(API_URL + SIGN_UP_URL, signUpBody)
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          console.log(resData);
          console.log('sign up succeded');
        })
      );
  }

  private handleAuthentication(
    token: string
  ) {
    console.log('in authentication');
    const userToken = new UserToken(token);
    this.userToken.next(userToken);
    localStorage.setItem('userData', JSON.stringify(userToken));
  }

  login(username: string, password: string) {
    const URL = API_URL + AUTHENTICATE_URL;
    console.log('it in your head ' + URL );
    return this.http
      .post<AuthResponseData>(
        URL,
        {
          emailOrPseudo: username,
          password
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          console.log(resData);
          this.handleAuthentication(
            resData.token,
          );
        })
      );
  }
  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    console.log(errorRes.error.message);
    switch (errorRes.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'Unvalid Coordonates':
        errorMessage = 'Check your username and password';
        break;
    }
    return throwError(errorMessage);
  }

  autoLogin() {

    const userData: { _token: string} = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new UserToken(
      userData._token
    );

    if (loadedUser.token) {
      this.userToken.next(loadedUser);
    }
  }

  logout() {
    this.userToken.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

}
