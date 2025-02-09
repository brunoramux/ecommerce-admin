import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(
  req: Request, 
  { params }: { params: { storeId: string, productId: string } }
){
  try {

    const { productId, storeId} = await params

    if(!storeId){
      return new NextResponse('Store is required', {status: 400})
    }

    if(!productId){
      return new NextResponse('Product is required', {status: 400})
    }

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
      }
    })

    if(!store){
      return new NextResponse('Unauthorized.', {status: 403})
    }

    const product = await prismadb.product.findUnique({
      where: {
        storeId: storeId,
        id: productId
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true
      }
    })


    return NextResponse.json(product, { status: 200 })

  } catch (error) {
    console.log('[PRODUCT_GET]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}

interface createProductProps {
  name: string
  images: {
    url: string
  }[]
  price: number
  categoryId: string
  colorId: string
  sizeId: string
  isFeatured: boolean
  isArchived: boolean
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, productId: string } }
){
  try {
    const { userId } = await auth()
    const body: createProductProps = await req.json()

    const { 
      categoryId,
      colorId,
      images,
      isArchived,
      isFeatured,
      name,
      price,
      sizeId
     } = body

    const { productId, storeId } = await params

    if(!userId){
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if(!name){
      return new NextResponse('Label is required', { status: 400 })
    }


    if(!storeId){
      return new NextResponse('Store is required', { status: 400 })
    }

    if(!productId){
      return new NextResponse('ProductD is required', { status: 400 })
    }

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId
      }
    })  

    if(!store){
      return new NextResponse('Unauthorized.', {status: 403})
    }

    const product = await prismadb.product.updateMany({
      where: {
        id: productId,
      },
      data: {
        categoryId,
        colorId,
        name,
        price,
        sizeId,
        storeId,
        isArchived,
        isFeatured
      },
    })

    await prismadb.image.deleteMany({
      where: {
        productId
      }
    })

    images.forEach(async (image) => {
      await prismadb.image.create({
        data: {
          productId,
          url: image.url
        }
      })
    })

    return NextResponse.json(product, { status: 200 })


  } catch (error) {
    console.log('[PRODUCT_PATCH]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string, productId: string } }
){
  try {
    const { userId } = await auth()
    const { productId, storeId } = await params

    if(!userId){
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if(!productId){
      return new NextResponse('Product is required', { status: 400 })
    }

    if(!storeId){
      return new NextResponse('Store is required', { status: 400 })
    }

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
        userId
      }
    })

    if(!store){
      return new NextResponse('Unauthorized.', {status: 403})
    }

    const product = await prismadb.product.deleteMany({
      where: {
        id: productId,
        storeId: storeId
      },
    })


    return NextResponse.json(product, { status: 200 })

 
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}