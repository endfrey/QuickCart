import connectDB from "@/config/db";
import Address from "@/model/Address";
import Order from "@/model/Order";
import Product from "@/model/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        await connectDB();

        // นับจำนวนเอกสารใน Address และ Product
        const addressCount = await Address.countDocuments();
        const productCount = await Product.countDocuments();

        console.log(`Address Count: ${addressCount}`);
        console.log(`Product Count: ${productCount}`);

        // ค้นหาคำสั่งซื้อที่เชื่อมโยงกับ userId
        const orders = await Order.find({ userId }).populate('address').populate('items.product');

        return NextResponse.json({ success: true, orders });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
