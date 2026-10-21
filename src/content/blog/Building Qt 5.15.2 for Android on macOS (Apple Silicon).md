---
title: Building Qt 5.15.2 for Android on Apple Silicon macOS
description: Learn how to cross-compile Qt 5.15.2 for Android on Apple Silicon Macs running macOS 26. Fix NDK r21 ranlib compatibility issues and build ARM64, ARMv7, and x86_64 targets.
pubDate: 2025-10-10
heroImage: ../../assets/blog-placeholder-3.jpg
pinned: true
tags:
  - Qt
  - Android
  - macOS
  - Cross-Compilation
layout: ../../layouts/post/PostWide.astro
---

> **Target:** Android (`arm64-v8a`, `armeabi-v7a`, `x86_64`)  
> **Host:** macOS 26.x with Xcode 26.x, Apple Silicon  
> **Difficulty:** Advanced — legacy NDK r21 toolchain compatibility issues on modern macOS

## 1. Prerequisites

### Required tools

| Tool | Version | Purpose | Installation |
|---|---|---|---|
| Android Studio | Latest | Android SDK and toolchain management | `brew install --cask android-studio` |
| Android NDK | r21e — `21.4.7075529` | Primary toolchain for Qt 5.15.2 | Android Studio SDK Manager |
| Android NDK | r29 — `29.0.14206865` | Provides an alternative `llvm-ranlib` binary | Android Studio SDK Manager |
| Java JDK | 11 | Java development tools | `brew install openjdk@11` |
| Xcode | 26.x | Apple SDKs and host development tools | Mac App Store or Apple Developer |
| Qt source code | 5.15.2 | Source tree to compile for Android | Qt source archive or existing checkout |

### Install JDK 11

```bash
brew install openjdk@11

echo 'export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

java -version
```

The Java version should report `11.x`.

### Install the Android NDK

Open Android Studio and navigate to:

**Settings → Languages & Frameworks → Android SDK → SDK Tools**

Enable **Show Package Details**, then install:

- **NDK (Side by side) → 21.4.7075529**
- **NDK (Side by side) → 29.0.14206865**

Verify the installations:

```bash
ls ~/Library/Android/sdk/ndk/
```

Expected directories:

```text
21.4.7075529
29.0.14206865
```

## 2. The NDK r21 Problem on macOS 26

Qt 5.15.2 is a legacy Qt release, and its Android build configuration is commonly used with NDK r21e. However, older NDK toolchain binaries can encounter compatibility problems on newer macOS versions.

In the environment described in this guide, the problematic binary was:

```text
aarch64-linux-android-ranlib
```

The build failed with an error similar to:

```text
libc++abi: Terminating due to typed operator new being invoked before
its static initializer in libcxx has been executed.
Abort trap: 6
```

The workaround described below uses `llvm-ranlib` from NDK r29 in place of the corresponding NDK r21 wrapper. This is a targeted workaround, not a guarantee that all NDK r21 compatibility problems on macOS 26 will be resolved.

**Important:** Mixing binaries from different NDK releases is not an officially guaranteed configuration. Back up the original binaries and validate the resulting build before relying on it for production.

## 3. Fix the `ranlib` Compatibility Issue

The following commands replace the ARM64 `ranlib` executable with a symbolic link to the NDK r29 `llvm-ranlib` binary.

### ARM64 — `arm64-v8a`

Back up the original binary:

```bash
NDK21="$HOME/Library/Android/sdk/ndk/21.4.7075529"
NDK29="$HOME/Library/Android/sdk/ndk/29.0.14206865"

BIN21="$NDK21/toolchains/llvm/prebuilt/darwin-x86_64/bin"
BIN29="$NDK29/toolchains/llvm/prebuilt/darwin-x86_64/bin"

cp "$BIN21/aarch64-linux-android-ranlib" \
   "$BIN21/aarch64-linux-android-ranlib.bak"
```

