import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchHistoryComponent from './SearchHistory';

describe('<SearchHistoryComponent />', () => {
  test('it should mount', () => {
    render(<SearchHistoryComponent />);
    
    const searchHistoryComponent = screen.getByTestId('SearchHistoryComponent');

    expect(searchHistoryComponent).toBeInTheDocument();
  });
});