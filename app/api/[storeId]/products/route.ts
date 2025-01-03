import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

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

export async function POST(
  req: Request, 
  { params }: { params: { storeId: string } }
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
    const { storeId } = await params

    if(!userId){
      return new NextResponse('Unauthorized', {status: 401})
    }

    if(!name){
      return new NextResponse('Name is required', {status: 400})
    }

    if(!storeId){
      return new NextResponse('Store Id is required', {status: 400})
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

    const product = await prismadb.product.create({
      data: {
        categoryId,
        colorId,
        name,
        price,
        sizeId,
        storeId,
        isArchived,
        isFeatured
      }
    })

    images.forEach(async ( image ) => {
      await prismadb.image.create({
        data: {
          productId: product.id,
          url: image.url
        }
      })
    })


    return NextResponse.json(product, { status: 201 })

  } catch (error) {
    console.log('[PRODUCT_POST]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}

export async function GET(
  req: Request, 
  { params }: { params: { storeId: string } }
){
  try {
    const { storeId } = await params

    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get('categoryId') || undefined
    const colorId = searchParams.get('colorId') || undefined
    const sizeId = searchParams.get('sizeId') || undefined
    const isFeatured = searchParams.get('isFeatured')

    
     
    if(!storeId){
      return new NextResponse('Store is required', {status: 400})
    }

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
      }
    })

    if(!store){
      return new NextResponse('Unauthorized.', {status: 403})
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured === 'true' ? true : undefined,
        isArchived: false
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })


    return NextResponse.json(products, { status: 200 })

  } catch (error) {
    console.log('[PRODUCTS_GET]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}