Replace it with a symbolic link:

```bash
ln -sf "$BIN29/llvm-ranlib" \
       "$BIN21/aarch64-linux-android-ranlib"
```

Verify the link:

```bash
ls -la "$BIN21/aarch64-linux-android-ranlib"
```

### Restore the original binary

If the workaround causes problems, restore the backup:

```bash
cp -f "$BIN21/aarch64-linux-android-ranlib.bak" \
      "$BIN21/aarch64-linux-android-ranlib"
```

### Other architectures

Apply the same workaround to the corresponding binaries if they exhibit the same failure.

For `armeabi-v7a`:

```bash
cp "$BIN21/arm-linux-androideabi-ranlib" \
   "$BIN21/arm-linux-androideabi-ranlib.bak"

ln -sf "$BIN29/llvm-ranlib" \
       "$BIN21/arm-linux-androideabi-ranlib"
```

For `x86_64`:

```bash
cp "$BIN21/x86_64-linux-android-ranlib" \
   "$BIN21/x86_64-linux-android-ranlib.bak"

ln -sf "$BIN29/llvm-ranlib" \
       "$BIN21/x86_64-linux-android-ranlib"
```

Use these substitutions only after confirming that the original binaries fail and that the replacement is compatible with the build.

## 4. Configure Qt for Android

Before running `configure`, make sure the Qt source tree contains any required macOS compatibility patches from your main build guide. Patches affecting shared Qt headers or sources may also affect Android builds, but macOS-specific patches should not be applied blindly to Android targets.

The examples below use:

```text
~/Downloads/qt-everywhere-src-5.15.2
```

Adjust the path if your Qt source directory is elsewhere.

### ARM64 — `arm64-v8a`

This target is intended for modern 64-bit Android devices.

```bash
mkdir -p ~/qt5-build-android-arm64
cd ~/qt5-build-android-arm64

~/Downloads/qt-everywhere-src-5.15.2/configure \
  -prefix ~/Qt/5.15.2/android_arm64_v8a \
  -opensource \
  -confirm-license \
  -xplatform android-clang \
  -android-ndk ~/Library/Android/sdk/ndk/21.4.7075529 \
  -android-sdk ~/Library/Android/sdk \
  -android-ndk-host darwin-x86_64 \
  -android-arch arm64-v8a \
  -android-ndk-platform android-21 \
  -nomake examples \
  -nomake tests \
  -skip qtwebengine \
  -skip qtscript \
  -no-warnings-are-errors
```

### Configure options explained

| Option | Description |
|---|---|
| `-prefix` | Sets the installation directory for the compiled Qt libraries. |
| `-opensource` | Selects the open-source licensing option. |
| `-confirm-license` | Accepts the license confirmation prompt. |
| `-xplatform android-clang` | Selects Qt's Android Clang cross-compilation configuration. |
| `-android-ndk` | Specifies the Android NDK directory. |
| `-android-sdk` | Specifies the Android SDK directory. |
| `-android-ndk-host darwin-x86_64` | Selects the NDK host-toolchain directory for macOS. |
| `-android-arch` | Specifies the target Android ABI. |
| `-android-ndk-platform android-21` | Sets Android API level 21 as the target platform baseline. |
| `-nomake examples` | Skips building Qt examples. |
| `-nomake tests` | Skips building Qt tests. |
| `-skip qtwebengine` | Excludes Qt WebEngine. |
| `-skip qtscript` | Excludes Qt Script. |
| `-no-warnings-are-errors` | Prevents compiler warnings from automatically being treated as errors. |

**Note:** `-android-ndk-platform android-21` is a toolchain target setting; verify the final minimum Android API level and deployment requirements of your application separately.

## 5. Build and Install Qt

After configuration completes successfully, compile and install Qt:

```bash
make -j"$(sysctl -n hw.logicalcpu)"
make install
```

The installed libraries should be available at:

```text
~/Qt/5.15.2/android_arm64_v8a/
```

