import prismadb from "@/lib/prismadb"
import OrderClient from "./components/client"
import type { OrderColumns } from "./components/columns"
import { format } from 'date-fns'
import { formatter } from "@/lib/utils"

const OrdersPage = async ({
  params
}: {
  params: { storeId: string}
}) => {
  const { storeId } = await params

  const [orders, count] = await Promise.all([
    prismadb.order.findMany({
      where: {
        storeId,
      }, 
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prismadb.order.count({
      where: {
        storeId,
      },
    }),
  ]);


  const formattedOrders: OrderColumns[] = orders.map(order => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    products: order.orderItems.map(item => item.product.name).join(', '),
    totalPrice: formatter.format(order.orderItems.reduce((total, item) => {
      return total + Number(item.product.price)
    }, 0)),
    isPaid: order.isPaid,
    createdAt: format(order.createdAt, 'MMMM do, yyyy')
  }))


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient orders={formattedOrders}/>
      </div>
    </div>
   )
}
 
export default OrdersPage