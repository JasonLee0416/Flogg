@echo off
echo ========================================
echo   Flogg APK Build Script (Windows)
echo ========================================
echo.

set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
echo JAVA_HOME = %JAVA_HOME%
echo.

echo [1/4] Installing dependencies...
call npm install
if errorlevel 1 ( echo FAILED: npm install & pause & exit /b 1 )

echo.
echo [2/4] Fixing dependency versions...
call npx expo install --fix
if errorlevel 1 ( echo FAILED: expo install --fix & pause & exit /b 1 )

echo.
echo [3/4] Cleaning previous build...
if exist android rd /s /q android

echo.
echo [4/4] Building APK (this may take 5-10 minutes)...
call npx expo prebuild --platform android --clean
call npx expo run:android --variant release
if errorlevel 1 ( echo FAILED: build & pause & exit /b 1 )

echo.
echo ========================================
echo   BUILD SUCCESS!
echo ========================================
echo   APK: android\app\build\outputs\apk\release\app-release.apk
echo ========================================
pause
