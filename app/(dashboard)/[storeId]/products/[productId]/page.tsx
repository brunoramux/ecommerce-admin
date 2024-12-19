import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({ 
  params 
} : {
  params: { productId: string }
}) => {
  const { productId } = await params

  const product = await prismadb.product.findUnique({
    where: {
      id: productId
    },
    include: {
      images: true
    }
  })


  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product}/>
      </div>
    </div>
   );
}
 
export default ProductPage;