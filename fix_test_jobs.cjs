const fs = require('fs');
let c = fs.readFileSync('src/pages/Settings.tsx', 'utf8');

c = c.replace(
  /useAppStore\.setState\(state => \(\{ jobs: \[\.\.\.state\.jobs, \.\.\.mockJobs\] \}\)\);\s*alert\([^)]+\);/,
  "useAppStore.getState().addTestJobs(mockJobs);"
);

fs.writeFileSync('src/pages/Settings.tsx', c, 'utf8');
