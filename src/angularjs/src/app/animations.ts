import {
	transition,
	trigger,
	query,
	style,
	animate,
	group,
	animateChild,
	stagger,
	AnimationMetadata,
	AnimationMetadataType
} from '@angular/animations';
 
 export const slideInAnimation =
	trigger('routeAnimations', [
		transition('Profile => Home, Chat => Home, Play => Home', slideTo('left')),
		transition('Home => Chat, Home => Play, Home => Profile', slideTo('right')),
		transition('Profile => Home, Profile => Chat, Profile => Play', slideTo('left')),
		transition('Home => Profile, Chat => Profile, Play => Profile', slideTo('right')),
		transition('Play => Chat', slideTo('right')),
		transition('Chat => Play', slideTo('left'))
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