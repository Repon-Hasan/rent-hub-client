export default function OwnerDetails({ owner }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-2">{owner.name}</h1>
      <p className="text-gray-600">{owner.email}</p>
    </div>
  );
}
