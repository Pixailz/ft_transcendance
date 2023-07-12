import { ɵparseCookieValue } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public currentUser = null;
  constructor() { };

  isAuthenticated(): boolean {
    const token = ɵparseCookieValue(document.cookie, 'access_token');
    const request = new XMLHttpRequest();

    request.setRequestHeader('Cookies', 'access_token=' + token);
    request.open('GET', 'http://nestjs:3000/auth/verify', false);
    request.send();

    if (request.status !== 200) {
      return false;
    }
    return true;
  };

  async login(code: string): Promise<void> {
    const request = new XMLHttpRequest();

    request.open('GET', 'http://nestjs:3000/auth?code=' + code, false);
    request.send();

    if (request.status !== 200) {
      throw new Error('login failed');
    }
    this.currentUser = request.response.user_id;
    localStorage.setItem('access_token', request.response);
    return Promise.resolve();
  };
}
