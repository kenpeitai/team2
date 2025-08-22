# Node.js便携版下载脚本
Write-Host "Starting Node.js download..." -ForegroundColor Green

# 创建目录
$nodejsDir = "nodejs-portable"
if (!(Test-Path $nodejsDir)) {
    New-Item -ItemType Directory -Path $nodejsDir
    Write-Host "Created $nodejsDir directory" -ForegroundColor Green
}

# 下载参数
$nodeVersion = "20.11.1"
$downloadUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-win-x64.zip"
$zipFile = "$nodejsDir\node-v$nodeVersion-win-x64.zip"
$extractDir = "$nodejsDir\node-v$nodeVersion-win-x64"

Write-Host "Downloading Node.js v$nodeVersion..." -ForegroundColor Yellow

try {
    # 下载
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile -UseBasicParsing
    Write-Host "Download completed" -ForegroundColor Green
    
    # 解压
    Write-Host "Extracting files..." -ForegroundColor Yellow
    Expand-Archive -Path $zipFile -DestinationPath $nodejsDir -Force
    Write-Host "Extraction completed" -ForegroundColor Green
    
    # 设置PATH
    $nodePath = (Resolve-Path $extractDir).Path
    $env:PATH = "$nodePath;$env:PATH"
    
    # 验证
    $nodeVersionOutput = & "$nodePath\node.exe" --version
    $npmVersionOutput = & "$nodePath\npm.cmd" --version
    
    Write-Host "Node.js version: $nodeVersionOutput" -ForegroundColor Green
    Write-Host "npm version: $npmVersionOutput" -ForegroundColor Green
    
    # 清理
    Remove-Item $zipFile -Force
    
    Write-Host "Setup completed successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
