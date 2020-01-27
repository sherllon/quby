import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from './App';

const windowSetInterval = window.setInterval;
const fetchResponseMock = {
    status: 200,
    body: {"currentSetpoint":19,"currentTemp":15,"timestamp":1580149458865},
    json: function() {
        return this.body;
    }
};

beforeAll(() => {
  jest.useFakeTimers();
})

test('renders loading Thermostat', () => {
  const { getByText } = render(<App />);
  const loadingElement = getByText(/Loading/i);
  expect(loadingElement).toBeInTheDocument();
});

test('renders Thermostat', async () => {
  jest.spyOn(global, 'fetch').mockImplementation(() => (fetchResponseMock));
  const { getByText } = render(<App />);
  const loadingElement = getByText(/Loading/i);
  expect(loadingElement).toBeInTheDocument();
  await act(async () => jest.advanceTimersByTime(2000));
  const roomNameElement = getByText(/Room name/i);
  expect(roomNameElement).toBeInTheDocument();
});
