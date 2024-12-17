import prismadb from "@/lib/prismadb"
import ColorClient from "./components/client"
import type { ColorColumns } from "./components/columns"
import { format } from 'date-fns'

const ColorsPage = async ({
  params
}: {
  params: { storeId: string}
}) => {
  const { storeId } = await params

  const [colors, count] = await Promise.all([
    prismadb.color.findMany({
      where: {
        storeId,
      }, 
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prismadb.color.count({
      where: {
        storeId,
      },
    }),
  ]);

  const formattedColors: ColorColumns[] = colors.map(item => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient colors={formattedColors}/>
      </div>
    </div>
   )
}
 
export default ColorsPage