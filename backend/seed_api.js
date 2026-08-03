async function seed() {
  try {
    const response = await fetch('http://localhost:5000/api/achievements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        icon: 'Award',
        title: 'Best Accounting Automation Tool',
        subtitle: 'Finance Tech Awards • 2024',
        description: 'Awarded for developing an automated reconciliation system that saved 40+ hours per month for the finance team.',
        content: '<p>This award recognizes outstanding innovation in financial automation. We successfully streamlined the end-of-month reconciliation process.</p>',
        link: 'https://example.com/award',
        image: 'https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&q=80&w=1000'
      })
    });
    
    if (response.ok) {
      console.log('Successfully inserted mock achievement!');
    } else {
      console.error('Failed:', await response.text());
    }
  } catch (err) {
    console.error('Error:', err);
  }
}
seed();
