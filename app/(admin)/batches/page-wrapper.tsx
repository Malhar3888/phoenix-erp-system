"use client"

import BatchesPage from "./page"
import type { Batch } from "@/lib/types"

export default function BatchesPageWrapper({ batches }: { batches: Batch[] }) {
  return <BatchesPage batches={batches} />
}
