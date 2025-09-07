import Link from 'next/link';

export default function NotFound() {
    return (
        <div className='h-screen flex flex-col justify-center items-center'>
            <h2 className='text-4xl font-extrabold text-red-400'>404</h2>
            <p className='text-red-600'>Could not find requested resource</p>
            <Link className='underline' href="/">Return Home</Link>
        </div>
    );
}
