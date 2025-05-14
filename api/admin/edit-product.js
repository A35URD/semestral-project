export default async function handler(req, res) {
    const { id, name, price } = req.body;
    const firebaseUrl = `${process.env.FIREBASE_PROJECT_ID}/products/${encodeURIComponent(id)}.json`;
    console.log("Edit product URL: " + firebaseUrl);

    if (!id || !name || typeof price !== 'number') {
        return res.status(400).json({ error: 'Missing or invalid data' });
    }

    try {
        const response = await fetch(firebaseUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price })
        });

        if (!response.ok) {
        throw new Error('Failed to update product');
        }

        const result = await response.json();
        res.status(200).json({ success: true, product: result });

    } catch (err) {
        console.error('Edit product error:', err);
        res.status(500).json({ error: 'Failed to edit product' });
    }
}
