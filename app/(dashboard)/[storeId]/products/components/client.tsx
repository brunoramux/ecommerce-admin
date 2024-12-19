'use client'

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns, type ProductColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";

interface ProductClientProps {
  products: ProductColumns[]
}

const ProductClient: React.FC<ProductClientProps> = ({
  products
}) => {
  const router = useRouter()
  const params = useParams()
  const title = `Products (${products.length})`

  return ( 
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={title}
          description="Manage products for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <PlusIcon className="w-4 h-4 mr-2"/>
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={products} searchKey="label"/>
      <Heading 
        title="API"
        description="API calls for products"
      /> 
      <Separator />
      <ApiList entityName="products" entityIdName="productId"/>
    </>
  );
}
 
export default ProductClient;