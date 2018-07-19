import 'should';

import { schema } from 'normalizr';
import { Observable, of, throwError } from 'rxjs';

import { createActions } from '../actions';
import { EntityCrudEffect } from './';

describe('Generate EntityCrudEffect', () => {
	class User {
		static schema = new schema.Entity('user');
	}

	let effects;
	let actions = createActions(User.schema);

	beforeAll(() => {
		effects = new EntityCrudEffect(
			{ ofType: () => of(true) } as any,
			User.schema
		);
	});

	describe('`Search` effect', () => {
		it('should add data and dispatch SearchComplete when handler succeeds', () => {
			const payload = ['result'];
			const search$ = effects.createSearchEffect(() => of(payload));
			search$.constructor.should.be.eql(Observable);
			search$.subscribe(result => {
				result.should.be.an.Object();
				if (result.type.includes('Normalize')) {
					result.type.should.containEql('Add Data');
				} else {
					result.constructor.should.be.eql(actions.SearchComplete);
					result.type.should.be.eql('[User] Search Complete');
					result.payload.should.be.eql(payload);
				}
			});
		});

		it('should only dispatch SearchComplete when handler fails', () => {
			const search$ = effects.createSearchEffect(() => throwError({}));
			search$.constructor.should.be.eql(Observable);
			search$.subscribe(result => {
				result.should.be.an.Object();
				result.constructor.should.be.eql(actions.SearchComplete);
				result.type.should.be.eql('[User] Search Complete');
				result.payload.should.be.eql([]);
			});
		});
	});

	describe('`Create` effect', () => {
		it('should add data and dispatch CreateSuccess when handler succeeds', () => {
			const payload = { data: 'data' };
			const create$ = effects.createCreateEffect(() => of(payload));
			create$.constructor.should.be.eql(Observable);
			create$.subscribe(result => {
				result.should.be.an.Object();
				if (result.type.includes('Normalize')) {
					result.type.should.containEql('Add Data');
				} else {
					result.constructor.should.be.eql(actions.CreateSuccess);
					result.type.should.be.eql('[User] Create Success');
					result.payload.should.be.eql(payload);
				}
			});
		});

		it('should only dispatch CreateFail when handler fails', () => {
			const payload = { error: 'data' };
			const create$ = effects.createCreateEffect(() => throwError(payload));
			create$.constructor.should.be.eql(Observable);
			create$.subscribe(result => {
				result.should.be.an.Object();
				result.constructor.should.be.eql(actions.CreateFail);
				result.type.should.be.eql('[User] Create Fail');
				result.payload.should.be.eql(payload);
			});
		});
	});

	describe('`Update` effect', () => {
		it('should add data and dispatch UpdateSuccess when handler succeeds', () => {
			const payload = { data: 'data' };
			const update$ = effects.createUpdateEffect(() => of(payload));
			update$.constructor.should.be.eql(Observable);
			update$.subscribe(result => {
				result.should.be.an.Object();
				if (result.type.includes('Normalize')) {
					result.type.should.containEql('Add Data');
				} else {
					result.constructor.should.be.eql(actions.UpdateSuccess);
					result.type.should.be.eql('[User] Update Success');
					result.payload.should.be.eql(payload);
				}
			});
		});

		it('should only dispatch UpdateFail when handler fails', () => {
			const payload = { error: 'data' };
			const update$ = effects.createUpdateEffect(() => throwError(payload));
			update$.constructor.should.be.eql(Observable);
			update$.subscribe(result => {
				result.should.be.an.Object();
				result.constructor.should.be.eql(actions.UpdateFail);
				result.type.should.be.eql('[User] Update Fail');
				result.payload.should.be.eql(payload);
			});
		});
	});

	describe('`Delete` effect', () => {
		it('should add data and dispatch DeleteSuccess when handler succeeds', () => {
			const payload = { ok: true };
			const delete$ = effects.createDeleteEffect(() => of(payload));
			delete$.constructor.should.be.eql(Observable);
			delete$.subscribe(result => {
				result.should.be.an.Object();
				if (result.type.includes('Normalize')) {
					result.type.should.containEql('Remove Data');
				} else {
					result.constructor.should.be.eql(actions.DeleteSuccess);
					result.type.should.be.eql('[User] Delete Success');
					result.payload.should.be.eql(payload);
				}
			});
		});

		it('should only dispatch DeleteFail when handler fails', () => {
			const payload = { error: 'data' };
			const delete$ = effects.createDeleteEffect(() => throwError(payload));
			delete$.constructor.should.be.eql(Observable);
			delete$.subscribe(result => {
				result.should.be.an.Object();
				result.constructor.should.be.eql(actions.DeleteFail);
				result.type.should.be.eql('[User] Delete Fail');
				result.payload.should.be.eql(payload);
			});
		});
	});
});
