export default async function handler(req, res) {
  try {
    const firebaseUrl = process.env.FIREBASE_PROJECT_ID+'/products.json';

    const response = await fetch(firebaseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch products from Firebase');
    }

    const data = await response.json();

    if (!data) return res.status(200).json([]);
    const result = Object.entries(data).map(([key, value]) => ({
      id: key,
      ...value
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ error: 'Failed to load products' });
  }
}

