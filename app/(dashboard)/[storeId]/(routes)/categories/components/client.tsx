'use client'

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns, type CategoryColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface CategoryClientProps {
  categories: CategoryColumns[]
}

const CategoryClient: React.FC<CategoryClientProps> = ({
  categories
}) => {
  const router = useRouter()
  const params = useParams()
  const title = `Categories (${categories.length})`

  return ( 
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={title}
          description="Manage categories for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
          <PlusIcon className="w-4 h-4 mr-2"/>
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={categories} searchKey="name"/>
      <Heading 
        title="API"
        description="API calls for Categories"
      /> 
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId"/>
    </>
  );
}
 
export default CategoryClient;