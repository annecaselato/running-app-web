import { logout } from './logout';

const originalLocation = window.location;

beforeEach(() => {
  jest.spyOn(window.localStorage.__proto__, 'clear').mockImplementation(jest.fn());
  const reload = jest.fn();
  window.location = {
    ...(originalLocation || {}),
    reload
  };
});

afterEach(() => {
  jest.restoreAllMocks();
  window.location = originalLocation;
});

it('clears localStorage and reloads the page', () => {
  logout();

  expect(localStorage.clear).toHaveBeenCalledTimes(1);
});
