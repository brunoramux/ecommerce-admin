'use client'

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns, type SizeColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface SizeClientProps {
  sizes: SizeColumns[]
}

const SizeClient: React.FC<SizeClientProps> = ({
  sizes
}) => {
  const router = useRouter()
  const params = useParams()
  const title = `Sizes (${sizes.length})`

  return ( 
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={title}
          description="Manage sizes for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <PlusIcon className="w-4 h-4 mr-2"/>
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={sizes} searchKey="name"/>
      <Heading  
        title="API"
        description="API calls for sizes"
      /> 
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId"/>
    </>
  );
}
 
export default SizeClient;