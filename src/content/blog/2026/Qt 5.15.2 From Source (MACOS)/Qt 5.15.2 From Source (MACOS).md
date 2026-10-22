---
title: Qt 5.15.2 From Source (MACOS)
description: Here in this tutorial i will show you how to install qt 5.15.2 from source
pubDate: 2025-10-10
pinned: false
tags:
  - misc
  - introduction
  - personal
---

With the new Qt6 development Qt 5 have dissapered from the Qt Maintenecen tool so, if somebody still need to use the old Qt5 need to install from from source. Once i have tp gro trown this i tought i would make a little note how to do it for me andk for my or anyone that need to do it.

# Building Qt 5.15.2 from Source on macOS (Apple Silicon M1/M2/M3)

> **Target:** macOS 13+ with Xcode SDK 26.x, Apple Silicon (arm64)  
> **Goal:** Install Qt 5.15.2 alongside an existing Qt 6 installation  
> **Difficulty:** Advanced — expect SDK compatibility patches along the way

---

## 1. Prerequisites

### Xcode and Command Line Tools

So first off all we will need Xcode. I believe that if you are here you alredey have xcode installed but if not ...

```bash
xcode-select --install
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

Check your active SDK:

```bash
xcodebuild -showsdks
```

> ⚠️ **Important:** If you only have macOS SDK 26.x (Sequoia/later), you will need the source patches described in Section 5. Qt 5.15.2 was written before these SDKs existed.

### Homebrew Dependencies

```bash
brew install cmake ninja pkg-config postgresql@16
```

> **Do NOT install `openssl@1.1` from Homebrew** — it has been removed. You will build OpenSSL 1.1.1 from source in the next step.

---

## 2. Build OpenSSL 1.1.1 from Source

Qt 5.15.2 officially targets OpenSSL 1.1.x. While OpenSSL 3 may work, building 1.1.1 from source is the safest and most compatible approach.

```bash
cd ~
curl -L -O https://www.openssl.org/source/openssl-1.1.1w.tar.gz
```

> **Always use `-L` with curl** — without it, curl will not follow redirects and you will download an HTML error page instead of the tarball. Verify the download is ~9-10 MB before extracting.

```bash
ls -lh openssl-1.1.1w.tar.gz   # Should be ~9-10 MB
tar xf openssl-1.1.1w.tar.gz
cd openssl-1.1.1w

./config --prefix=/usr/local/openssl-1.1.1 --openssldir=/usr/local/openssl-1.1.1
make -j$(sysctl -n hw.logicalcpu)
sudo make install
```

Verify:

```bash
/usr/local/openssl-1.1.1/bin/openssl version
# OpenSSL 1.1.1w  11 Sep 2023
```

---

## 3. Install PostgreSQL 16

The Qt PostgreSQL driver (`-sql-psql`) only needs the `libpq` headers and libraries. Any PostgreSQL version works — use whatever you have installed.

```bash
brew install postgresql@16
```

Find the prefix for later use:

```bash
brew --prefix postgresql@16
# /opt/homebrew/opt/postgresql@16
```

---

## 4. Download Qt 5.15.2 Source

> ⚠️ **Note on the download URL:** Qt moved older releases to an `/archive/` path. The `/official_releases/` path returns a 404.

```bash
cd ~/Downloads
curl -L -O https://download.qt.io/archive/qt/5.15/5.15.2/single/qt-everywhere-src-5.15.2.tar.xz
```

This is ~600 MB. Verify the download:

```bash
ls -lh qt-everywhere-src-5.15.2.tar.xz   # Should be ~600 MB
```

Extract:

```bash
tar xf qt-everywhere-src-5.15.2.tar.xz
```

---

## 5. Apply Source Patches

Qt 5.15.2 was released before macOS SDK 26.x existed. Three patches are required to build successfully on modern Macs.

### 5.1 Fix `fp.h` (libpng)

**Error you will see:**

```
fatal error: 'fp.h' file not found
```

**Why it happens:**  
The bundled libpng in Qt 5.15.2 includes `<fp.h>` — a very old Apple Carbon header from the Classic Mac OS era, intended only for the obsolete Metrowerks CodeWarrior compiler. This header was removed from modern macOS SDKs. Since you are using Clang (not CodeWarrior), this include is completely unnecessary.

This fix is confirmed in the [official Qt forum](https://forum.qt.io/topic/161705) and corresponds to Qt's own upstream libpng update commit (`528032c`).

```bash
sed -i '' '/#      include <fp.h>/s/^/\/\//' \
  ~/Downloads/qt-everywhere-src-5.15.2/qtbase/src/3rdparty/libpng/pngpriv.h
