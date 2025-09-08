import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { firstName, lastName, email, phone, gender, password, imageUrl } = await req.json();

    const client = await clientPromise;
    const db = client.db("RentHub");
    const users = db.collection("users");

    // Check for both email and phone in a single query
    const existingUser = await users.findOne({
      $or: [{ email: email }, { phone: phone }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ message: "Email already exists" }, { status: 400 });
      }
      if (existingUser.phone === phone) {
        return NextResponse.json({ message: "Phone number already exists" }, { status: 400 });
      }
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    await users.insertOne({
      firstName,
      lastName,
      email,
      phone,
      gender,
      image: imageUrl || null,
      password: hashedPassword,
      role: "renter",
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 } // Use 201 for "created"
    );
    
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Error registering user" },
      { status: 500 }
    );
  }
}