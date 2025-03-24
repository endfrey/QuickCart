import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Address from "@/model/Address";
import Order from "@/model/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized: No user ID" }, { status: 401 });
        }

        // ตรวจสอบว่าเป็นผู้ขายหรือไม่
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not Authorized" }, { status: 403 });
        }

        await connectDB();

        // นับจำนวนที่อยู่
        const addressCount = await Address.countDocuments();

        // ค้นหาคำสั่งซื้อทั้งหมดและ populate ข้อมูลที่เกี่ยวข้อง
        const orders = await Order.find({})
            .populate("address")
            .populate("items.product");

        return NextResponse.json({ success: true, addressCount, orders }, { status: 200 });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
