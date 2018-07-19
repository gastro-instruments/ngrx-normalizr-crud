import 'should';

import { schema } from 'normalizr';

import { createActions, CrudEntityActions } from '.';

describe('Generate Actions', () => {
	let actions: CrudEntityActions<any>;

	beforeAll(() => {
		actions = createActions(new schema.Entity('entity'));
	});

	it('should export a function to create actions', () => {
		createActions.should.be.a.Function();
		actions.should.be.an.Object();
	});

	describe('`Search` actions', () => {
		it('should be generated', () => {
			actions.Search.should.be.ok();
			actions.Search.should.be.a.Function();
			new actions.Search().should.be.an.Object();

			actions.SearchComplete.should.be.ok();
			actions.SearchComplete.should.be.a.Function();
			new actions.SearchComplete([]).should.be.an.Object();
		});

		it('should export search actions types', () => {
			actions.SEARCH.should.be.ok();
			actions.SEARCH_COMPLETE.should.be.ok();
		});
	});

	describe('`Load` actions', () => {
		it('should be generated', () => {
			actions.Load.should.be.ok();
			actions.Load.should.be.a.Function();
			new actions.Load({}).should.be.an.Object();
		});

		it('should export load actions types', () => {
			actions.LOAD.should.be.ok();
		});
	});

	describe('`Select` actions', () => {
		it('should be generated', () => {
			actions.Select.should.be.ok();
			actions.Select.should.be.a.Function();
			new actions.Select('').should.be.an.Object();
		});

		it('should export select actions types', () => {
			actions.SELECT.should.be.ok();
		});
	});

	describe('`Update` actions', () => {
		it('should be generated', () => {
			actions.Update.should.be.ok();
			actions.Update.should.be.a.Function();
			new actions.Update({}).should.be.an.Object();

			actions.UpdateSuccess.should.be.ok();
			actions.UpdateSuccess.should.be.a.Function();
			new actions.UpdateSuccess({}).should.be.an.Object();

			actions.UpdateFail.should.be.ok();
			actions.UpdateFail.should.be.a.Function();
			new actions.UpdateFail().should.be.an.Object();
		});

		it('should export update actions types', () => {
			actions.UPDATE.should.be.ok();
			actions.UPDATE_SUCCESS.should.be.ok();
			actions.UPDATE_FAIL.should.be.ok();
		});
	});

	describe('`Delete` actions', () => {
		it('should be generated', () => {
			actions.Delete.should.be.ok();
			actions.Delete.should.be.a.Function();
			new actions.Delete('').should.be.an.Object();

			actions.DeleteSuccess.should.be.ok();
			actions.DeleteSuccess.should.be.a.Function();
			new actions.DeleteSuccess('').should.be.an.Object();

			actions.DeleteFail.should.be.ok();
			actions.DeleteFail.should.be.a.Function();
			new actions.DeleteFail().should.be.an.Object();
		});

		it('should export delete actions types', () => {
			actions.DELETE.should.be.ok();
			actions.DELETE_SUCCESS.should.be.ok();
			actions.DELETE_FAIL.should.be.ok();
		});
	});

	describe('`Create` actions', () => {
		it('should be generated', () => {
			actions.Create.should.be.ok();
			actions.Create.should.be.a.Function();
			new actions.Create({}).should.be.an.Object();

			actions.CreateSuccess.should.be.ok();
			actions.CreateSuccess.should.be.a.Function();
			new actions.CreateSuccess({}).should.be.an.Object();

			actions.CreateFail.should.be.ok();
			actions.CreateFail.should.be.a.Function();
			new actions.CreateFail().should.be.an.Object();
		});

		it('should export create actions types', () => {
			actions.CREATE.should.be.ok();
			actions.CREATE_SUCCESS.should.be.ok();
			actions.CREATE_FAIL.should.be.ok();
		});
	});

	describe('Normalizr actions', () => {
		it('should be exported', () => {
			actions.addData.should.be.ok();
			actions.addData.should.be.a.Function();
			actions.addData([]).should.be.an.Object();

			actions.setData.should.be.ok();
			actions.setData.should.be.a.Function();
			actions.setData([]).should.be.an.Object();

			actions.removeData.should.be.ok();
			actions.removeData.should.be.a.Function();
			actions.removeData('').should.be.an.Object();
		});
	});
});
