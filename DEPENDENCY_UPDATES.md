# Expo 58 migration and dependency maintenance

This app now directly declares Expo `~58.0.21`, React/React DOM `19.3.0`, React Native `0.88.0`, Router `~58.0.28`, Reanimated `4.7.1` and Worklets `0.13.0`. Native dependency versions follow the published Expo SDK compatibility map. The migration was staged through SDKs 54, 55, 56, 57 and 58; do not independently upgrade React Native or native modules outside their supported SDK pairing.

The final graph resolves Expo CLI 58.1.17, expo-server 58.0.6 and fetch-nodeshim 0.4.10. It has no installed `undici` package and needs no Undici override. This does not certify every dependency as vulnerability-free.

## Reproducible setup

Use a patched supported Node line. Validation used portable Node 24.22.1; no host runtime was changed. Expo's lower engine minimum is not a security patch guarantee.

`kiss-for-react` (`^2.0.3`) and `eslint-plugin-kiss-for-react` (`^1.0.1`) are installed from the npm registry. A fresh clone needs no sibling Kiss checkout or local `.tgz` files.

```sh
npm ci
npm run validate
npx expo-doctor
npx expo export --platform all --clear
```

Clean validation initially disabled install lifecycle scripts (`npm ci --ignore-scripts`) after inspecting package metadata; the application tests and real Expo bundler were then executed explicitly. No peer bypass, mocked runtime app, EAS login, merge or deployment was used.

## Application compatibility changes

- Use the public Router API and SDK 56+ Router-owned navigation entry points; remove unused direct React Navigation packages.
- Gate rapid card presses immediately because Router 58 queues navigation until commit. Reset the gate when Back focuses Home again. Real Router tests reproduce the double-opening failure without the immediate guard, then verify single-Back recovery and re-opening with the guard. Cold valid/invalid detail URLs use the actual detail screen, choose Home and successfully open another card even when navigation history remains. A synchronous pre-navigation failure releases the gate and is rethrown; fault injection verifies that retry remains possible. Keep the nested `[id]` screen name consistent with its layout.
- Preserve native AsyncStorage persistence when no browser `window` exists, while skipping storage during web server rendering. Keep the existing `state` key and serialized liked-card IDs.
- Use React's hydration snapshot API for theme initialization. Apply browser safe-area spacing through CSS while native screens retain their inset hooks.
- Preserve the generic animated list, including configurable `CellRendererComponent`. Reanimated's `Animated.FlatList` excludes that prop, so the supported `createAnimatedComponent` wrapper remains; revisit it if that convenience component gains equivalent support.
- Remove obsolete `newArchEnabled` and `edgeToEdgeEnabled` switches. SDK 55+ requires the New Architecture and Android edge-to-edge. Preserve URL scheme `rickandmortyexample`, SPA `web.output: "single"`, assets, EAS project identity, screens and data access.

## Validation and remaining release gates

SDK 54 passed official dependency alignment, typecheck and the original 22 tests. SDK 55 exposed type migrations fixed before SDK 56; the original 22 tests passed throughout. SDKs 56 and 57 passed alignment/typecheck/tests after the relevant changes. SDK 58 passed Expo Doctor 20/20, clean npm ci, npm ls (no invalid peers), typecheck, strict lint, all 28 tests (including four real-Router navigation regression cases) and local Android/iOS/web bundle export.

Real Chrome testing used the exported app and the public GraphQL API: character loading, detail navigation, favorites reflected on Home, persistence after reload, theme switching, pagination to page 2 and single-Back recovery after rapid double press passed. The last viewport/invalid-ID browser checks were interrupted when Chrome disconnected; they are not certified. Direct detail links without loaded card data retain the existing "Card not found / Deep Linking not implemented" behavior; this migration does not add deep-link fetching. Offline/retry behavior remains covered by the existing action tests, with full device network-loss testing still required.

An Android project was generated successfully only in a disposable validation copy, with test-only package `com.example.rickmigrationvalidation`. No native directories existed in the repository, and none were deleted. The debug native build reached compilation but failed when the disk filled. Java used the existing Windows root store without changing trust or disabling TLS. No APK/device run is certified. No physical phone was modified. iOS native compilation/device testing requires a supported macOS/Xcode environment and was not run. JS/Hermes bundles are not native runtime tests.

Before shipping, build and exercise the real Android/iOS application identity on devices: navigation/Back/rapid presses, deep links and refresh, likes across restart, offline/retry, scrolling/parallax/gestures, safe areas/edge-to-edge, fonts/splash/images, themes and haptics. SDK 58 raises supported native platform/toolchain requirements; review its release notes rather than assuming SDK 53 deployment compatibility. No production deployment was performed.

## Remaining advisory exposure

`npm audit` reports 16 affected package entries (3 high, 13 low), propagated from two advisory roots. As checked on 2026-10-28, neither has a fix compatible with this SDK pairing:

| Installed dependency | Advisory and prerequisites | Exposure found here |
| --- | --- | --- |
| zod 3.25.76 | [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5): validating oversized constrained collections can exhaust memory. Fixed only in zod 4.6.6; the latest `@expo/cli` (58.1.17) still requires zod `^3.25.76`. | Expo CLI tooling. No app-input path to its validation identified. |
| deepmerge 4.3.1 | [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4): `mergeObject()` allows prototype poisoning of returned objects. 4.3.1 is the latest published version. | `@expo/config` and `jest-config` configuration merging. No app-input path identified. |

The earlier braces, node-forge and sprintf-js advisories (checked 2026-10-22) are no longer reported.

These are unresolved version findings, not proof of exploitation or a clean security audit. Do not run `npm audit fix --force`: its suggested old Expo/Jest downgrades are incompatible with this SDK pairing. Avoid untrusted build configurations/patterns and keep dev tooling private. Recheck upstream fixes and update compatible parent packages when patches become available.

Expo's current ESLint config includes eslint-plugin-react 7.37.5, whose peer range stops at ESLint 9; this project keeps that compatible ESLint line rather than forcing ESLint 10 through an unsupported peer. Track the upstream plugin/config update path. The lockfile provides reproducibility, and compatible manifest ranges allow updates, but neither refreshes locks automatically. No background bot, dependency automation or auto-merge was enabled.

## Future updates

Follow [Expo's sequential SDK upgrade guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/), run `npx expo install --fix`, inspect both manifest and lock diffs, then repeat `npm run validate`, Doctor, export and native device checks. Use matching [SDK 56 Router migration](https://docs.expo.dev/router/migrate/sdk-55-to-56/) and [SDK 58 Router migration](https://docs.expo.dev/router/migrate/sdk-57-to-58/) guidance. See [SDK 58 release notes](https://expo.dev/changelog/sdk-58) for platform requirements. Re-run the security audit after every graph update; latest Expo alone is not a vulnerability guarantee.
