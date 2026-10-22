# Expo 58 migration and dependency maintenance

This app now directly declares Expo `~58.0.17`, React/React DOM `19.3.0`, React Native `0.88.0`, Router `~58.0.25`, Reanimated `4.7.1` and Worklets `0.13.0`. Native dependency versions follow the published Expo SDK compatibility map. The migration was staged through SDKs 54, 55, 56, 57 and 58; do not independently upgrade React Native or native modules outside their supported SDK pairing.

The final graph resolves Expo CLI 58.1.14, expo-server 58.0.5 and fetch-nodeshim 0.4.10. It has no installed `undici` package and needs no Undici override. This does not certify every dependency as vulnerability-free.

## Reproducible setup

Use a patched supported Node line. Validation used portable Node 24.22.1; no host runtime was changed. Expo's lower engine minimum is not a security patch guarantee.

The existing file dependencies intentionally require these exact artifacts in a sibling Kiss checkout:

- `../kiss-for-react/kiss-for-react-2.0.0.tgz`, integrity `sha512-k4gONqQTkjG8uzrv7I66eWUAEq3EbJKSvZ8AbcxVtE+OH8SXTO4qiBfERliDBIVQtPbCLnY/JGgaiqksfBXHgA==`.
- `../kiss-for-react/eslint-plugin/eslint-plugin-kiss-for-react-1.0.0.tgz`, integrity `sha512-jYYgTGVaOAfcvQkcay0kDRKwL7u9997TB/mtkPavAv9x8jodvrvW20yP6EjADLS6KL3Rqn4vGReWxq3wZl8LVA==`.

Obtain the existing release artifacts before installation. A fresh clone of this repository alone does not contain them. Packing today's changed Kiss source under the same filename is not equivalent: npm validates the locked integrity. The migration preserves both identities and does not change the sibling library or its TypeScript 6.0.3 constraint.

```sh
npm ci
npm run validate
npx expo-doctor
npx expo export --platform all --clear
```

Clean validation initially disabled install lifecycle scripts (`npm ci --ignore-scripts`) after inspecting package metadata; the application tests and real Expo bundler were then executed explicitly. No peer bypass, mocked runtime app, EAS login, merge or deployment was used.

## Application compatibility changes

- Use the public Router API and SDK 56+ Router-owned navigation entry points; remove unused direct React Navigation packages.
- Gate rapid card presses immediately because Router 58 queues navigation until commit. Reset the gate when Back focuses Home again. A real Router test reproduces the double-opening failure without the immediate guard, then verifies single-Back recovery and re-opening with the guard. Keep the nested `[id]` screen name consistent with its layout.
- Preserve native AsyncStorage persistence when no browser `window` exists, while skipping storage during web server rendering. Keep the existing `state` key and serialized liked-card IDs.
- Use React's hydration snapshot API for theme initialization. Apply browser safe-area spacing through CSS while native screens retain their inset hooks.
- Preserve the generic animated list, including configurable `CellRendererComponent`. Reanimated's `Animated.FlatList` excludes that prop, so the supported `createAnimatedComponent` wrapper remains; revisit it if that convenience component gains equivalent support.
- Remove obsolete `newArchEnabled` and `edgeToEdgeEnabled` switches. SDK 55+ requires the New Architecture and Android edge-to-edge. Preserve URL scheme `rickandmortyexample`, SPA `web.output: "single"`, assets, EAS project identity, screens and data access.

## Validation and remaining release gates

SDK 54 passed official dependency alignment, typecheck and the original 22 tests. SDK 55 exposed type migrations fixed before SDK 56; the original 22 tests passed throughout. SDKs 56 and 57 passed alignment/typecheck/tests after the relevant changes. SDK 58 passed Expo Doctor 20/20, clean npm ci, npm ls (no invalid peers), typecheck, strict lint, all 25 tests (including a real-Router regression test) and local Android/iOS/web bundle export.

Real Chrome testing used the exported app and the public GraphQL API: character loading, detail navigation, favorites reflected on Home, persistence after reload, theme switching, pagination to page 2 and single-Back recovery after rapid double press passed. The last viewport/invalid-ID browser checks were interrupted when Chrome disconnected; they are not certified. Direct detail links without loaded card data retain the existing "Card not found / Deep Linking not implemented" behavior; this migration does not add deep-link fetching. Offline/retry behavior remains covered by the existing action tests, with full device network-loss testing still required.

An Android project was generated successfully only in a disposable validation copy, with test-only package `com.example.rickmigrationvalidation`. No native directories existed in the repository, and none were deleted. The debug native build reached compilation but failed when the disk filled. Java used the existing Windows root store without changing trust or disabling TLS. No APK/device run is certified. No physical phone was modified. iOS native compilation/device testing requires a supported macOS/Xcode environment and was not run. JS/Hermes bundles are not native runtime tests.

Before shipping, build and exercise the real Android/iOS application identity on devices: navigation/Back/rapid presses, deep links and refresh, likes across restart, offline/retry, scrolling/parallax/gestures, safe areas/edge-to-edge, fonts/splash/images, themes and haptics. SDK 58 raises supported native platform/toolchain requirements; review its release notes rather than assuming SDK 53 deployment compatibility. No production deployment was performed.

## Remaining advisory exposure

`npm audit` reports 48 affected package entries (30 high, 18 moderate), propagated from three advisory roots. As checked on 2026-10-22, all three official advisories list no patched version:

| Installed dependency | Advisory and prerequisites | Exposure found here |
| --- | --- | --- |
| braces 3.0.3 | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): attacker-controlled deeply nested brace patterns exhaust the stack. Published September 18. | Metro/Jest/glob tooling. No app-input path to the parser identified. |
| node-forge 1.4.0 | [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv): malformed RSA PKCS#1 v1.5 signatures with low-exponent keys. Published September 3. | Expo CLI code-signing certificate tooling; no app RSA verification path identified. |
| sprintf-js 1.0.3 | [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c): attacker-controlled format precision can throw. Published September 24. | argparse/js-yaml/Jest tooling. No app-controlled format-string path identified. |

These are unresolved version findings, not proof of exploitation or a clean security audit. Do not run `npm audit fix --force`: its suggested old Expo/Jest downgrades are incompatible with this SDK pairing. Avoid untrusted build configurations/patterns and keep dev tooling private. Recheck upstream fixes and update compatible parent packages when patches become available.

Expo's current ESLint config includes eslint-plugin-react 7.37.5, whose peer range stops at ESLint 9; this project keeps that compatible ESLint line rather than forcing ESLint 10 through an unsupported peer. Track the upstream plugin/config update path. The lockfile provides reproducibility, and compatible manifest ranges allow updates, but neither refreshes locks automatically. No background bot, dependency automation or auto-merge was enabled.

## Future updates

Follow [Expo's sequential SDK upgrade guide](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/), run `npx expo install --fix`, inspect both manifest and lock diffs, then repeat `npm run validate`, Doctor, export and native device checks. Use matching [SDK 56 Router migration](https://docs.expo.dev/router/migrate/sdk-55-to-56/) and [SDK 58 Router migration](https://docs.expo.dev/router/migrate/sdk-57-to-58/) guidance. See [SDK 58 release notes](https://expo.dev/changelog/sdk-58) for platform requirements. Re-run the security audit after every graph update; latest Expo alone is not a vulnerability guarantee.
