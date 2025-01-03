'use client'

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns, type BillboardColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface BillboardClientProps {
  billboards: BillboardColumns[]
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
      <DataTable columns={columns} data={billboards} searchKey="label"/>
      <Heading 
        title="API"
        description="API calls for billboards"
      /> 
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId"/>
    </>
  );
}
 
export default BillboardClient;