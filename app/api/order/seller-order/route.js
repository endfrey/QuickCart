import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";  // ตรวจสอบให้แน่ใจว่าใช้ authSeller ที่ถูกต้อง
import Address from "@/model/Address";
import Order from "@/model/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        // ตรวจสอบว่าเป็นผู้ขายหรือไม่
        const isSeller = await authSeller(userId); // แก้ไขเป็น authSeller
        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not Authorized' });
        }

        await connectDB();

        // หากต้องการนับจำนวน Address, ใช้ countDocuments()
        const addressCount = await Address.countDocuments();
        console.log(`Address Count: ${addressCount}`);

        // ค้นหาคำสั่งซื้อทั้งหมด
        const orders = await Order.find({}).populate('address').populate('items.product');

        return NextResponse.json({ success: true, orders });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
