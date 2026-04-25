Add-Type -AssemblyName System.Drawing

$sourcePath = "C:/Users/dheer/.gemini/antigravity/brain/f51a022e-f529-4c7a-87fa-d48927c163b3/uploaded_image_1766258744528.jpg"
$assetsDir = "d:\clint\apk videoo\rudnex\assets"

function Resize-ImageAndPad {
    param (
        [string]$SourcePath,
        [string]$DestPath,
        [int]$Width,
        [int]$Height,
        [string]$BgColorName = "White"
    )

    $srcImage = [System.Drawing.Image]::FromFile($SourcePath)
    $destBitmap = New-Object System.Drawing.Bitmap($Width, $Height)
    $graphics = [System.Drawing.Graphics]::FromImage($destBitmap)
    
    # Set background
    $brush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromName($BgColorName))
    $graphics.FillRectangle($brush, 0, 0, $Width, $Height)
    
    # Calculate aspect ratios to contain image
    $ratioX = $Width / $srcImage.Width
    $ratioY = $Height / $srcImage.Height
    $ratio = [Math]::Min($ratioX, $ratioY)
    
    $newWidth = [int]($srcImage.Width * $ratio)
    $newHeight = [int]($srcImage.Height * $ratio)
    
    $posX = [int](($Width - $newWidth) / 2)
    $posY = [int](($Height - $newHeight) / 2)
    
    # Draw image centered
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($srcImage, $posX, $posY, $newWidth, $newHeight)
    
    $destBitmap.Save($DestPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $srcImage.Dispose()
    $destBitmap.Dispose()
    $graphics.Dispose()
}

# 1. Create Icon (1024x1024 Square)
Resize-ImageAndPad -SourcePath $sourcePath -DestPath "$assetsDir\icon.png" -Width 1024 -Height 1024

# 2. Create Adaptive Icon (Same as icon for now, 1024x1024)
Copy-Item "$assetsDir\icon.png" -Destination "$assetsDir\adaptive-icon.png" -Force

# 3. Create Splash (1242x2436 Vertical)
Resize-ImageAndPad -SourcePath $sourcePath -DestPath "$assetsDir\splash.png" -Width 1242 -Height 2436

Write-Host "Assets processing complete."
