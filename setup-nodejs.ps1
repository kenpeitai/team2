# Node.js便携版下载和设置脚本
Write-Host "🚀 开始下载便携版Node.js..." -ForegroundColor Green

# 创建nodejs-portable目录
$nodejsDir = "nodejs-portable"
if (!(Test-Path $nodejsDir)) {
    New-Item -ItemType Directory -Path $nodejsDir
    Write-Host "✅ 创建了 $nodejsDir 目录" -ForegroundColor Green
}

# 设置下载参数
$nodeVersion = "20.11.1"  # 使用LTS版本
$downloadUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-win-x64.zip"
$zipFile = "$nodejsDir\node-v$nodeVersion-win-x64.zip"
$extractDir = "$nodejsDir\node-v$nodeVersion-win-x64"

Write-Host "📥 正在下载 Node.js v$nodeVersion..." -ForegroundColor Yellow
Write-Host "下载地址: $downloadUrl" -ForegroundColor Gray

try {
    # 下载Node.js
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile -UseBasicParsing
    Write-Host "✅ 下载完成" -ForegroundColor Green
    
    # 解压文件
    Write-Host "📦 正在解压文件..." -ForegroundColor Yellow
    Expand-Archive -Path $zipFile -DestinationPath $nodejsDir -Force
    Write-Host "✅ 解压完成" -ForegroundColor Green
    
    # 设置环境变量
    $nodePath = (Resolve-Path $extractDir).Path
    $env:PATH = "$nodePath;$env:PATH"
    
    Write-Host "✅ Node.js已设置到PATH" -ForegroundColor Green
    
    # 验证安装
    Write-Host "🔍 验证安装..." -ForegroundColor Yellow
    $nodeVersionOutput = & "$nodePath\node.exe" --version
    $npmVersionOutput = & "$nodePath\npm.cmd" --version
    
    Write-Host "✅ Node.js版本: $nodeVersionOutput" -ForegroundColor Green
    Write-Host "✅ npm版本: $npmVersionOutput" -ForegroundColor Green
    
    # 创建环境设置脚本
    $envScript = @"
# Node.js环境设置脚本
# 运行此脚本以设置Node.js环境变量

`$nodePath = "`$PSScriptRoot\node-v$nodeVersion-win-x64"
`$env:PATH = "`$nodePath;`$env:PATH"

Write-Host "✅ Node.js环境已设置" -ForegroundColor Green
Write-Host "Node.js路径: `$nodePath" -ForegroundColor Gray

# 验证
`$nodeVersion = & "`$nodePath\node.exe" --version
`$npmVersion = & "`$nodePath\npm.cmd" --version
Write-Host "Node.js: `$nodeVersion, npm: `$npmVersion" -ForegroundColor Green
"@
    
    $envScript | Out-File -FilePath "$nodejsDir\setup-env.ps1" -Encoding UTF8
    Write-Host "✅ 创建了环境设置脚本: $nodejsDir\setup-env.ps1" -ForegroundColor Green
    
    # 清理下载的zip文件
    Remove-Item $zipFile -Force
    Write-Host "✅ 清理了下载文件" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🎉 Node.js便携版设置完成！" -ForegroundColor Green
    Write-Host ""
    Write-Host "使用方法:" -ForegroundColor Yellow
    Write-Host "1. 运行: .\$nodejsDir\setup-env.ps1" -ForegroundColor White
    Write-Host "2. 然后运行: cd frontend; npm ci" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host "❌ 下载或设置失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "请检查网络连接或手动下载Node.js" -ForegroundColor Yellow
}
