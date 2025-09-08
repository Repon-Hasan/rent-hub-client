// import dbConnect from "@/lib/dbConnect";
// import { ObjectId } from "mongodb";
// export async function GET(req, context) {
//   const params = await context.params;
//   const { id } = params;
//   try {
//   const collection = await dbConnect("rentPosts"); // Use the correct collection name for rent posts
//     const post = await collection.findOne({ _id: new ObjectId(id) });
//     if (!post) return new Response("Not found", { status: 404 });
//     return new Response(JSON.stringify(post), { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }
// }

// export async function PUT(req, context) {
//   const params = await context.params;
//   const { id } = params;
//   const data = await req.json();
//   try {
//     const collection = await dbConnect("rentPosts"); // Use the correct collection name for rent posts
//     const result = await collection.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: data }
//     );
//     if (result.matchedCount === 0) {
//       return new Response("Not found", { status: 404 });
//     }
//     return new Response("Updated successfully", { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }
// }

// export async function DELETE(req, context) {
//   const params = await context.params;
//   const { id } = params;
//   try {
//     const collection = await dbConnect("rentPosts"); // Use the correct collection name for rent posts
//     const result = await collection.deleteOne({ _id: new ObjectId(id) });
//     if (result.deletedCount === 0) {
//       return new Response("Not found", { status: 404 });
//     }
//     return new Response("Deleted successfully", { status: 200 });
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), { status: 500 });
//   }
// }

import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';

export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'admin') {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
            });
        }

        const { id } = params;
        const collection = await dbConnect('rentPosts');
        const post = await collection.findOne({ _id: new ObjectId(id) });

        if (!post) {
            return new Response(JSON.stringify({ error: 'Rental not found' }), {
                status: 404,
            });
        }

        return new Response(
            JSON.stringify({ ...post, _id: post._id.toString() }),
            { status: 200 },
        );
    } catch (error) {
        console.error('Error fetching rental:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to fetch rental' }),
            { status: 500 },
        );
    }
}

export async function PATCH(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'admin') {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
            });
        }

        const { id } = params;
        const { action } = await req.json();

        if (!['approve', 'reject'].includes(action)) {
            return new Response(JSON.stringify({ error: 'Invalid action' }), {
                status: 400,
            });
        }

        const collection = await dbConnect('rentPosts');
        const update =
            action === 'approve'
                ? { status: 'approved' }
                : { status: 'rejected' };
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: update },
        );

        if (result.modifiedCount === 0) {
            return new Response(
                JSON.stringify({
                    error: 'Rental not found or no changes made',
                }),
                { status: 404 },
            );
        }

        return new Response(JSON.stringify({ message: `Rental ${action}ed` }), {
            status: 200,
        });
    } catch (error) {
        console.error(`Error ${action || 'updating'} rental:`, error);
        return new Response(
            JSON.stringify({ error: `Failed to ${action || 'update'} rental` }),
            { status: 500 },
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'admin') {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
            });
        }

        const { id } = params;
        const collection = await dbConnect('rentPosts');
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return new Response(JSON.stringify({ error: 'Rental not found' }), {
                status: 404,
            });
        }

        return new Response(JSON.stringify({ message: 'Rental deleted' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error deleting rental:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to delete rental' }),
            { status: 500 },
        );
    }
}
