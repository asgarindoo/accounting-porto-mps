async function seed() {
  try {
    const response = await fetch('http://localhost:5000/api/achievements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        icon: 'Award',
        title: 'Certified Public Accountant (CPA)',
        subtitle: 'Indonesian Institute of Accountants • 2023',
        description: 'Successfully passed the CPA examination, demonstrating expertise in advanced financial accounting, auditing, and taxation.',
        content: '<p>The CPA certification is the highest standard of competence in the field of accounting. Achieving this milestone has enabled me to provide professional assurance services.</p>',
        link: 'https://example.com/cpa',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000'
      })
    });
    
    if (response.ok) {
      console.log('Successfully inserted mock achievement 2!');
    } else {
      console.error('Failed:', await response.text());
    }
  } catch (err) {
    console.error('Error:', err);
  }
}
seed();
