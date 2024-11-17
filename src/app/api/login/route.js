import { connectDb } from "@/database/db";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

connectDb();

export async function POST(req) {
  try {
    const reqBody = await req.json();
    const { userName, Pwd } = reqBody;

    // Check if user exists
    const user = await User.findOne({ userName });
    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }

    // Validate password (plain text comparison)
    const validPassword = Pwd === user.Pwd;
    if (!validPassword) {
      return NextResponse.json({ error: "Incorrect Password" });
    }

    // Create token data
    const tokenData = {
      id: user._id,
      userName: user.userName,
    };

    // Generate JWT token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Set cookies and return response
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      userName: user.userName,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
    });

    response.cookies.set("userName", user.userName, {
      httpOnly: true,
    });

    return response;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
