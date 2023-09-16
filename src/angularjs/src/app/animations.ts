import {
	transition,
	trigger,
	query,
	style,
	animate,
	group,
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