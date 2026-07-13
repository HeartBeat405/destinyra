import { redirect } from "next/navigation";

// The calculator now lives under /tools. Keep old links working.
export default function AnalyzeRedirect() {
  redirect("/tools/life-path");
}
