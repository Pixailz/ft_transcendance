import {
	transition,
	trigger,
	query,
	style,
	animate,
	group,
	animateChild
 } from '@angular/animations';
 
 
 export const slideInAnimation =
	trigger('routeAnimations', [

		transition('* <=> *', [
			group([
				query(':enter', [
					style({ position: 'fixed', transform: 'translateX(100%)'}),
					animate('0.5s ease-in-out', style({
						transform: 'translateX(0)'
					}))
				]),
				query(':leave', [
					style({ position: 'fixed', transform: 'translateX(0)'}),
					animate('0.5s ease-in-out', style({
						transform: 'translateX(-100%)'
					}))
				])
			])
		]),





    //     transition('Home <=> Play', [
	// 		query(':enter, :leave', 
	// 			 style({position: 'fixed'}), 
	// 			 { optional: true }),
	// 		group([
	// 			 query(':enter', [
	// 				 style({ transform: 'scale(1)' }), 
	// 				 animate('0.5s ease-in-out', 
	// 				 style({ transform: 'scale(0)' }))
	// 			 ], { optional: true }),
	// 			 query(':leave', [
	// 				 style({ transform: 'scale(0)' }),
	// 				 animate('0.5s ease-in-out', 
	// 				 style({ transform: 'scale(1)' }))
	// 				 ], { optional: true }),
	// 		 ])
	//    ]),
 ]);