
/**
 * Here is a specification of our software. We're trying learn how to
 * build an abortable promise.
 *
 * Hypothesis: If a `useEffect` gets run at a higher frequency
 *             than its inner code, then the inner code will be rejected.
 *
 * When would a `useEffect` get run?
 * - When the component is mounted and when the dependencies changes
 *
 * What if a dependency changes before the component completed its mount?
 * - We expect the `useEffect` to run twice
 *
 * Why would we not want two `useEffect` callbacks running at the same time?
 *
 * Why might the dependency of `useEffect` change?
 * - Does not matter for this exercise
 *
 * When might the dependency of `useEffect` change?
 * - Let's say that on a set interval of 300 miliseconds, the dependency
 *  changes.
 */

  /**
   * A test is always structured in these three parts:
   *
   * Given: Some assumption about the world. This is usually a build up of state.
   * When: Something happens, usually a function call.
   * Then: Some assertion about the world. This is usually a check of state.
   */
// Given that a component: <App />
//   - has a useEffect installed on it
// Given that a component: TODO
//   - has a useEffect installed AND
//   - the useEffect makes use of an abortable Promise
// Given that a component: <AppWithAbortablePromiseAndCleanup />
//   - has a useEffect installed AND
//   - the useEffect makes use of an abortable Promise AND
//   - the useEffect installs a cleanup function
// When the component:
//   - renders or its dependency changes
//      - IF some process inside of an abortable Promise TAKES TOO LONG
// Then:
//   - The useEffect will ignore older attempts at running some process

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import AppWithAbortablePromiseAndCleanup from './AppWithAbortablePromiseAndCleanup';
import AppWithAbortablePromise from './AppWithAbortablePromise';
test('when mounted, useEffect is called once', () => {
  /* Given */
  const someProcess = jest.fn()

  /* When: mounted for the first time */
  render(<App someProcess={someProcess} />);

  /* Then */
  expect(someProcess).toHaveBeenCalledTimes(1);
})

test('when mounted and dependency changes, useEffect is called twice', async () => {
  /* Given */
  const someProcess = jest.fn()

  /* When: mounted and dependency changes */
  render(<App someProcess={someProcess} />);
  await changeDependency();

  /* Then */
  expect(someProcess).toHaveBeenCalledTimes(2);
})

/* AppWithAbortablePromiseAndCleanupTest */
test('when mounted and dependency changes, useEffect is called twice with an abortable promise and cleanup', async () => {
  /* Given */
  const someProcess = jest.fn()

  /* When: mounted and dependency changes */
  render(<AppWithAbortablePromiseAndCleanup someProcess={someProcess} />);
  await changeDependency();
  await changeDependency();
  await changeDependency();
  await changeDependency();

  await timeout(3000)
  /* Then */
  expect(someProcess).toHaveBeenCalledTimes(1)
  // await waitFor(() => expect(someProcess).toHaveBeenCalledTimes(3));
})


test('when mounted and dependency changes, useEffect is called twice with an abortable promise', async () => {
  /* Given */
  const someProcess = jest.fn()

  /* When: mounted and dependency changes */
  render(<AppWithAbortablePromise someProcess={someProcess} />);
  await changeDependency();
  await changeDependency();
  await changeDependency();
  await changeDependency();

  await timeout(3000)
  /* Then */
  expect(someProcess).toHaveBeenCalledTimes(5)
  // await waitFor(() => expect(someProcess).toHaveBeenCalledTimes(3));
})

/* Helper functions */
async function changeDependency() {
    await timeout(300);
    fireEvent.click(screen.getByRole('button', { name: 'Increment Dependency'}));
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

