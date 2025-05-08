import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { username, password } = await request.json();

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: "User not found. Please register first.",
          shouldRegister: true
        },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Invalid password. Please try again." 
        },
        { status: 401 }
      );
    }

    // Update verification status
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { isVerified: true },
      { new: true }
    ).select('-password -__v');
    
    // Return additional user data that should be stored
    return NextResponse.json({
      success: true,
      message: "Verification successful",
      data: {
        username: updatedUser.username,
        isVerified: updatedUser.isVerified,
        userId: updatedUser._id,
      }
    });

  } catch (error) {
    console.error("Error in POST /api/verify:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}