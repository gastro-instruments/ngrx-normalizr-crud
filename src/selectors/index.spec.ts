import 'should';

import { createFeatureSelector } from '@ngrx/store';
import { schema } from 'normalizr';

import { createSelectors, EntityStateSelectors } from '.';
import { initialEntityState } from '../reducers';

describe('Selectors', () => {
	const key = 'entity';
	let selectors: EntityStateSelectors<any>;

	beforeAll(() => {
		const entity = new schema.Entity(key);
		selectors = createSelectors(entity, createFeatureSelector(key));
	});

	it('should export a function to create selectors', () => {
		createSelectors.should.be.a.Function();
	});

	it('should return the loading state', () => {
		const state = { [key]: { ...initialEntityState, loading: true } };
		selectors.getLoading(state).should.be.eql(state.entity.loading);
	});

	it('should return the selected id', () => {
		const state = { [key]: { ...initialEntityState, selectedId: 'id' } };
		selectors.getSelectedId(state).should.be.eql(state.entity.selectedId);
	});

	it('should return the query info', () => {
		const state = { [key]: { ...initialEntityState, query: 'any' } };
		selectors.getQuery(state).should.be.eql(state.entity.query);
	});

	it('should return the error info', () => {
		const state = { [key]: { ...initialEntityState, error: 'err' } };
		selectors.getError(state).should.be.eql(state.entity.error);
	});

	it('should return the array of ids', () => {
		const arr = [{ id: 'id', name: 'Name' }, { id: 'id1', name: 'Name1' }];
		const [obj, obj1] = arr;
		const state = {
			normalized: { entities: { [key]: { [obj.id]: obj, [obj1.id]: obj1 } } }
		};
		selectors.getIds(state).should.be.eql(arr.map(o => o.id));
	});

	it('should return the array of entities', () => {
		const arr = [{ id: 'id', name: 'Name' }, { id: 'id1', name: 'Name1' }];
		const [obj, obj1] = arr;
		const state = {
			normalized: { entities: { [key]: { [obj.id]: obj, [obj1.id]: obj1 } } }
		};
		selectors.getEntities(state).should.be.eql(arr);
	});

	it('should return the selected entity', () => {
		const obj = { id: 'id', name: 'Name' };
		const obj1 = { id: 'id1', name: 'Name1' };
		const state = {
			[key]: { ...initialEntityState, selectedId: obj1.id },
			normalized: { entities: { [key]: { [obj.id]: obj, [obj1.id]: obj1 } } }
		};
		selectors.getSelectedEntity(state).should.be.eql(obj1);
	});
});
