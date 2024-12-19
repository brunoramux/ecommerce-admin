import prismadb from "@/lib/prismadb"
import ProductClient from "./components/client"
import type { ProductColumns } from "./components/columns"
import { format } from 'date-fns'
import { formatter } from "@/lib/utils"

const ProductsPage = async ({
  params
}: {
  params: { storeId: string}
}) => {
  const { storeId } = await params

  const [products, count] = await Promise.all([
    prismadb.product.findMany({
      where: {
        storeId,
      }, 
      include: {
        category: true,
        size: true,
        color: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }), 
    prismadb.product.count({
      where: {
        storeId,
      },
    }),
  ]);

  const formattedProducts: ProductColumns[] = products.map(item => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    color: item.color.value,
    size: item.size.name,

    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient products={formattedProducts}/>
      </div>
    </div>
   )
}
 
export default ProductsPage