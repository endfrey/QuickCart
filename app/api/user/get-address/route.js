import connectDB from "@/config/db";
import Address from "@/model/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        // ตรวจสอบว่า userId มีค่าหรือไม่
        if (!userId) {
            return NextResponse.json({ success: false, message: "User not authenticated" });
        }

        await connectDB();

        // ค้นหาที่อยู่ทั้งหมดของผู้ใช้
        const addresses = await Address.find({ userId });

        return NextResponse.json({ success: true, addresses });

    } catch (error) {
        console.error(error); // สำหรับการดีบัก
        return NextResponse.json({ success: false, message: error.message });
    }
}
