import { Component } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { BackService } from 'src/app/services/back.service';
import { UserService } from 'src/app/services/user.service';
import { DefUserI } from 'src/app/interfaces/user/user.interface';

@Component({
	selector: 'app-home-dashboard',
	templateUrl: './home-dashboard.component.html',
	styleUrls: ['./home-dashboard.component.scss']
})
export class HomeDashboardComponent {
	cards: any;
	leaderboard: any;
	onlineusers: any;
	private: any;
	global: any;
	DefUserI = DefUserI;

	constructor(
		private back: BackService,
		private breakpointObserver: BreakpointObserver,
		public userService: UserService,
	) { }

	async ngOnInit() {
		const leadreq = await this.back.req("GET", "/leaderboard");
		const onlinereq = await this.back.req("GET", "/user/online");

		this.breakpointObserver.observe(Breakpoints.Handset).pipe(
			map(({ matches }) => {
				if (matches) {
					return [
						{ cols: 3, rows: 1, content: leadreq }
					];
				}
				return [
					{ cols: 2, rows: 2, content: leadreq }
				];
			}))
		.subscribe((res) => { this.leaderboard = res[0]; });

		this.breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(
			map(({ matches }) => {
				if (matches) {
					return [
						{ cols: 3, rows: 1, content: onlinereq }
					];
				}
				return [
					{ cols: 1, rows: 2, content: onlinereq }
				];
			}))
		.subscribe((res) => { this.onlineusers = res[0]; });

		this.breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(
			map(({ matches }) => {
				if (matches) {
					return [
						{ cols: 3, rows: 1, content: '' }
					];
				}
				return [
					{ cols: 2, rows: 2, content: '' }
				];
			}))
		.subscribe((res) => { this.private = res[0]; });

		this.breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(
			map(({ matches }) => {
				if (matches) {
					return [
						{ cols: 3, rows: 1, content: '' }
					];
				}
				return [
					{ cols: 1, rows: 2, content: '' }
				];
			}))
		.subscribe((res) => { this.global = res[0]; });
	}

	async refOnline() {
		const onlinereq = await this.back.req("GET", "/user/online");

		this.breakpointObserver.observe(Breakpoints.HandsetPortrait).pipe(
			map(({ matches }) => {
				if (matches) {
					return [
						{ cols: 3, rows: 1, content: onlinereq }
					];
				}
				return [
					{ cols: 1, rows: 2, content: onlinereq }
				];
			}))
		.subscribe((res) => { this.onlineusers = res[0]; });
	}

}
