import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { username } = await request.json();

    // Find user by username
    const user = await User.findOne({ username }).select('-password -__v');
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        userId: user.userId,
        name: user.name,
        age: user.age,
        sex: user.sex,
        weight: user.weight,
        height: user.height,
        bmi: user.bmi,
        profilePhoto: user.profilePhoto,
        username: user.username,
      }
    });

  } catch (error) {
    console.error("Error in POST /api/userInfo:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}