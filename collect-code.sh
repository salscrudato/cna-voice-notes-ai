#!/bin/bash

# Script to collect all front and backend code into a single text file
# Usage: ./collect-code.sh

OUTPUT_FILE="code-review.txt"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Clear output file if it exists
> "$OUTPUT_FILE"

# Function to add file to output
add_file_to_output() {
    local file="$1"
    local relative_path="${file#$REPO_ROOT/}"
    
    echo "Processing: $relative_path"
    
    {
        echo "================================================================================"
        echo "FILE: $relative_path"
        echo "================================================================================"
        cat "$file"
        echo ""
        echo ""
    } >> "$OUTPUT_FILE"
}

# Find and process all source code files
echo "Collecting source code files..."

# TypeScript/TSX files
find "$REPO_ROOT/src" -type f \( -name "*.ts" -o -name "*.tsx" \) | sort | while read file; do
    add_file_to_output "$file"
done

# JavaScript/JSX files
find "$REPO_ROOT/src" -type f \( -name "*.js" -o -name "*.jsx" \) | sort | while read file; do
    add_file_to_output "$file"
done

# CSS files
find "$REPO_ROOT/src" -type f -name "*.css" | sort | while read file; do
    add_file_to_output "$file"
done

# Configuration files
for config_file in "$REPO_ROOT/vite.config.ts" "$REPO_ROOT/tsconfig.json" "$REPO_ROOT/tsconfig.app.json" "$REPO_ROOT/tsconfig.node.json" "$REPO_ROOT/eslint.config.js" "$REPO_ROOT/package.json" "$REPO_ROOT/firebase.json"; do
    if [ -f "$config_file" ]; then
        add_file_to_output "$config_file"
    fi
done

# HTML files
if [ -f "$REPO_ROOT/index.html" ]; then
    add_file_to_output "$REPO_ROOT/index.html"
fi

echo "✓ Code collection complete!"
echo "✓ Output saved to: $OUTPUT_FILE"
echo "✓ Total lines: $(wc -l < "$OUTPUT_FILE")"

