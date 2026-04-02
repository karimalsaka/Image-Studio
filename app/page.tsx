import { redirect } from 'next/navigation';
import Dashboard from "./dashboard/page"
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-6">
        <h1 className ="text-grey font-bold px" >Welcome to our studio</h1>
        <Link href="/dashboard">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition">
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}