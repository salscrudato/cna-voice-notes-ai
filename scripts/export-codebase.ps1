# Export Codebase Script
# Consolidates all functional coding files into a single repository file for external code review

$OutputFile = "CODEBASE_EXPORT.md"
$RootPath = (Get-Location).Path

# Define file extensions to include
$IncludeExtensions = @("*.tsx", "*.ts", "*.css", "*.json", "*.js", "*.html")

# Define directories to exclude
$ExcludeDirs = @("node_modules", "dist", ".git", "coverage", ".vscode")

# Define specific files to exclude
$ExcludeFiles = @("package-lock.json", "*.test.ts", "*.test.tsx")

# Start the output file
$Header = @"
# EVR Codebase Export
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

This file contains all functional coding files from the EVR application for external code review.

## Project Structure

``````
"@

# Get directory tree (excluding node_modules and dist)
$Tree = Get-ChildItem -Path $RootPath -Recurse -Directory | 
    Where-Object { 
        $path = $_.FullName
        -not ($ExcludeDirs | Where-Object { $path -like "*\$_*" })
    } |
    ForEach-Object { $_.FullName.Replace($RootPath, ".") }

$Header += ($Tree -join "`n")
$Header += @"

``````

---

## Source Files

"@

Set-Content -Path $OutputFile -Value $Header -Encoding UTF8

# Function to get language identifier for code blocks
function Get-LanguageId {
    param([string]$Extension)
    switch ($Extension) {
        ".tsx" { "tsx" }
        ".ts" { "typescript" }
        ".js" { "javascript" }
        ".jsx" { "jsx" }
        ".css" { "css" }
        ".json" { "json" }
        ".html" { "html" }
        ".md" { "markdown" }
        default { "" }
    }
}

# Get all matching files
$AllFiles = @()
foreach ($ext in $IncludeExtensions) {
    $files = Get-ChildItem -Path $RootPath -Filter $ext -Recurse -File |
        Where-Object {
            $path = $_.FullName
            $name = $_.Name
            # Exclude directories
            $inExcludedDir = $ExcludeDirs | Where-Object { $path -like "*\$_\*" }
            # Exclude test files
            $isTestFile = $name -match "\.test\.(ts|tsx)$"
            # Exclude package-lock
            $isPackageLock = $name -eq "package-lock.json"
            
            -not $inExcludedDir -and -not $isTestFile -and -not $isPackageLock
        }
    $AllFiles += $files
}

# Sort files by path for consistent output
$AllFiles = $AllFiles | Sort-Object { $_.FullName }

# Process each file
$FileCount = 0
foreach ($file in $AllFiles) {
    $RelativePath = $file.FullName.Replace($RootPath + "\", "").Replace("\", "/")
    $LangId = Get-LanguageId -Extension $file.Extension
    $Content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    $FileSection = @"

### $RelativePath

``````$LangId
$Content
``````

---
"@
    
    Add-Content -Path $OutputFile -Value $FileSection -Encoding UTF8
    $FileCount++
    Write-Host "Processed: $RelativePath"
}

# Add summary footer
$Footer = @"

## Summary

- **Total Files Exported**: $FileCount
- **Generated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
- **Project**: EVR (Voice Notes AI Application)

### Technology Stack
- React 19 with TypeScript
- Vite 7.x
- Tailwind CSS v4
- Firebase (Firestore, Storage, Analytics)
- OpenAI GPT-4o-mini

"@

Add-Content -Path $OutputFile -Value $Footer -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Export Complete!" -ForegroundColor Green
Write-Host "Output File: $OutputFile" -ForegroundColor Cyan
Write-Host "Total Files: $FileCount" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green

