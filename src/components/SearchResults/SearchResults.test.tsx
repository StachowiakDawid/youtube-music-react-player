import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchResultsComponent from './SearchResults';

describe('<SearchResultsComponent />', () => {
  test('it should mount', () => {
    render(<SearchResultsComponent />);
    
    const searchResultsComponent = screen.getByTestId('SearchResultsComponent');

    expect(searchResultsComponent).toBeInTheDocument();
  });
});