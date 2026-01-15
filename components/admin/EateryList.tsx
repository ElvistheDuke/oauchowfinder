"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Eatery } from "@/lib/models/eatery";

interface EateryListProps {
  eateries: Eatery[];
  onEdit: (eatery: Eatery) => void;
  onDelete: (id: string) => void;
}

export default function EateryList({
  eateries,
  onEdit,
  onDelete,
}: EateryListProps) {
  if (eateries.length === 0) {
    return (
      <Card className="border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          No eateries added yet. Create one to get started!
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {eateries.map((eatery) => (
        <Card key={eatery._id} className="border border-border bg-card p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">
                {eatery.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {eatery.category}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Avg Price: </span>
                  <span className="font-medium text-foreground">
                    ₦{eatery.avg_price}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Hours: </span>
                  <span className="font-medium text-foreground">
                    {eatery.opening_hours.open} - {eatery.opening_hours.close}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Menu Items: </span>
                  <span className="font-medium text-foreground">
                    {eatery.menu?.length || 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Location: </span>
                  <span className="font-medium text-foreground">
                    {eatery.coords[0].toFixed(4)}, {eatery.coords[1].toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                onClick={() => onEdit(eatery)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() =>
                  typeof eatery._id === "string" ? onDelete(eatery._id) : ""
                }
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