```

Verify the line is now commented out:

```bash
grep -n "fp.h" ~/Downloads/qt-everywhere-src-5.15.2/qtbase/src/3rdparty/libpng/pngpriv.h
# 538: //      include <fp.h>
```

### 5.2 Fix `math.h` (libpng)

**Error you will see:**

```
error: call to undeclared library function 'floor'
error: call to undeclared library function 'frexp'
error: call to undeclared library function 'modf'
error: call to undeclared library function 'pow'
```

**Why it happens:**  
macOS SDK 26.x enforces strict C99 compliance — functions like `floor`, `frexp`, `modf`, and `pow` must be explicitly declared via `<math.h>`. In older SDKs these were implicitly available. The libpng source files `png.c` and `pngrtran.c` are missing this include.

```bash
sed -i '' '1s/^/#include <math.h>\n/' \
  ~/Downloads/qt-everywhere-src-5.15.2/qtbase/src/3rdparty/libpng/png.c

sed -i '' '1s/^/#include <math.h>\n/' \
  ~/Downloads/qt-everywhere-src-5.15.2/qtbase/src/3rdparty/libpng/pngrtran.c
```

Verify:

```bash
head -3 ~/Downloads/qt-everywhere-src-5.15.2/qtbase/src/3rdparty/libpng/png.c
head -3 ~/Downloads/qt-everywhere-src-5.15.2/qtbase/src/3rdparty/libpng/pngrtran.c
# Both should show: #include <math.h> on line 1
```

### 5.3 Fix `CGColorSpaceRef` (Cocoa platform)

**Error you will see:**

```
error: unknown type name 'CGColorSpaceRef'; did you mean 'QColorSpace'?
```

**Why it happens:**  
The Cocoa platform plugin header `qiosurfacegraphicsbuffer.h` uses the `CGColorSpaceRef` type from CoreGraphics, but does not explicitly include `<CoreGraphics/CoreGraphics.h>`. In older SDKs this type was transitively available. macOS SDK 26.x requires explicit includes.

First, find the include guard line in the file:

```bash
grep -n "QIOSURFACEGRAPHICSBUFFER_H" \
  ~/Downloads/qt-everywhere-src-5.15.2/qtbase/src/plugins/platforms/cocoa/qiosurfacegraphicsbuffer.h
```

Then add the CoreGraphics include immediately after the `#define` guard:

```bash
sed -i '' '/#define QIOSURFACEGRAPHICSBUFFER_H/a\
#include <CoreGraphics/CoreGraphics.h>
' ~/Downloads/qt-everywhere-src-5.15.2/qtbase/src/plugins/platforms/cocoa/qiosurfacegraphicsbuffer.h
```

> **macOS `sed` quirk:** On macOS, `sed -i ''` is used instead of `sed -i` (Linux). The `\n` escape does not work inline — the newline must be a real newline after the `a\` command, as shown above.

Verify:

```bash
grep -n "CoreGraphics\|QIOSURFACEGRAPHICSBUFFER_H" \
  ~/Downloads/qt-everywhere-src-5.15.2/qtbase/src/plugins/platforms/cocoa/qiosurfacegraphicsbuffer.h
