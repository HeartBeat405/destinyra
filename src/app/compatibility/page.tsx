import { redirect } from "next/navigation";

// Moved under /tools. Keep old links working.
export default function CompatibilityRedirect() {
  redirect("/tools/compatibility");
}
