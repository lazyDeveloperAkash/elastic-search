export default function ProductSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
        >
          <div className="w-full h-48 bg-gray-200"></div>

          <div className="p-4 flex flex-col justify-between h-full">
            <div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>

              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>

              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>

              <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