Build times vary depending on the Mac, memory, selected modules, and whether the build is incremental. Allow sufficient disk space for the source tree, intermediate objects, and installed libraries.

## 6. Build for Other Android Architectures

Each ABI requires its own build directory and installation prefix. Do not reuse a build directory configured for a different architecture.

### Architecture overview

| Android ABI | Build directory | Installation prefix | Typical use |
|---|---|---|---|
| `arm64-v8a` | `~/qt5-build-android-arm64` | `~/Qt/5.15.2/android_arm64_v8a` | Modern 64-bit Android devices |
| `armeabi-v7a` | `~/qt5-build-android-armv7` | `~/Qt/5.15.2/android_armv7` | Legacy 32-bit ARM devices |
| `x86_64` | `~/qt5-build-android-x86_64` | `~/Qt/5.15.2/android_x86_64` | Android emulators and x86-64 environments |

### ARMv7 — `armeabi-v7a`

```bash
mkdir -p ~/qt5-build-android-armv7
cd ~/qt5-build-android-armv7

~/Downloads/qt-everywhere-src-5.15.2/configure \
  -prefix ~/Qt/5.15.2/android_armv7 \
  -opensource \
  -confirm-license \
  -xplatform android-clang \
  -android-ndk ~/Library/Android/sdk/ndk/21.4.7075529 \
  -android-sdk ~/Library/Android/sdk \
  -android-ndk-host darwin-x86_64 \
  -android-arch armeabi-v7a \
  -android-ndk-platform android-21 \
  -nomake examples \
  -nomake tests \
  -skip qtwebengine \
  -skip qtscript \
  -no-warnings-are-errors

make -j"$(sysctl -n hw.logicalcpu)"
make install
```

### x86_64 — Android emulator

```bash
mkdir -p ~/qt5-build-android-x86_64
cd ~/qt5-build-android-x86_64

~/Downloads/qt-everywhere-src-5.15.2/configure \
  -prefix ~/Qt/5.15.2/android_x86_64 \
  -opensource \
  -confirm-license \
  -xplatform android-clang \
  -android-ndk ~/Library/Android/sdk/ndk/21.4.7075529 \
  -android-sdk ~/Library/Android/sdk \
  -android-ndk-host darwin-x86_64 \
  -android-arch x86_64 \
  -android-ndk-platform android-21 \
  -nomake examples \
  -nomake tests \
  -skip qtwebengine \
  -skip qtscript \
  -no-warnings-are-errors

make -j"$(sysctl -n hw.logicalcpu)"
make install
```

Repeat the `ranlib` workaround from Section 3 for an architecture only if its corresponding binary fails in the same way.

## 7. Configure Qt Creator

Once all required architectures have been built and installed, configure Qt Creator to use them.

### Configure the Android development environment

Open:

**Qt Creator → Preferences → Devices → Android**

Set the following paths:

| Setting | Path |
|---|---|
| Java JDK | `/opt/homebrew/opt/openjdk@11` |
| Android SDK | `~/Library/Android/sdk` |
| Android NDK | `~/Library/Android/sdk/ndk/21.4.7075529` |

The exact labels and menu locations may vary by Qt Creator version.

### Register the Qt versions

Open:

**Preferences → Kits → Qt Versions**

Add the `qmake` executable for each installation:

| Qt version | `qmake` path |
|---|---|
| Android ARM64 | `~/Qt/5.15.2/android_arm64_v8a/bin/qmake` |
| Android ARMv7 | `~/Qt/5.15.2/android_armv7/bin/qmake` |
| Android x86_64 | `~/Qt/5.15.2/android_x86_64/bin/qmake` |

### Create build kits

In the **Kits** section, create a separate kit for each ABI. Associate each kit with the matching Qt version and Android compiler/toolchain.

Verify that the configured JDK, SDK, NDK, compiler, and Qt installation are compatible before building an application.

