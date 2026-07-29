import Link from "next/link";

export function TopBar() {
  return (
    <div className="h-14 border-b border-n-700/60 flex items-center px-5 sticky top-0 z-50 bg-n-800/90 backdrop-blur-sm">
      <Link href="/" className="flex items-center gap-2.5 font-display font-semibold text-sm">
        <span className="w-[22px] h-[22px] rounded-md bg-n-200 text-n-800 flex items-center justify-center font-mono text-xs font-bold">
          {"{ }"}
        </span>
        artt-map
      </Link>
    </div>
  );
}
