export default async function handler(req, res) {
  const { id } = req.body;
const firebaseUrl = `${process.env.FIREBASE_PROJECT_ID}/products/${encodeURIComponent(id)}.json`;
  console.log("Delete product URL: " + firebaseUrl);

  if (!id) {
    return res.status(400).json({ error: 'Missing product ID' });
  }

  try {
    const response = await fetch(firebaseUrl, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    res.status(200).json({ success: true });

  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}