# 41: #define QIOSURFACEGRAPHICSBUFFER_H
# 42: #include <CoreGraphics/CoreGraphics.h>
```

---

## 6. Configure Qt

### Why `-no-opengl`?

Qt 5.15.2 does not support Apple Metal natively. On M1, OpenGL is provided through Apple's compatibility layer, but the Qt 5.15.2 configure tests fail to detect it with macOS SDK 26.x. Using `-no-opengl` is the correct workaround.

> `QLocale`, `QtWidgets`, `QtNetwork`, `QtSql`, `QtQuick` and most other modules work perfectly without OpenGL. Only `QtLocation` (maps) and `QtWebEngine` require it.

### Why `-skip qtlocation`?

`QtLocation` depends on OpenGL for map rendering. Since we are using `-no-opengl`, it will fail to compile. Skip it unless you need GPS/map functionality (in which case, use Qt 6 which has native Metal support).

### Why `-skip qtwebengine`?

`QtWebEngine` requires OpenGL AND Python 2.7 to build. Both are unavailable in this configuration. Use the Qt 6 WebEngine instead.

### The Configure Command

```bash
mkdir ~/qt5-build && cd ~/qt5-build

OPENSSL_PREFIX=/usr/local/openssl-1.1.1
PG_PREFIX=$(brew --prefix postgresql@16)

~/Downloads/qt-everywhere-src-5.15.2/configure \
  -prefix /usr/local/Qt-5.15.2 \
  -release \
  -opensource \
  -confirm-license \
  -nomake examples \
  -nomake tests \
  -no-pch \
  -ssl \
  -openssl-linked \
  -I "$OPENSSL_PREFIX/include" \
  -L "$OPENSSL_PREFIX/lib" \
  -sql-psql \
  -I "$PG_PREFIX/include" \
  -L "$PG_PREFIX/lib" \
  -skip qtlocation \
  -skip qtwebengine \
  -platform macx-clang \
  QMAKE_MACOSX_DEPLOYMENT_TARGET=12.0 \
  QMAKE_APPLE_DEVICE_ARCHS=arm64
