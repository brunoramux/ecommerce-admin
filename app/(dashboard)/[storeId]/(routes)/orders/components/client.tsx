'use client'

import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { columns, type OrderColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface OrderClientProps {
  orders: OrderColumns[]
}

const OrderClient: React.FC<OrderClientProps> = ({
  orders
}) => {
  const title = `Orders (${orders.length})`

  return ( 
    <>
      <div className="flex items-center justify-between">
        <Heading 
          title={title}
          description="Manage orders for your store"
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={orders} searchKey="products"/>
    </>
  );
}
 
export default OrderClient;