import store from './store';
import jsonp from 'jsonp';



jest.mock('jsonp', () => jest.fn());

describe('PostsStore', () => {
    beforeEach(() => {
        store.posts = [];
        store.isLoading = false;
        store.offset = 0;
        store.error = null;
    });

    test('fetchData устанавливает isLoading в true и вызывает jsonp', () => {
        store.fetchData();
        expect(store.isLoading).toBe(true);
        expect(jsonp).toHaveBeenCalledWith(store.http, {}, expect.any(Function));
    });






    test('deleteFunction удаляет нужную запись по ID', () => {
        store.posts = [{ id: 1, text: 'Post 1' }, { id: 2, text: 'Post 2' }];
        store.deleteFunction(1);

        expect(store.posts).toHaveLength(1);
        expect(store.posts[0].id).toBe(2);
    });


});