import prismadb from "@/lib/prismadb"
import SizeClient from "./components/client"
import type { SizeColumns } from "./components/columns"
import { format } from 'date-fns'

const SizesPage = async ({
  params
}: {
  params: { storeId: string}
}) => {
  const { storeId } = await params

  const [sizes, count] = await Promise.all([
    prismadb.size.findMany({
      where: {
        storeId,
      }, 
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prismadb.size.count({
      where: {
        storeId,
      },
    }),
  ]);

  const formattedSizes: SizeColumns[] = sizes.map(item => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient sizes={formattedSizes}/>
      </div>
    </div>
   )
}
 
export default SizesPage