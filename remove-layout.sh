#!/bin/bash
# Script to remove Layout wrapper from all pages in app/app directory

cd packages/console/src/app/app

# List of files to process (excluding layout.tsx itself)
files=(
  "page.tsx"
  "flows/page.tsx"
  "hotspots/page.tsx"
  "crab-notes/page.tsx"
  "settings/page.tsx"
  "marketplace/page.tsx"
  "marketplace/my-packs/page.tsx"
  "marketplace/payouts/page.tsx"
  "marketplace/payouts/[month]/page.tsx"
  "marketplace/opt-in/page.tsx"
  "marketplace/seller/page.tsx"
  "marketplace/payouts/connect/callback/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file"
    # Remove Layout import
    sed -i '/^import Layout from/d' "$file"
    # Remove opening Layout tags (with optional whitespace)
    sed -i 's/^[[:space:]]*<Layout>//' "$file"
    sed -i 's/return ([[:space:]]*<Layout>$/return (/' "$file"
    # Remove closing Layout tags
    sed -i 's/[[:space:]]*<\/Layout>//' "$file"
  fi
done

echo "Done!"

