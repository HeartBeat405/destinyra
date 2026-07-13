import { redirect } from "next/navigation";

// Login moved under the admin area. Keep the old path working.
export default function LoginRedirect() {
  redirect("/admin/login");
}
