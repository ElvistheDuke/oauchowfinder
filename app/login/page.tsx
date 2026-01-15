"use client";
import LoginForm from "@/components/admin/LoginForm";
import { useState } from "react";

function AdminPage() {
  const handleAuthSuccess = () => {
    window.location.href = "/admin";
  };

  return <LoginForm onSuccess={handleAuthSuccess} />;
}

export default AdminPage;
