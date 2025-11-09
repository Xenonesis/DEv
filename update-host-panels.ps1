# PowerShell script to update all host panels with consistent UI/UX

Write-Host "Starting host panel UI/UX updates..." -ForegroundColor Green

# Array of panel configurations
$panels = @(
    @{
        Name = "Tutorials"
        Path = "src/app/host/tutorials/page.tsx"
        Icon = "Film"
        Color = "purple-600"
        Entity = "Tutorial"
        EntityPlural = "Tutorials"
        Fields = @("title", "description", "imageUrl", "videoUrl", "tags", "difficulty")
    },
    @{
        Name = "Resources"
        Path = "src/app/host/resources/page.tsx"
        Icon = "Link"
        Color = "blue-600"
        Entity = "Resource"
        EntityPlural = "Resources"
        Fields = @("title", "description", "url", "type", "tags")
    },
    @{
        Name = "Mentorship"
        Path = "src/app/host/mentorship/page.tsx"
        Icon = "UserCheck"
        Color = "indigo-600"
        Entity = "Mentorship"
        EntityPlural = "Mentorship"
        Fields = @("title", "description", "expertise", "availability", "status")
    },
    @{
        Name = "Web Contests"
        Path = "src/app/host/web-contests/page.tsx"
        Icon = "Code"
        Color = "cyan-600"
        Entity = "Contest"
        EntityPlural = "Contests"
        Fields = @("title", "description", "theme", "prize", "maxParticipants", "startDate", "endDate", "difficulty", "tags")
    },
    @{
        Name = "Mobile Innovation"
        Path = "src/app/host/mobile-innovation/page.tsx"
        Icon = "Smartphone"
        Color = "pink-600"
        Entity = "Innovation"
        EntityPlural = "Innovations"
        Fields = @("title", "description", "category", "prize", "startDate", "endDate", "difficulty", "tags")
    },
    @{
        Name = "Events"
        Path = "src/app/host/events/page.tsx"
        Icon = "Calendar"
        Color = "orange-600"
        Entity = "Event"
        EntityPlural = "Events"
        Fields = @("title", "description", "venue", "date", "maxAttendees", "tags")
    },
    @{
        Name = "Conferences"
        Path = "src/app/host/conferences/page.tsx"
        Icon = "Users"
        Color = "teal-600"
        Entity = "Conference"
        EntityPlural = "Conferences"
        Fields = @("title", "description", "venue", "startDate", "endDate", "maxAttendees", "tags")
    }
)

Write-Host "Will update $($panels.Count) panels" -ForegroundColor Yellow

# Note: This script identifies the panels that need updating
# The actual TypeScript code updates will be done by the agent

foreach ($panel in $panels) {
    Write-Host "`nPanel: $($panel.Name)" -ForegroundColor Cyan
    Write-Host "  Path: $($panel.Path)"
    Write-Host "  Icon: $($panel.Icon)"
    Write-Host "  Entity: $($panel.Entity)"
}

Write-Host "`nReady for TypeScript code updates by agent..." -ForegroundColor Green
