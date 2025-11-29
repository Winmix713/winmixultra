
@echo off
echo 🧹 Cleaning build artifacts and cache...
echo.

REM Remove Vite cache
if exist "node_modules\.vite" (
  echo Removing node_modules\.vite...
  rmdir /s /q "node_modules\.vite"
)

REM Remove dist folder
if exist "dist" (
  echo Removing dist...
  rmdir /s /q "dist"
)

REM Remove .next artifacts
if exist ".next" (
  echo Removing .next...
  rmdir /s /q ".next"
)

REM Remove general cache
if exist "node_modules\.cache" (
  echo Removing node_modules\.cache...
  rmdir /s /q "node_modules\.cache"
)

REM Verify client.tsx is gone
if exist "integrations\supabase\client.tsx" (
  echo ⚠️  WARNING: client.tsx still exists! Removing it now...
  del "integrations\supabase\client.tsx"
) else (
  echo ✅ client.tsx is already deleted
)

echo.
echo ✅ Cleanup complete!
echo.
echo Next steps:
echo 1. Run: npm run dev (or yarn dev)
echo 2. If errors persist, run: rmdir /s /q node_modules ^&^& npm install
pause
