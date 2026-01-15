"use client";
import AdminDashboard from "@/components/admin/Dashboard";
import LoginForm from "@/components/admin/LoginForm";
import { useState } from "react";

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);

  return <AdminDashboard onLogout={() => setAuthenticated(false)} />;
}

export default AdminPage;
