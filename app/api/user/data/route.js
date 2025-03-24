import connectDB from "@/config/db";
import User from "@/model/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    // Check if userId is not null or undefined
    if (!userId) {
      return NextResponse.json({ success: false, message: "No user ID found" });
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, message: "User Not Found" });
    }

    return NextResponse.json({ success: true, user });

  } catch (error) {
    // Return error message if connection or query fails
    return NextResponse.json({ success: false, message: error.message });
  }
}
