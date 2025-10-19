const fs = require('fs');
const path = require('path');

// Files that need auth import fixes
const filesToFix = [
  'src/app/api/tutorials/[id]/start/route.ts',
  'src/app/api/tutorials/route.ts',
  'src/app/api/resources/route.ts',
  'src/app/api/mentorship/route.ts',
  'src/app/api/mentorship/[id]/route.ts',
  'src/app/api/host/resources/[id]/route.ts',
  'src/app/api/host/resources/route.ts',
  'src/app/api/host/tutorials/route.ts',
  'src/app/api/host/tutorials/[id]/route.ts',
  'src/app/api/host/mentorship-stats/route.ts',
  'src/app/api/host/mentorship/route.ts',
  'src/app/api/host/mentorship/[id]/route.ts',
  'src/app/api/host/courses/route.ts',
  'src/app/api/events/[id]/register/route.ts',
  'src/app/api/conferences/[id]/register/route.ts',
  'src/app/api/community/teams/route.ts',
  'src/app/api/community/success-stories/route.ts',
  'src/app/api/community/teams/[id]/join/route.ts',
  'src/app/api/community/forums/route.ts',
  'src/app/api/community/forums/[id]/route.ts',
  'src/app/api/community/forums/[id]/replies/route.ts'
];

const oldImport = "import { authOptions } from '@/lib/auth';";
const newImport = "import { authOptions } from '@/app/api/auth/[...nextauth]/route';";

console.log('🔧 Fixing auth imports...\n');

filesToFix.forEach(filePath => {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (content.includes(oldImport)) {
        const updatedContent = content.replace(oldImport, newImport);
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ Fixed: ${filePath}`);
      } else {
        console.log(`⚠️  Skipped: ${filePath} (import not found)`);
      }
    } else {
      console.log(`❌ Not found: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}: ${error.message}`);
  }
});

console.log('\n🎉 Auth import fixes completed!');