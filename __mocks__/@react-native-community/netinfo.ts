/**
 * Mock implementation for @react-native-community/netinfo
 * 
 * This mock is automatically used by Jest when testing code that imports 
 * the NetInfo module. It replaces the real implementation during tests,
 * providing consistent network status information without actual network calls.
 * 
 * Purpose:
 * - Provides a predictable network state for tests (always connected)
 * - Prevents tests from depending on actual network connectivity
 * - Speeds up test execution by avoiding real network operations
 * - Ensures consistent test results regardless of environment
 * 
 * How it works:
 * - Jest.fn() creates a mock function that can be tracked in tests
 * - mockResolvedValue() makes the function return a Promise that resolves to the object
 * - The mock always returns {isConnected: true} to simulate an online state
 * 
 * Usage in tests:
 * You can verify if the fetch method was called:
 * expect(NetInfo.fetch).toHaveBeenCalled()
 * 
 * You can also modify the mock for specific tests if needed:
 * NetInfo.fetch.mockResolvedValueOnce({ isConnected: false })
 */
export default {
  fetch: jest.fn().mockResolvedValue({ isConnected: true }),
};
