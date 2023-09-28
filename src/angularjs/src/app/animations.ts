import {
	transition,
	trigger,
	query,
	style,
	animate,
	group,
	state,
} from '@angular/animations';

 export const slideInAnimation =
	trigger('routeAnimations', [
		transition('Profile => Home, Play => Home, ChatDm => Home, ChatChannel => Home', slideTo('left')),
		transition('Home => Play, Home => Profile, Home => ChatDm, Home => ChatChannel', slideTo('right')),
		transition('Profile => Play, Profile => ChatDm, Profile => ChatChannel', slideTo('left')),
		transition('Play => Profile, ChatDm => Profile, ChatChannel => Profile', slideTo('right')),
		transition('Play => ChatDm, Play => ChatChannel', slideTo('right')),
		transition('ChatDm => Play, ChatChannel => Play', slideTo('left')),
		transition('ChatDm => ChatChannel', slideTo('right')),
		transition('ChatChannel => ChatDm', slideTo('left')),
		transition('* => PageNotFound', slideTo('bottom')),
		transition('PageNotFound => *', slideTo('top')),
	]);

function slideTo(direction: string)
{
	return group([
		query(':enter', [
			style({ [direction]: '-110%'}),
			animate('.5s ease-in-out', style({
				[direction]: '0'
			}))
		]),
		query(':leave', [
			style({ [direction]: '0' }),
			animate('.5s ease-in-out', style({
				[direction]: '110%'
			}))
		])
	])
}


export const enterAnimation = trigger(
	'enterAnimation', [
	  state('true', style({})),
	  state('false', style({})),

	  transition('void <=> false', animate(0)),

	  transition(':enter', [
		style({transform: 'translateX(100%)'}),
		animate('300ms', style({transform: 'translateX(0)'}))
	  ]),
	  transition(':leave', [
		style({transform: 'translateX(0)'}),
		animate('300ms', style({transform: 'translateX(100%)'}))
	  ])
	]
  );

export const fadeInOut = trigger('fadeInOut', [
	transition(':enter', [
		style({ 'transform': 'scale(0.01)' }),
		animate('200ms ease-out', style({ 'transform': 'scale(1)' })),
	]),
	transition(':leave', [
	  animate('200ms ease-in', style({ 'transform': 'scale(0.01)' })),
	]),
  ]);
