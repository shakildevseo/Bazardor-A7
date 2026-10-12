export default function CategoryLoading() {
  return (
    <main className="min-h-screen bg-[#edf3ee] px-3 py-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="h-28 animate-pulse rounded-2xl border border-[#dfe7e0] bg-[#f8faf8]" />
        <div className="mt-5 h-14 animate-pulse rounded-xl border border-[#dfe7e0] bg-[#f8faf8]" />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-[#dfe7e0] bg-[#f8faf8]"
            />
          ))}
        </div>
      </div>
    </main>
  );
}