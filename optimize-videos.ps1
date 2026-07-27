# optimize-videos.ps1
# Remuxes every video with fast-start (moov atom moved to the front) so
# playback can begin as soon as the download starts, instead of waiting
# for most/all of the file to arrive first. Also generates a poster.jpg
# for each video so the card shows an image immediately instead of black.
#
# Usage:
#   cd D:\birthday-experience\birthday-experience
#   powershell -ExecutionPolicy Bypass -File optimize-videos.ps1

$ErrorActionPreference = "Stop"

$videosDir = Join-Path (Get-Location) "public\videos"
$postersDir = Join-Path (Get-Location) "public\videos\posters"

if (-not (Test-Path $videosDir)) {
    Write-Host "ERROR: public\videos folder not found. Run this from inside the project folder." -ForegroundColor Red
    exit 1
}

# Make sure ffmpeg is installed
$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ffmpeg) {
    Write-Host "ERROR: ffmpeg is not installed." -ForegroundColor Red
    Write-Host ""
    Write-Host "If you have winget (default on Windows 10/11):" -ForegroundColor Yellow
    Write-Host "    winget install ffmpeg" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or with Chocolatey:" -ForegroundColor Yellow
    Write-Host "    choco install ffmpeg" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or download manually from: https://www.gyan.dev/ffmpeg/builds/ (ffmpeg-release-essentials.zip)" -ForegroundColor Yellow
    Write-Host "Unzip it, add the bin folder to PATH, then open a new PowerShell window and run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "OK: ffmpeg found at $($ffmpeg.Source)" -ForegroundColor Green

New-Item -ItemType Directory -Force -Path $postersDir | Out-Null

$videoFiles = Get-ChildItem -Path $videosDir -File | Where-Object {
    $_.Extension -match '\.(mp4|mov|MP4|MOV)$'
}

if ($videoFiles.Count -eq 0) {
    Write-Host "ERROR: no videos found in public\videos" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($videoFiles.Count) videos. Starting processing..." -ForegroundColor Cyan
Write-Host ""

$tempDir = Join-Path $videosDir "_tmp_optimized"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

$successCount = 0
$failCount = 0

foreach ($file in $videoFiles) {
    $inputPath = $file.FullName
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $isMov = $file.Extension -match '\.mov$'
    # Output is always .mp4 even if the source was .MOV (fast-start remux
    # needs an mp4-compatible container). Uses a temp name distinct from
    # the source so we never try to overwrite a file that's still open.
    $outputPath = Join-Path $tempDir "$baseName.optimized.mp4"
    $posterPath = Join-Path $postersDir "$baseName.jpg"

    Write-Host "  -> $($file.Name)" -NoNewline

    try {
        # 1) Fast-start remux: copies video/audio streams as-is (no
        #    re-encode, so this is fast and lossless), just moves the
        #    metadata (moov atom) to the front of the file so playback
        #    can start as soon as the browser has downloaded a little bit,
        #    instead of needing the whole file first.
        & ffmpeg -y -i $inputPath -c copy -movflags +faststart -loglevel error $outputPath
        if ($LASTEXITCODE -ne 0) { throw "ffmpeg remux failed" }

        # 2) Grab a clean frame as the poster image (skip ahead 0.5s to
        #    avoid a black first frame some cameras record).
        & ffmpeg -y -ss 00:00:00.5 -i $inputPath -frames:v 1 -q:v 4 -vf "scale=640:-2" -loglevel error $posterPath
        if ($LASTEXITCODE -ne 0) {
            # Video shorter than 0.5s: fall back to the very first frame
            & ffmpeg -y -ss 0 -i $inputPath -frames:v 1 -q:v 4 -vf "scale=640:-2" -loglevel error $posterPath
        }

        Write-Host "  OK" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "  FAILED ($_)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "Replacing original videos with optimized versions..." -ForegroundColor Cyan

$renamedFiles = @()

foreach ($file in $videoFiles) {
    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    $isMov = $file.Extension -match '\.mov$'
    $optimizedPath = Join-Path $tempDir "$baseName.optimized.mp4"

    if (Test-Path $optimizedPath) {
        if ($isMov) {
            # .MOV files become .mp4 -- filename changes, so content.ts
            # needs to be updated afterward if any of these are referenced.
            $newTargetPath = Join-Path $videosDir "$baseName.mp4"
            Remove-Item $file.FullName -Force
            Move-Item $optimizedPath $newTargetPath -Force
            $renamedFiles += [PSCustomObject]@{ Old = $file.Name; New = "$baseName.mp4" }
        } else {
            Remove-Item $file.FullName -Force
            Move-Item $optimizedPath $file.FullName -Force
        }
    }
}

Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "Done: $successCount videos processed successfully, $failCount failed." -ForegroundColor Green
Write-Host "Posters are in public\videos\posters\" -ForegroundColor Green

if ($renamedFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "NOTE: these files were .MOV and are now .mp4 (filename changed):" -ForegroundColor Yellow
    foreach ($r in $renamedFiles) {
        Write-Host "    $($r.Old)  ->  $($r.New)" -ForegroundColor Yellow
    }
    Write-Host "If these aren't referenced in content.ts this doesn't matter. Otherwise let me know and I'll update the names." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next: content.ts already points to public\videos\posters\<name>.jpg for each video." -ForegroundColor Yellow
