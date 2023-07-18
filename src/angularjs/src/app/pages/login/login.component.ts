import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  implements OnInit {
	code: string | null = null;
	response: any = null;



	constructor(private route: ActivatedRoute, private http: HttpClient) { }

	ngOnInit() {
		this.code = this.route.snapshot.queryParamMap.get('code');

		if (this.code !== null) {
      this.getToken();
		}
	}

  async getToken() {
      try {
	  		this.http.get('/api/auth/ft_callback?code=' + this.code).subscribe((data) => {
          this.response = data;
          localStorage.setItem('access_token', this.response.access_token);
			    window.location.href = '/home';
        });
      } catch (e) {
        console.log(e);
      }
  }

	SignIn() {
		window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-d051dd7a35b0f79ee848231784c70f568b325bfe7cda78468e9e1b142bd511e2&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin&response_type=code';
	};
}
