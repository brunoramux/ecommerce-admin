import prismadb from "@/lib/prismadb"
import CategoryClient from "./components/client"
import type { CategoryColumns } from "./components/columns"
import { format } from 'date-fns'

const CategoriesPage = async ({
  params
}: {
  params: { storeId: string}
}) => {
  const { storeId } = await params

  const [categories, count] = await Promise.all([
    prismadb.category.findMany({
      where: {
        storeId,
      }, 
      include: {
        billboard: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prismadb.category.count({
      where: {
        storeId,
      },
    }),
  ]);

  const formattedCategories: CategoryColumns[] = categories.map(item => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient categories={formattedCategories}/>
      </div>
    </div>
   )
}
 
export default CategoriesPage