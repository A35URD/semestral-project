export default async function handler(req, res) {
  const { id } = req.query;
  const firebaseUrl = `${process.env.FIREBASE_PROJECT_ID}/products/${id}.json`;

  try {
    if (req.method === 'PUT') {
      const { name, price } = req.body;

      if (!name || typeof price !== 'number') {
        return res.status(400).json({ error: 'Invalid data' });
      }

      const response = await fetch(firebaseUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price })
      });

      if (!response.ok) throw new Error('Failed to update product');
      const result = await response.json();
      return res.status(200).json({ success: true, product: result });
    }

    if (req.method === 'DELETE') {
      const response = await fetch(firebaseUrl, { method: 'DELETE' });

      if (!response.ok) throw new Error('Failed to delete product');
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('Product update/delete error:', err);
    res.status(500).json({ error: 'Product operation failed' });
  }
}