```

### Configure Flags Explained

|Flag|Explanation|
|---|---|
|`-prefix /usr/local/Qt-5.15.2`|Installation directory — separate from Qt 6 to avoid conflicts|
|`-release`|Optimised release build (no debug symbols). Use `-debug` or `-debug-and-release` if needed|
|`-opensource`|Accept the LGPL/GPL open source licence|
|`-confirm-license`|Auto-confirm the licence without interactive prompt|
|`-nomake examples`|Skip example apps — saves ~30% of build time|
|`-nomake tests`|Skip test suite|
|`-no-pch`|Disable precompiled headers — improves compatibility with newer Clang|
|`-no-opengl`|Disable OpenGL — required on M1 with SDK 26.x (see above)|
|`-ssl`|Enable SSL support|
|`-openssl-linked`|Link OpenSSL directly at compile time (more reliable than `-openssl-runtime`)|
|`-I "$OPENSSL_PREFIX/include"`|Tell the compiler where to find OpenSSL headers|
|`-L "$OPENSSL_PREFIX/lib"`|Tell the linker where to find OpenSSL libraries|
|`-sql-psql`|Build the PostgreSQL SQL driver|
|`-I "$PG_PREFIX/include"`|PostgreSQL (libpq) headers|
|`-L "$PG_PREFIX/lib"`|PostgreSQL libraries|
|`-skip qtlocation`|Skip the maps/GPS module (requires OpenGL)|
|`-skip qtwebengine`|Skip the web browser engine (requires OpenGL + Python 2)|
|`-platform macx-clang`|Use Apple Clang as the compiler|
|`QMAKE_MACOSX_DEPLOYMENT_TARGET=12.0`|Minimum supported macOS version|
|`QMAKE_APPLE_DEVICE_ARCHS=arm64`|Compile natively for Apple Silicon|

### Check the Configure Summary

After configure completes, verify these key lines:

```
OpenSSL 1.1 ............................ yes
Qt directly linked to OpenSSL .......... yes
PostgreSQL ............................. yes
```

---

## 7. Build Qt

```bash
cd ~/qt5-build
make -j$(sysctl -n hw.logicalcpu)
```

> This uses all available CPU cores. On an M1 MacBook Pro, expect **30–60 minutes**. On an M1 Mac mini or M2/M3, it may be faster.

> ⚠️ **Do not run `make install` before `make` completes without errors.** The install step copies already-compiled binaries — if anything failed to compile, you will get linker errors during install.

---

## 8. Install Qt

```bash
sudo make install
```

Qt 5.15.2 is now installed at `/usr/local/Qt-5.15.2/`.

Verify:

```bash
/usr/local/Qt-5.15.2/bin/qmake --version
# QMake version 3.1
# Using Qt version 5.15.2 in /usr/local/Qt-5.15.2/lib
```

---

## 9. Verify Installation in Qt Creator

1. Open **Qt Creator**
2. Go to **Preferences → Kits → Qt Versions**
3. Click **Add** and navigate to:
    
    ```
    /usr/local/Qt-5.15.2/bin/qmake
    ```
    
4. Go to the **Kits** tab and create a new kit using this Qt version
5. Qt 5.15.2 will now appear in the version dropdown when creating or opening projects

Both Qt 5.15.2 and Qt 6 will coexist independently — switching between them is done per-project via the kit selector.

---

## 10. Build Scripts

### Script 1 — Apple Silicon (arm64)

```bash
cd ~/qt5-build
rm -rf * .qmake.cache

OPENSSL_PREFIX=/usr/local/openssl-1.1.1
PG_PREFIX=$(brew --prefix postgresql@16)

~/Downloads/qt-everywhere-src-5.15.2/configure \
  -prefix /usr/local/Qt-5.15.2-arm64 \
  -release -opensource -confirm-license \
  -nomake examples -nomake tests -no-pch \
  -no-opengl -ssl -openssl-linked \
  -I "$OPENSSL_PREFIX/include" -L "$OPENSSL_PREFIX/lib" \
  -sql-psql \
  -I "$PG_PREFIX/include" -L "$PG_PREFIX/lib" \
  -skip qtlocation -skip qtwebengine \
  -platform macx-clang \
  QMAKE_MACOSX_DEPLOYMENT_TARGET=12.0 \
  QMAKE_APPLE_DEVICE_ARCHS=arm64

make -j$(sysctl -n hw.logicalcpu)
sudo make install
```

### Script 2 — Intel (x86_64)

```bash
mkdir ~/qt5-build-x86 && cd ~/qt5-build-x86

OPENSSL_PREFIX=/usr/local/openssl-1.1.1
PG_PREFIX=$(brew --prefix postgresql@16)

~/Downloads/qt-everywhere-src-5.15.2/configure \
  -prefix /usr/local/Qt-5.15.2-x86_64 \
  -release -opensource -confirm-license \
  -nomake examples -nomake tests -no-pch \
  -no-opengl -ssl -openssl-linked \
  -I "$OPENSSL_PREFIX/include" -L "$OPENSSL_PREFIX/lib" \
  -sql-psql \
  -I "$PG_PREFIX/include" -L "$PG_PREFIX/lib" \
  -skip qtlocation -skip qtwebengine \
  -platform macx-clang \
  QMAKE_MACOSX_DEPLOYMENT_TARGET=10.14 \
  QMAKE_APPLE_DEVICE_ARCHS=x86_64

make -j$(sysctl -n hw.logicalcpu)
sudo make install
```

### Script 3 — Universal Binary (arm64 + x86_64)

```bash
mkdir ~/qt5-build-universal && cd ~/qt5-build-universal

