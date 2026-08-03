import dotenv from 'dotenv';
import pg from 'pg';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/portfolio' });

async function seed() {
  try {
    await pool.query(`
      INSERT INTO achievements (id, icon, title, subtitle, description, content, link, image, sort_order) 
      VALUES (
        gen_random_uuid(), 
        'Award', 
        'Best Accounting Automation Tool', 
        'Finance Tech Awards • 2024', 
        'Awarded for developing an automated reconciliation system that saved 40+ hours per month for the finance team.', 
        '<p>This award recognizes outstanding innovation in financial automation. We successfully streamlined the end-of-month reconciliation process.</p>', 
        'https://example.com/award', 
        'https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&q=80&w=1000', 
        1
      )
    `);
    console.log('Successfully inserted mock achievement!');
  } catch (err) {
    console.error('Error inserting:', err);
  } finally {
    process.exit();
  }
}
seed();
