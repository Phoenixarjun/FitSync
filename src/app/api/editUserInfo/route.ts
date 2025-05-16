import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

// Handle POST request to update user basic info
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const { username, name, age, sex, weight, height, bmi } = data;

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { username },
      {
        $set: { name, age, sex, weight, height, bmi }
      },
      { new: true }
    ).select("-password -__v");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error("Error in POST /api/editUserInfo:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle PUT request to update only profile photo
export async function PUT(request: Request) {
  try {
    await connectDB();
    const { username, profilePhoto } = await request.json();

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { $set: { profilePhoto } },
      { new: true }
    ).select("-password -__v");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error("Error in PUT /api/editUserInfo:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
