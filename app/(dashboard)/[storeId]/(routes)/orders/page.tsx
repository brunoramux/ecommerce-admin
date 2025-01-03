import prismadb from "@/lib/prismadb"
import BillboardClient from "./components/client"
import type { BillboardColumns } from "./components/columns"
import { format } from 'date-fns'

const BillboardsPage = async ({
  params
}: {
  params: { storeId: string}
}) => {
  const { storeId } = await params

  const [billboards, count] = await Promise.all([
    prismadb.billboard.findMany({
      where: {
        storeId,
      }, 
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prismadb.billboard.count({
      where: {
        storeId,
      },
    }),
  ]);

  const formattedBillboards: BillboardColumns[] = billboards.map(item => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient billboards={formattedBillboards}/>
      </div>
    </div>
   )
}
 
export default BillboardsPage