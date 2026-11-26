@echo off
setlocal
where node.exe >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js 22 separately.
  pause
  exit /b 1
)
node "%~dp0scripts\launch-local-preview.mjs"
if errorlevel 1 pause
