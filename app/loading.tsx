// client/app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center pt-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-elba-primary mx-auto mb-4"></div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );
}