import connectDB from "@/config/db";
import User from "@/model/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get user ID from Clerk authentication
    const { userId } = getAuth(request);

    // Check if userId is valid
    if (!userId) {
      return NextResponse.json({ success: false, message: "No user ID found" });
    }

    // Connect to the database
    await connectDB();

    // Retrieve user data from the database using userId
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return NextResponse.json({ success: false, message: "User Not Found" });
    }

    // Return user data if found
    return NextResponse.json({ success: true, user });

  } catch (error) {
    // Return error message if connection or query fails
    console.error(error); // For debugging purposes
    return NextResponse.json({ success: false, message: error.message });
  }
}
