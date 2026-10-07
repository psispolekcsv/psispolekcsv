export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="h-8 w-40 animate-pulse rounded bg-mist" />
      <div className="mt-4 h-14 w-2/3 animate-pulse rounded bg-mist" />
      <div className="mt-8 grid gap-3 md:grid-cols-3">
        <div className="h-36 animate-pulse rounded-lg bg-mist" />
        <div className="h-36 animate-pulse rounded-lg bg-mist" />
        <div className="h-36 animate-pulse rounded-lg bg-mist" />
      </div>
    </div>
  );
}
