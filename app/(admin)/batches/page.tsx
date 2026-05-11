"use client"

import { useState } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { BatchesTable } from "@/components/admin/batches-table"
import { BatchFormDialog } from "@/components/admin/batch-form-dialog"
import type { Batch } from "@/lib/types"

export default function BatchesPage({ batches }: { batches: Batch[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null)

  const handleAddBatch = () => {
    setEditingBatch(null)
    setIsDialogOpen(true)
  }

  const handleEditBatch = (batch: Batch) => {
    setEditingBatch(batch)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingBatch(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batch Management"
        description="Create and manage training batches, assign students"
        action={{ label: "Add Batch", onClick: handleAddBatch }}
      />
      <BatchesTable batches={batches} onEdit={handleEditBatch} />
      <BatchFormDialog open={isDialogOpen} onOpenChange={handleCloseDialog} batch={editingBatch} />
    </div>
  )
}
