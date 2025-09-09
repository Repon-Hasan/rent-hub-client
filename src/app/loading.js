export default function Loading() {
  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100 bg-opacity-90 text-base-content">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 mb-6 border-t-4 border-b-4 border-blue-600 rounded-full animate-spin"></div>
  <span className="text-xl font-semibold tracking-wide text-base-content">Loading...</span>
      </div>
    </div>
  );
}
