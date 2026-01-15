"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { Eatery } from "@/lib/models/eatery";
import EateryForm from "./EateryForm";
import EateryList from "./EateryList";

interface DashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: DashboardProps) {
  const [eateries, setEateries] = useState<Eatery[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEatery, setEditingEatery] = useState<Eatery | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch eateries
  useEffect(() => {
    fetchEateries();
  }, []);

  const fetchEateries = async () => {
    try {
      const response = await fetch("/api/eateries");
      const data = await response.json();
      setEateries(data);
    } catch (error) {
      console.error("Failed to fetch eateries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this eatery?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`/api/eateries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEateries();
    } catch (error) {
      console.error("Failed to delete eatery:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage OAU campus eateries
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Add Eatery Button */}
        <div className="mb-8">
          <Button
            onClick={() => {
              setEditingEatery(null);
              setShowForm(!showForm);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {showForm ? "✕ Cancel" : "+ Add New Eatery"}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8 border border-border bg-card p-6">
            <EateryForm
              eatery={editingEatery}
              onSuccess={() => {
                setShowForm(false);
                setEditingEatery(null);
                fetchEateries();
              }}
            />
          </Card>
        )}

        {/* Eatery List */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading eateries...
          </div>
        ) : (
          <EateryList
            eateries={eateries}
            onEdit={(eatery) => {
              setEditingEatery(eatery);
              setShowForm(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
