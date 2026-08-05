param([int]$Port = 9223)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$downloadPath = Join-Path $projectRoot 'web\public\demo\media'
$generatorPath = Join-Path $PSScriptRoot 'generate_mock_video.html'
$videoPath = Join-Path $downloadPath 'supply-chain-overview.webm'

if (Test-Path $videoPath) {
  Remove-Item $videoPath
}

$target = (Invoke-RestMethod "http://127.0.0.1:$Port/json")[0]
$socket = [System.Net.WebSockets.ClientWebSocket]::new()
$socket.ConnectAsync([Uri]$target.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult()

function Send-CdpCommand([int]$Id, [string]$Method, [hashtable]$Params) {
  $message = @{ id = $Id; method = $Method; params = $Params } | ConvertTo-Json -Compress
  $bytes = [Text.Encoding]::UTF8.GetBytes($message)
  $segment = [ArraySegment[byte]]::new($bytes)
  $socket.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
}

Send-CdpCommand 1 'Page.setDownloadBehavior' @{ behavior = 'allow'; downloadPath = $downloadPath }
Send-CdpCommand 2 'Page.navigate' @{ url = ([Uri]$generatorPath).AbsoluteUri }
Start-Sleep -Seconds 8
$socket.Dispose()

if (-not (Test-Path $videoPath)) {
  throw "Video was not generated: $videoPath"
}
Get-Item $videoPath | Select-Object FullName, Length
