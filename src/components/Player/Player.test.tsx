import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PlayerComponent from './Player';

describe('<PlayerComponent />', () => {
  test('it should mount', () => {
    render(<PlayerComponent />);
    
    const playerComponent = screen.getByTestId('PlayerComponent');

    expect(playerComponent).toBeInTheDocument();
  });
});