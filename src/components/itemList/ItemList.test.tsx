import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import ItemList from './ItemList';
import store from '../../store/store.ts';

jest.mock('../../store/store.ts', () => ({
    posts: [],
    isLoading: false,
    fetchData: jest.fn(),
    deleteFunction: jest.fn(),
}));

describe('ItemList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('отображает индикатор загрузки при пустом списке', () => {
        render(<ItemList/>);
        expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });

    test('вызывает fetchData при первом рендере', () => {
        render(<ItemList/>);
        expect(store.fetchData).toHaveBeenCalledTimes(1);
    });

    test('отображает записи после загрузки', async () => {
        store.posts = [
            {id: 1, text: 'Post 1'},
            {id: 2, text: 'Post 2'},
        ];
        render(<ItemList/>);
        await waitFor(() => {
            expect(screen.getByText(/post 1/i)).toBeInTheDocument();
            expect(screen.getByText(/post 2/i)).toBeInTheDocument();
        });
    });

    test('позволяет редактировать текст записи', async () => {
        store.posts = [{id: 1, text: 'Post to edit'}];
        render(<ItemList/>);
        fireEvent.click(screen.getByText(/редактировать/i));
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, {target: {value: 'Edited Post'}});
        fireEvent.click(screen.getByText(/сохранить/i));
        expect(store.posts[0].text).toBe('Edited Post');
    });

    test('вызывает deleteFunction при нажатии на кнопку удаления', async () => {
        store.posts = [{id: 1, text: 'Post to delete'}];
        render(<ItemList/>);
        fireEvent.click(screen.getByText(/удалить/i));
        expect(store.deleteFunction).toHaveBeenCalledWith(1);
    });


    test('вызывает fetchData при достижении конца списка', async () => {
        store.isLoading = false;
        store.fetchData = jest.fn();
        render(<ItemList/>);
        fireEvent.scroll(window, {target: {scrollY: 1000}});
        expect(store.fetchData).toHaveBeenCalled();
    });

});