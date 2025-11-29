
#!/bin/bash

echo "🧹 Cleaning build artifacts and cache..."

# Stop any running dev server first (you'll need to do this manually with Ctrl+C)

# Remove Vite cache
if [ -d "node_modules/.vite" ]; then
  echo "Removing node_modules/.vite..."
  rm -rf node_modules/.vite
fi

# Remove dist folder
if [ -d "dist" ]; then
  echo "Removing dist..."
  rm -rf dist
fi

# Remove any .next artifacts (if they exist)
if [ -d ".next" ]; then
  echo "Removing .next..."
  rm -rf .next
fi

# Remove general cache
if [ -d "node_modules/.cache" ]; then
  echo "Removing node_modules/.cache..."
  rm -rf node_modules/.cache
fi

# Verify client.tsx is gone
if [ -f "integrations/supabase/client.tsx" ]; then
  echo "⚠️  WARNING: client.tsx still exists! Removing it now..."
  rm integrations/supabase/client.tsx
else
  echo "✅ client.tsx is already deleted"
fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm run dev (or yarn dev)"
echo "2. If errors persist, run: rm -rf node_modules && npm install"
