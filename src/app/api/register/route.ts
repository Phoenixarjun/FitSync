import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse incoming data
    const data = await request.json();
    console.log('Incoming data:', data);

    // Validate required fields
    const requiredFields = ['name', 'email', 'age', 'sex', 'weight', 'height', 'bmi', 'username', 'password', 'confirmPassword'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check password match
    if (data.password !== data.confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Check if username exists
    const existingUsername = await User.findOne({ username: data.username });
    if (existingUsername) {
      return NextResponse.json(
        { success: false, message: 'Username already exists' },
        { status: 409 }
      );
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email: data.email });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Create new user
    const newUser = new User({
      userId: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      age: Number(data.age),
      sex: data.sex,
      weight: Number(data.weight),
      height: Number(data.height),
      bmi: Number(data.bmi),
      profilePhoto: data.profilePhoto || '',
      username: data.username,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({
      success: true, 
      message: 'Registration successful',
      user: {
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        age: newUser.age,
        sex: newUser.sex,
        weight: newUser.weight,
        height: newUser.height,
        bmi: newUser.bmi,
        profilePhoto: newUser.profilePhoto,
        username: newUser.username,
        isVerified: newUser.isVerified
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}