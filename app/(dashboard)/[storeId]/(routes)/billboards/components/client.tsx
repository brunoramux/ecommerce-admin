'use client'

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Billboard } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface BillboardClientProps {
  billboards: Billboard[]
}

const BillboardClient: React.FC<BillboardClientProps> = ({
  billboards
}) => {
  const router = useRouter()
  const params = useParams()
  const title = `Billboards (${billboards.length})`

  return ( 
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={title}
          description="Manage billboards for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <PlusIcon className="w-4 h-4 mr-2"/>
          Add new
        </Button>
      </div>
      <Separator />
    </>
  );
}
 
export default BillboardClient;