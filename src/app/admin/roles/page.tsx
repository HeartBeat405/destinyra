import Placeholder from "../../../components/admin/Placeholder";
export const metadata = { title: "Roles — Admin" };
export default function Page() {
  return (
    <Placeholder
      title="Roles & Permissions"
      iconName="ShieldCheck"
      description="Granular RBAC — the permission matrix already lives in lib/auth/rbac.ts."
    />
  );
}
