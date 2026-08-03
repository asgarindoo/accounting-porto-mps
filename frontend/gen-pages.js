import fs from 'fs';
import path from 'path';

const pages = [
  'Dashboard',
  'ProfileAdmin',
  'ProjectsAdmin',
  'ExperiencesAdmin',
  'SkillsAdmin',
  'AchievementsAdmin',
  'EducationAdmin'
];

const dir = path.join('src', 'pages', 'admin');
fs.mkdirSync(dir, { recursive: true });

pages.forEach(page => {
  const code = `export function ${page}() {
  return (
    <div>
      <h2 className="admin-page-title">${page.replace('Admin', '')} Management</h2>
      <p>This is a placeholder page for ${page}. CRUD implementation will be added here in the next milestone.</p>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, `${page}.jsx`), code);
});

console.log('Admin placeholder pages generated.');
