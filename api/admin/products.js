export default async function handler(req, res) {
  try {
    const firebaseUrl = process.env.FIREBASE_PROJECT_ID+'/products.json';

    const response = await fetch(firebaseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch products from Firebase');
    }

    const data = await response.json();

    const result = data
      ? Object.entries(data).map(([name, price]) => ({ name, ...price }))
      : [];

    res.status(200).json(result);
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ error: 'Failed to load products' });
  }
}