import prismadb from "@/lib/prismadb"
import BillboardClient from "./components/client"

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


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient billboards={billboards}/>
      </div>
    </div>
   )
}
 
export default BillboardsPage