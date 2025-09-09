import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const user = await db.collection("users").findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ role: user?.role || "renter" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// import clientPromise from '@/lib/mongodb';
// import { NextResponse } from 'next/server';
// import { ObjectId } from 'mongodb';

export async function PATCH(req) {
    try {
        const { id, role } = await req.json();
        if (!id || !role) {
            return NextResponse.json(
                { error: 'Missing fields' },
                { status: 400 },
            );
        }

        const client = await clientPromise;
        const db = client.db('RentHub');
        const users = db.collection('users');

        await users.updateOne({ _id: new ObjectId(id) }, { $set: { role } });

        return NextResponse.json({ success: true, role });
    } catch (err) {
        console.error('Update role error:', err);
        return NextResponse.json(
            { error: 'Failed to update role' },
            { status: 500 },
        );
    }
}


// export async function DELETE(req) {
//     try {
//         const session = await getServerSession(authOptions);
//         if (!session || session.user?.role !== 'admin') {
//             return NextResponse.json(
//                 { error: 'Unauthorized' },
//                 { status: 401 },
//             );
//         }

//         const url = new URL(req.url);
//         const id = url.searchParams.get('id');
//         if (!id)
//             return NextResponse.json(
//                 { error: 'ID is required' },
//                 { status: 400 },
//             );

//         const { collection } = await dbConnect('users');
//         const result = await collection.deleteOne({ _id: new ObjectId(id) });

//         if (result.deletedCount === 0)
//             return NextResponse.json(
//                 { error: 'User not found' },
//                 { status: 404 },
//             );

//         return NextResponse.json({ message: 'User deleted successfully' });
//     } catch (err) {
//         console.error(err);
//         return NextResponse.json(
//             { error: 'Something went wrong' },
//             { status: 500 },
//         );
//     }
// }
