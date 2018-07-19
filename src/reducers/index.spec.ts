import 'should';

import { schema } from 'normalizr';

import { createReducer, initialEntityState, NormalizedEntityState } from '.';
import { createActions, CrudEntityActions } from '../actions';

describe('Reducer', () => {
	let reducer: (state, action) => NormalizedEntityState;
	let actions: CrudEntityActions<any>;

	it('should define a default state', () => {
		initialEntityState.should.be.an.Object();
		initialEntityState.should.have.properties({ loading: false });
		initialEntityState.should.have.properties({ selectedId: null });
		initialEntityState.should.have.properties({ query: '' });
		initialEntityState.should.have.properties({ error: null });
	});

	describe('generate reducer function', () => {
		beforeAll(() => {
			const entity = new schema.Entity('entity');
			reducer = createReducer(entity);
			actions = createActions(entity);
		});

		it('should export a function to create reducer function', () => {
			createReducer.should.be.a.Function();
			reducer.should.be.a.Function();
		});

		it('should handle `Load` action', () => {
			const state = reducer(undefined, new actions.Load(''));
			state.loading.should.be.true();
		});

		it('should handle `Select` action', () => {
			const payload = 'id';
			const state = reducer(undefined, new actions.Select(payload));
			state.selectedId.should.be.eql(payload);
		});

		it('should handle `Update` action', () => {
			const state = reducer(undefined, new actions.Update({}));
			state.loading.should.be.true();
			state.error.should.be.false();
		});

		it('should handle `Search` action', () => {
			let payload = '';
			let state = reducer(undefined, new actions.Search(payload));
			state.loading.should.be.false();
			state.query.should.be.eql('');

			payload = 'query';
			state = reducer(undefined, new actions.Search(payload));
			state.loading.should.be.true();
			state.query.should.be.eql(payload);
		});

		it('should handle `SearchComplete` action', () => {
			const state = reducer(undefined, new actions.SearchComplete([]));
			state.loading.should.be.false();
		});

		it('should handle `UpdateSuccess` action', () => {
			const state = reducer(undefined, new actions.UpdateSuccess({}));
			state.loading.should.be.false();
			state.error.should.be.false();
		});

		it('should handle `CreateSuccess` action', () => {
			const state = reducer(undefined, new actions.CreateSuccess({}));
			state.loading.should.be.false();
			state.error.should.be.false();
		});

		it('should handle `DeleteSuccess` action', () => {
			const state = reducer(undefined, new actions.DeleteSuccess({}));
			state.loading.should.be.false();
			state.error.should.be.false();
		});

		it('should handle `UpdateFail` action', () => {
			const payload = 'error';
			const state = reducer(undefined, new actions.UpdateFail(payload));
			state.loading.should.be.false();
			state.error.should.be.eql(payload);
		});

		it('should handle `CreateFail` action', () => {
			const payload = 'error';
			const state = reducer(undefined, new actions.CreateFail(payload));
			state.loading.should.be.false();
			state.error.should.be.eql(payload);
		});

		it('should handle `DeleteFail` action', () => {
			const payload = 'error';
			const state = reducer(undefined, new actions.DeleteFail(payload));
			state.loading.should.be.false();
			state.error.should.be.eql(payload);
		});
	});
});
