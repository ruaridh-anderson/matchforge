@echo off
setlocal

echo.
echo Matchforge local setup
echo ======================

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed or is not on PATH.
  echo Install Node.js 20.9 or newer, then reopen Command Prompt.
  exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo Node: %NODE_VERSION%

if exist node_modules (
  echo Removing incomplete node_modules...
  rmdir /s /q node_modules
  if exist node_modules (
    echo ERROR: Windows could not remove node_modules.
    echo Close VS Code and any Node processes, or move this folder outside OneDrive.
    exit /b 1
  )
)

echo Using public npm registry...
call npm config set registry https://registry.npmjs.org/
if errorlevel 1 exit /b 1

call npm cache verify
if errorlevel 1 exit /b 1

call npm install
if errorlevel 1 (
  echo.
  echo Install failed. Check any company proxy or web-filter settings.
  exit /b 1
)

echo.
echo Setup complete. Starting Matchforge...
call npm run dev
