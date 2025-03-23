import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Address from "@/model/Address";
import Order from "@/model/Order";
import { getAuth } from "@clerk/nextjs/server";



export async function GET(request) {
    try {
        const { userId } = getAuth(request)

        const isSeller = await authSellerz(userId)
        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not Authoraized ' })
        }

        await connectDB()
        Address.length
        const orders = await Order.find({}).populate('address items.product')
        return NextResponse.json({ success: true, orders })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}