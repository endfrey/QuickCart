export const createUserOrder = inngest.createFunction(
    {
      id: 'create-user-order',
      batchEvents: {
        maxSize: 5,
        timeout: '5s'
      }
    },
    { event: 'order/created' },
    async ({ events }) => {
      try {
        const orders = events
          .filter(event => event.data?.userId && event.data?.items?.length > 0) // ตรวจสอบว่ามีข้อมูลจริง
          .map(event => ({
            userId: event.data.userId,
            items: event.data.items,
            amount: event.data.amount,
            address: event.data.address,
            date: event.data.date
          }));
  
        if (orders.length === 0) {
          return { success: false, message: 'No valid orders to process' };
        }
  
        await connectDB();
        await Order.insertMany(orders);
  
        return { success: true, processed: orders.length };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }
  );
  