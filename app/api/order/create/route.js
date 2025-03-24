export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid data' });
        }

        // calculate amount using items
        const amounts = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.product);
            return product.offerPrice * item.quantity;
        }));

        const amount = amounts.reduce((acc, val) => acc + val, 0);

        // Send order to inngest
        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,
                amount: amount + Math.floor(amount * 0.02), // including 2% tax
                date: Date.now(),
            },
        });

        // Clear user cart
        const user = await User.findById(userId);
        user.cartItems = {};
        await user.save();

        return NextResponse.json({ success: true, message: 'Order Placed' });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
}