OPENSSL_PREFIX=/usr/local/openssl-1.1.1
PG_PREFIX=$(brew --prefix postgresql@16)

~/Downloads/qt-everywhere-src-5.15.2/configure \
  -prefix /usr/local/Qt-5.15.2-universal \
  -release -opensource -confirm-license \
  -nomake examples -nomake tests -no-pch \
  -no-opengl -ssl -openssl-linked \
  -I "$OPENSSL_PREFIX/include" -L "$OPENSSL_PREFIX/lib" \
  -sql-psql \
  -I "$PG_PREFIX/include" -L "$PG_PREFIX/lib" \
  -skip qtlocation -skip qtwebengine \
  -platform macx-clang \
  QMAKE_MACOSX_DEPLOYMENT_TARGET=10.14 \
  QMAKE_APPLE_DEVICE_ARCHS="arm64 x86_64"

make -j$(sysctl -n hw.logicalcpu)
sudo make install
```

> ⚠️ Universal builds take roughly **twice as long** to compile. All source patches from Section 5 apply to all three build variants.

---

## 11. Common Errors Reference

| Error                                                     | Cause                                                  | Fix                                                   |
| --------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------- |
| `fatal error: 'fp.h' file not found`                      | Old Carbon header removed from macOS SDK 26.x          | [Section 5.1](#51-fix-fph-libpng)                     |
| `call to undeclared library function 'floor'`             | `<math.h>` not included in libpng source               | [Section 5.2](#52-fix-mathh-libpng)                   |
| `unknown type name 'CGColorSpaceRef'`                     | CoreGraphics header missing from Cocoa plugin          | [Section 5.3](#53-fix-cgcolorspaceref-cocoa-platform) |
| `ERROR: Feature 'opengl-desktop' was enabled but failed`  | OpenGL not detectable on M1 with SDK 26.x              | Use `-no-opengl`                                      |
| `WARNING: Python version 2 required to build QtWebEngine` | Python 2 not available                                 | Use `-skip qtwebengine`                               |
| `ld: library 'qt_clip2tri' not found`                     | qtlocation failed to compile but install was attempted | Run `make` to completion before `make install`        |
| `Permission denied` on `.obj/` files                      | Ran `make` with `sudo` — polluted build dir ownership  | `sudo chown -R $(whoami) ~/qt5-build && make`         |
| `tar: Unrecognized archive format`                        | `curl` without `-L` downloaded an HTML redirect page   | Use `curl -L -O <url>`                                |
| `ERROR: Unknown command line option '-arch'`              | Qt 5.15.2 configure does not accept `-arch` directly   | Use `QMAKE_APPLE_DEVICE_ARCHS=arm64` instead          |

---

## 12. Module Notes

### QLocale

`QLocale` is part of **QtCore** — the base module. It is always compiled and available regardless of which optional modules are skipped. You do not need QtLocation for `QLocale`.

### QtLocation vs QLocale

These are completely unrelated:

||QLocale|QtLocation|
|---|---|---|
|Module|QtCore|QtLocation|
|Purpose|Number/date/currency formatting, language|Maps, GPS, geolocation|
|Requires OpenGL|No|Yes|
|Available in this build|✅ Yes|❌ Skipped|

### QtWebEngine

Requires OpenGL and Python 2.7. Neither is available in this configuration. **Use Qt 6's QtWebEngine** — it has native Metal support on M1 and works out of the box.

### Android Builds

The build described in this guide targets **macOS (arm64)**. To build Qt 5.15.2 for Android, a separate build targeting Android ABIs (`arm64-v8a`, `armeabi-v7a`, `x86_64`) is required, along with the Android NDK r21e and JDK 11. This is a separate process from the macOS host build.

---

_Guide written based on a real build session on macOS 26.2 (Sequoia), Xcode 16, Apple M1, March 2026._
