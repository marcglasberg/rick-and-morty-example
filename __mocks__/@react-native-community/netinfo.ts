/**
 * Jest uses this mock automatically, instead of the real NetInfo module.
 * The device is always online, and there are no native calls.
 *
 * Note the action tests don't need it: they create their stores without an `onlineSource`,
 * so the store counts as online. It's only used by code that imports NetInfo, like the
 * store created in `app/_layout.tsx`.
 */
export default {
  fetch: jest.fn().mockResolvedValue({ isConnected: true }),
  addEventListener: jest.fn((listener: (state: { isConnected: boolean }) => void) => {
    listener({ isConnected: true });
    return () => {};
  }),
};
