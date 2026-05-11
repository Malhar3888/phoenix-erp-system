import { getAllBatches } from "@/lib/queries"
import BatchesPageWrapper from "./page-wrapper"

export const dynamic = "force-dynamic"

export default async function BatchesLayout() {
  const batches = await getAllBatches()

  return <BatchesPageWrapper batches={batches} />
}
