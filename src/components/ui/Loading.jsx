import Card from "@/components/atoms/Card";

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
      </div>

      {/* Content skeleton */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters sidebar skeleton */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="h-6 bg-slate-200 rounded w-20 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
                  <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main content skeleton */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            {/* Table header skeleton */}
            <div className="bg-slate-50 px-6 py-3 border-b">
              <div className="grid grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-4 bg-slate-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Table rows skeleton */}
            <div className="divide-y divide-slate-200">
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="px-6 py-4">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-3 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-8 bg-slate-200 rounded w-8 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Loading;