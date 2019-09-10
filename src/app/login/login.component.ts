import { Router } from '@angular/router';
import { LoginService } from './../_services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as $ from '../../../node_modules/jquery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  signUp = true;
  login = null;

  signUpForm: FormGroup;

  constructor(private loginService: LoginService,
              private router: Router) { }

  ngOnInit() {
    this.initSignUpForm();
    }

  initSignUpForm() {
    this.signUpForm = new FormGroup({
      loginUsername : new FormControl(null, [Validators.required], []),
      loginPassword : new FormControl(null, [Validators.minLength(5), Validators.required], []),
      loginKeepMeSigned : new FormControl(),
      signInUsername : new FormControl(null, [Validators.required], []),
      signInPassword : new FormControl(null, [Validators.minLength(5), Validators.required], []),
      signInFirstName : new FormControl(null, [Validators.pattern(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/), Validators.required], []),
      signInLastName : new FormControl(null, [Validators.pattern(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/), Validators.required], []),
      signInEmail : new FormControl(null, [Validators.email, Validators.required], []),
      signInBirthDate : new FormControl(null, [], [])
    });
  }

  submitSignUpForm() {
    console.log('signUp', this.signUpForm);
    if (this.validSignUpForm()) {
      this.sendSignUpForm();
    }
  }

  private validSignUpForm() {
    return this.signUpForm.get('signInUsername').valid &&
          this.signUpForm.get('signInPassword').valid &&
          this.signUpForm.get('signInFirstName').valid &&
          this.signUpForm.get('signInLastName').valid &&
          this.signUpForm.get('signInBirthDate').valid &&
          this.signUpForm.get('signInEmail').valid;
  }

  private sendSignUpForm() {
    console.log('valid SignUp');
    console.log(this.signUpForm.controls);
    const signUpReqBody = {
      birthDate: this.signUpForm.get('signInBirthDate').value,
      email: this.signUpForm.get('signInEmail').value,
      firstName: this.signUpForm.get('signInFirstName').value,
      lastName: this.signUpForm.get('signInLastName').value,
      password: this.signUpForm.get('signInPassword').value,
      pseudo: this.signUpForm.get('signInUsername').value
    };
    this.loginService.signup(signUpReqBody).subscribe(
      res => console.log('sign up res: ', res)
    );
    return true;
  }

  submitLoginForm() {
    console.log('signIn');
    if (this.validLoginForm()) {
      this.sendLoginForm();
    }
  }
  private validLoginForm() {
    return this.signUpForm.get('loginUsername').valid &&
          this.signUpForm.get('loginPassword').valid;
  }

  private sendLoginForm() {
    console.log('valid Login');
    const userName = this.signUpForm.get('loginUsername').value;
    const password = this.signUpForm.get('loginPassword').value;
    this.loginService.login(userName, password).subscribe(res => {
      this.router.navigate(['']);
    }, err => console.log(err));
    return true;
  }

}
