# Expo dependency maintenance

The Expo CLI 0.24.20 dependency accepts Undici^6.18.2; Expo server0.6.3 accepts ^6.18.2 || ^7.0.0. The patched6.29.1 lock entry already satisfies those parents, so no override is necessary. npm ci installs the exact validated graph; npm update undici can refresh compatible6.x releases without changing Expo/RN APIs. Review every resulting lock entry and run typecheck, lint, Jest and Expo/native checks. Do not independently force a new CLI/server or Undici major.

Expo53/RN0.79 is an old deprecated SDK pairing; this security fix does not make it a current supported platform. Undici 6 upstream end of life is2027-04-30. A separate sequential Expo SDK migration (one SDK at a time with the corresponding React Native/native modules and device builds) is required for a longer support horizon. That is broader than this toolchain-only security PR and cannot be certified by JS tests alone.

The local kiss-for-react tarball dependencies are intentional repository inputs; preserve their exact artifacts/integrity. Dependency ranges do not automatically refresh locks. A separately approved repository-native dependency-update PR configuration could flag updates; no app installation, background automation or auto-merge is introduced.

Sources: https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/ and https://github.com/nodejs/undici#long-term-support .
