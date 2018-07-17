import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild
} from '@angular/router';
import { Store } from '@ngrx/store';
import { AddData, createSchemaSelectors } from 'ngrx-normalizr';
import { schema } from 'normalizr';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

import { createActions } from '../../actions';

/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an observable of true or false.
 */
export abstract class EntitiesExistsGuard<T, State>
	implements CanActivate, CanActivateChild {
	abstract store: Store<State>;
	abstract entitySchema: schema.Entity;

	abstract onNotFound(err: any): Observable<boolean>;
	abstract getRequest(query: string): Observable<any>;

	/**
	 * This method checks if a user with the given ID is already registered
	 * in the Store
	 */
	hasEntitiesInStore(): Observable<boolean> {
		return this.store
			.select(createSchemaSelectors<T>(this.entitySchema).getNormalizedEntities)
			.pipe(
				map(
					entities =>
						!!(
							entities &&
							entities[this.entitySchema.key] &&
							Object.keys(entities[this.entitySchema.key]).length
						)
				),
				take(1)
			);
	}

	/**
	 * This method loads a user with the given ID from the API and caches
	 * it in the store, returning `true` or `false` if it was found.
	 */
	hasEntitiesInApi(query: string): Observable<boolean> {
		const actions = createActions<T>(this.entitySchema);
		return this.getRequest(query).pipe(
			tap(response => {
				this.store.dispatch(
					new AddData<T>({ data: response, schema: this.entitySchema })
				);
				this.store.dispatch(new actions.SearchComplete(response));
			}),
			map(action => true),
			catchError(err => this.onNotFound(err))
		);
	}

	/**
	 * `hasEntity` composes `hasEntityInStore` and `hasEntityInApi`. It first checks
	 * if the user is in store, and if not it then checks if it is in the
	 * API.
	 */
	hasEntities(query: string): Observable<boolean> {
		return this.hasEntitiesInStore().pipe(
			switchMap(inStore => {
				if (inStore) {
					return of(inStore);
				}

				return this.hasEntitiesInApi(query);
			})
		);
	}

	/**
	 * This is the actual method the router will call when our guard is run.
	 *
	 * It checks if we need o request an entity from the API or if we already
	 * have it in our cache.
	 * If it finds it in the cache or in the API, it returns an Observable
	 * of `true` and the route is rendered successfully.
	 *
	 * If it was unable to find it in our cache or in the API, this guard
	 * will return an Observable of `false`, causing the router to move
	 * on to the next candidate route. In this case, it will move on
	 * to the 404 page.
	 */
	canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
		return this.hasEntities(route.params.id);
	}

	/**
	 * This is the actual method the router will call when our guard is run for canActivateChild.
	 *
	 * It checks if we need o request an entity from the API or if we already
	 * have it in our cache.
	 * If it finds it in the cache or in the API, it returns an Observable
	 * of `true` and the route is rendered successfully.
	 *
	 * If it was unable to find it in our cache or in the API, this guard
	 * will return an Observable of `false`, causing the router to move
	 * on to the next candidate route. In this case, it will move on
	 * to the 404 page.
	 */
	canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> {
		return this.canActivate(route);
	}
}
