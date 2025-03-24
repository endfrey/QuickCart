import connectDB from "@/config/db";
import Address from "@/model/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        // ตรวจสอบว่า userId มีค่าหรือไม่
        if (!userId) {
            return NextResponse.json({ success: false, message: "User not authenticated" });
        }

        // ดึงข้อมูล address จาก request body
        const { address } = await request.json();

        // ตรวจสอบว่า address มีข้อมูลหรือไม่
        if (!address || Object.keys(address).length === 0) {
            return NextResponse.json({ success: false, message: "Invalid address data" });
        }

        // เชื่อมต่อฐานข้อมูล
        await connectDB();

        // สร้างที่อยู่ใหม่ในฐานข้อมูล
        const newAddress = await Address.create({ ...address, userId });

        // ส่งการตอบกลับเมื่อสำเร็จ
        return NextResponse.json({ success: true, message: 'Address Added Successfully', newAddress });

    } catch (error) {
        // จัดการข้อผิดพลาดและส่งข้อความกลับ
        console.error(error); // สำหรับการดีบัก
        return NextResponse.json({ success: false, message: error.message });
    }
}
