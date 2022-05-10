import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SearchBarComponent from './SearchBar';

describe('<SearchBarComponent />', () => {
  test('it should mount', () => {
    render(<SearchBarComponent />);
    
    const searchBarComponent = screen.getByTestId('SearchBarComponent');

    expect(searchBarComponent).toBeInTheDocument();
  });
});