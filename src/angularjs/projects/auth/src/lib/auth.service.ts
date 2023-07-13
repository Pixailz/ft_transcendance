import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false;
    }
    const request = new XMLHttpRequest();

    request.setRequestHeader('Authorization', 'Bearer: ' + token);
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
    localStorage.setItem('access_token', request.response);
    return Promise.resolve();
  };

  getUser(): any {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return null;
    }
    const request = new XMLHttpRequest();

    request.setRequestHeader('Authorization', 'Bearer: ' + token);
    request.open('GET', 'http://nestjs:3000/user_info/me', false);
    request.send();

    if (request.status !== 200) {
      return null;
    }
    return JSON.parse(request.response);
  };

  logout(): void {
    localStorage.removeItem('access_token');
  }
}
