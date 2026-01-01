<#
Helper script to add Vercel secrets from your local machine.
Run after installing/verifying Vercel CLI and logging in: `vercel login`.
This script does NOT store secrets in the repo; it pushes them securely to Vercel.
#>

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  Write-Host "Vercel CLI not found. Install with: npm i -g vercel" -ForegroundColor Yellow
  exit 1
}

Write-Host "Make sure you've run: vercel login" -ForegroundColor Cyan

$supabaseUrl = Read-Host "NEXT_PUBLIC_SUPABASE_URL (e.g. https://your-project.supabase.co)"
$anonKey = Read-Host "NEXT_PUBLIC_SUPABASE_ANON_KEY"
$serviceKey = Read-Host -AsSecureString "SUPABASE_SERVICE_ROLE_KEY (input hidden)"
$mapbox = Read-Host "NEXT_PUBLIC_MAPBOX_TOKEN"

# convert securestring to plain for CLI use (avoid printing it)
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($serviceKey)
$serviceKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)

function Add-Secret($name, $value) {
  Write-Host "Adding secret: $name" -ForegroundColor Green
  vercel secrets add $name $value
}

Add-Secret -name "supabase-url" -value $supabaseUrl
Add-Secret -name "supabase-anon" -value $anonKey
Add-Secret -name "supabase-service" -value $serviceKeyPlain
Add-Secret -name "mapbox-token" -value $mapbox

Write-Host "Done. In Vercel project settings, reference these secrets as @supabase-url, @supabase-anon, @supabase-service, @mapbox-token or add env vars manually." -ForegroundColor Cyan
