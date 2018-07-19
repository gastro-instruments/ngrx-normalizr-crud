import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild
} from '@angular/router';
import { AddData, createSchemaSelectors } from '@gi/ngrx-normalizr';
import { Store } from '@ngrx/store';
import { schema } from 'normalizr';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

import { createActions } from '../../actions';

/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an observable of true or false.
 */
export abstract class EntityExistsGuard<T, State>
	implements CanActivate, CanActivateChild {
	public idProperty = 'id';

	abstract store: Store<State>;
	abstract entitySchema: schema.Entity;

	abstract onNotFound(err: any): Observable<boolean>;
	abstract getForId(id: string): Observable<any>;

	/**
	 * This method checks if a user with the given ID is already registered
	 * in the Store
	 */
	hasEntityInStore(id: string): Observable<boolean> {
		return this.store
			.select(createSchemaSelectors<T>(this.entitySchema).getNormalizedEntities)
			.pipe(
				map(
					(entities: any) =>
						!!(
							entities &&
							entities[this.entitySchema.key] &&
							entities[this.entitySchema.key][id]
						)
				),
				take(1)
			);
	}

	/**
	 * This method loads a user with the given ID from the API and caches
	 * it in the store, returning `true` or `false` if it was found.
	 */
	hasEntityInApi(id: string): Observable<boolean> {
		const actions = createActions<T>(this.entitySchema);
		return this.getForId(id).pipe(
			tap(response => {
				this.store.dispatch(
					new AddData<T>({
						data: Array.isArray(response) ? response : [response],
						schema: this.entitySchema
					})
				);
				this.store.dispatch(new actions.Load(response));
			}),
			map(res => !!res),
			catchError(err => this.onNotFound(err))
		);
	}

	/**
	 * `hasEntity` composes `hasEntityInStore` and `hasEntityInApi`. It first checks
	 * if the user is in store, and if not it then checks if it is in the
	 * API.
	 */
	hasEntity(id: string): Observable<boolean> {
		return this.hasEntityInStore(id).pipe(
			switchMap(inStore => {
				if (inStore) {
					return of(inStore);
				}

				return this.hasEntityInApi(id);
			})
		);
	}

	/**
	 * This is the actual method the router will call when our guard is run.
	 *
	 * It checks if we need o request a user from the API or if we already
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
		return this.hasEntity(route.paramMap.get(this.idProperty));
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