## 8. Troubleshooting

| Error or symptom | Likely cause | Recommended action |
|---|---|---|
| `Abort trap: 6` when running `ranlib` | Legacy NDK tool incompatibility | Verify the failing executable and test the workaround in Section 3. |
| `NDK not found` | Incorrect NDK installation path | Check `~/Library/Android/sdk/ndk/` and the configure arguments. |
| `java: command not found` | JDK is missing from `PATH` | Install JDK 11 and reload `~/.zshrc`. |
| `android-clang platform not found` | Incorrect Qt platform configuration or incompatible toolchain | Verify `-xplatform android-clang`, the NDK path, and API level. |
| Configuration fails on a Qt module | Missing dependencies or unsupported module configuration | Review the configure output and check module requirements. |
| Compilation fails after configuration | Compiler incompatibility, missing dependencies, or source patches | Inspect the first compiler error rather than the last error in the log. |
| Qt Creator cannot detect a Qt installation | Incorrect `qmake` path or incomplete installation | Verify the installation prefix and the `bin/qmake` executable. |
| Application fails on a device or emulator | ABI, API level, or deployment configuration mismatch | Verify the selected kit, Android ABI, SDK settings, and packaged libraries. |

## 9. Final Notes

Building Qt 5.15.2 for Android on a modern Apple Silicon Mac requires careful coordination between the Qt source tree, Android NDK, SDK, JDK, and Qt Creator configuration.

The main points to remember are:

- Keep a separate build directory and installation prefix for each Android ABI.
- Back up NDK binaries before applying compatibility workarounds.
- Treat cross-version NDK binary replacement as an environment-specific workaround, not a universally supported fix.
- Validate the resulting libraries and test deployment on the intended Android devices or emulator images.
- Record the tool versions and patches used so the build can be reproduced later.

This guide documents a build workflow based on macOS 26.x, Xcode 26.x, Apple Silicon, Qt 5.15.2, and Android NDK r21e, with NDK r29 used for the `ranlib` workaround where necessary.
| `Abort trap: 6` when running `ranlib` | Legacy NDK tool incompatibility | Verify the failing executable and test the workaround in Section 3. |
| `NDK not found` | Incorrect NDK installation path | Check `~/Library/Android/sdk/ndk/` and the configure arguments. |
| `java: command not found` | JDK is missing from `PATH` | Install JDK 11 and reload `~/.zshrc`. |
| `android-clang platform not found` | Incorrect Qt platform configuration or incompatible toolchain | Verify `-xplatform android-clang`, the NDK path, and API level. |
| Configuration fails on a Qt module | Missing dependencies or unsupported module configuration | Review the configure output and check module requirements. |
| Compilation fails after configuration | Compiler incompatibility, missing dependencies, or source patches | Inspect the first compiler error rather than the last error in the log. |
| Qt Creator cannot detect a Qt installation | Incorrect `qmake` path or incomplete installation | Verify the installation prefix and the `bin/qmake` executable. |
| Application fails on a device or emulator | ABI, API level, or deployment configuration mismatch | Verify the selected kit, Android ABI, SDK settings, and packaged libraries. |

## 9. Final Notes

Building Qt 5.15.2 for Android on a modern Apple Silicon Mac requires careful coordination between the Qt source tree, Android NDK, SDK, JDK, and Qt Creator configuration.

The main points to remember are:

- Keep a separate build directory and installation prefix for each Android ABI.
- Back up NDK binaries before applying compatibility workarounds.
- Treat cross-version NDK binary replacement as an environment-specific workaround, not a universally supported fix.
- Validate the resulting libraries and test deployment on the intended Android devices or emulator images.
- Record the tool versions and patches used so the build can be reproduced later.

This guide documents a build workflow based on macOS 26.x, Xcode 26.x, Apple Silicon, Qt 5.15.2, and Android NDK r21e, with NDK r29 used for the `ranlib` workaround where necessary.-
