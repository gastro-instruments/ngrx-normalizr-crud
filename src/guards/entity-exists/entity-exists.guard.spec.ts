import { ActivatedRouteSnapshot } from '@angular/router';
import { schema } from 'normalizr';
import { of, throwError } from 'rxjs';

import { EntityExistsGuard } from './entity-exists.guard';

describe('EntityExistsGuard', () => {
	const key = 'entity';
	const id = 'xxId';
	const route = { paramMap: { get: () => id } } as any;

	class TestGuard extends EntityExistsGuard<any, any> {
		entitySchema = new schema.Entity(key);
		store = {
			select: () => {},
			dispatch: () => {}
		} as any;
		onNotFound() {
			return of(true);
		}
		getForId() {
			return of([]);
		}

		constructor() {
			super();
		}
	}

	let guard: TestGuard;
	let selectSpy: jasmine.Spy;
	let reqSpy: jasmine.Spy;
	let notFoundSpy: jasmine.Spy;
	let dispatchSpy: jasmine.Spy;

	beforeEach(() => {
		guard = new TestGuard();
		selectSpy = spyOn(guard.store, 'select');
		reqSpy = spyOn(guard, 'getForId');
		notFoundSpy = spyOn(guard, 'onNotFound');
		dispatchSpy = spyOn(guard.store, 'dispatch');
	});

	['canActivate', 'canActivateChild'].map(method => {
		describe(`${method}`, () => {
			it(`should act as a '${method}' guard and call 'getForId' when this one isn't in store`, () => {
				selectSpy.and.returnValue(of([]));
				const data = { data: 'data' };
				reqSpy.and.returnValue(of(data));
				guard[method](route).subscribe(can => expect(can).toBe(true));

				expect(reqSpy).toHaveBeenCalledTimes(1);
				expect(dispatchSpy).toHaveBeenCalledTimes(2);
				expect(dispatchSpy.calls.argsFor(0)[0].type).toEqual(
					'[@@Normalize] Add Data'
				);
				expect(dispatchSpy.calls.argsFor(1)[0].type).toEqual(`[Entity] Load`);
				expect(dispatchSpy.calls.argsFor(1)[0].payload).toEqual(data);
			});

			it(`should act as a '${method}' guard and call 'onNotFound' when error occurs`, () => {
				selectSpy.and.returnValue(of([]));
				const data = { error: 404 };
				reqSpy.and.returnValue(throwError(data));
				const canOnNotFound = false;
				notFoundSpy.and.returnValue(of(canOnNotFound));
				guard[method](route).subscribe(can => expect(can).toBe(canOnNotFound));

				expect(reqSpy).toHaveBeenCalledTimes(1);
				expect(notFoundSpy).toHaveBeenCalledTimes(1);
				expect(dispatchSpy).not.toHaveBeenCalled();
			});

			it(`should act as a '${method}' guard and not call 'getForId' when entities exist in store`, () => {
				selectSpy.and.returnValue(of({ [key]: { [id]: {} } }));
				guard[method](route).subscribe(can => expect(can).toBe(true));

				expect(reqSpy).not.toHaveBeenCalled();
				expect(notFoundSpy).not.toHaveBeenCalled();
				expect(dispatchSpy).not.toHaveBeenCalled();
			});
		});
	});
});
