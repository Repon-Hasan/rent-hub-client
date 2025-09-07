import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { firstName, lastName, email, phone, gender, password, imageUrl } =
      await req.json();

    const client = await clientPromise;
    const db = client.db("RentHub");
    const users = db.collection("users");

    // check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // check if phone number 
    const existingPhone = await users.findOne({ phone });
    if (existingPhone) {
      return NextResponse.json(
        { message: "Phone number already exists" },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    await users.insertOne({
      firstName,
      lastName,
      email,
      phone,
      gender,
      image: imageUrl || null, // either URL or null
      password: hashedPassword,
      role: "renter", // always renter
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 200 } 
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Error registering user" },
      { status: 500 }
    );
  }
}
