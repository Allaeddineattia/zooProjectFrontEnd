import { LoginService } from './_services/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private loginService: LoginService) {}

  title = 'zoo';
  ngOnInit(): void {
    this.loginService.autoLogin();
    this.loginService.userToken.subscribe(res => console.log(res));
  }
}
