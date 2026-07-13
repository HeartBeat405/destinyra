export default function Loading() {
  return (
    <main
      className="flex min-h-[60vh] items-center justify-center"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-line border-t-brand" />
    </main>
  );
}
