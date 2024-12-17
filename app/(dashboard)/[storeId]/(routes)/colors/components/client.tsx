'use client'

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns, type ColorColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface ColorClientProps {
  colors: ColorColumns[]
}

const ColorClient: React.FC<ColorClientProps> = ({
  colors
}) => {
  const router = useRouter()
  const params = useParams()
  const title = `Colors (${colors.length})`

  return ( 
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={title}
          description="Manage colors for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <PlusIcon className="w-4 h-4 mr-2"/>
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={colors} searchKey="name"/>
      <Heading  
        title="API"
        description="API calls for colors"
      /> 
      <Separator />
      <ApiList entityName="colors" entityIdName="colorId"/>
    </>
  );
}
 
export default ColorClient;