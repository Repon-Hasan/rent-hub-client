import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const user = await db.collection("users").findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ role: user.role || "renter" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const { email, role } = await request.json();
        if (!email || !role) {
            return NextResponse.json(
                { error: 'Email and role are required' },
                { status: 400 },
            );
        }
        if (!['renter', 'admin'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 },
            );
        }

        const collection = await dbConnect('users');
        const result = await collection.updateOne(
            { email },
            { $set: { role } },
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 },
            );
        }

        return NextResponse.json({ message: 'Role updated successfully' });
    } catch (err) {
        console.error('Error updating user role:', err);
        return NextResponse.json(
            { error: 'Something went wrong' },
            { status: 500 },
        );
    }
}