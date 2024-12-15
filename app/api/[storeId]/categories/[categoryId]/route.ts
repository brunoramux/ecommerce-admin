import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(
  req: Request, 
  { params }: { params: { storeId: string, categoryId: string } }
){
  try {

    const { categoryId, storeId} = await params


    if(!storeId){
      return new NextResponse('Store is required', {status: 400})
    }

    if(!categoryId){
      return new NextResponse('Category is required', {status: 400})
    }

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
      }
    })

    if(!store){
      return new NextResponse('Unauthorized.', {status: 403})
    }

    const category = await prismadb.category.findUnique({
      where: {
        storeId: storeId,
        id: categoryId
      }
    })


    return NextResponse.json(category, { status: 200 })

  } catch (error) {
    console.log('[CATEGORY_GET]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, categoryId: string } }
){
  try {
    const { userId } = await auth()
    const body = await req.json()

    const { name, billboardId } = body

    const { categoryId, storeId } = await params

    if(!userId){
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if(!name){
      return new NextResponse('Name is required', { status: 400 })
    }


    if(!storeId){
      return new NextResponse('Store is required', { status: 400 })
    }

    if(!categoryId){
      return new NextResponse('Category Id is required', { status: 400 })
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

    const category = await prismadb.category.updateMany({
      where: {
        id: categoryId,
      },
      data: {
        name,
        billboardId
      }
    })

    return NextResponse.json(category, { status: 200 })


  } catch (error) {
    console.log('[CATEGORY_PATCH]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string, categoryId: string } }
){
  try {
    const { userId } = await auth()
    const { categoryId, storeId } = await params

    if(!userId){
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if(!categoryId){
      return new NextResponse('Billboard is required', { status: 400 })
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

    const category = await prismadb.category.deleteMany({
      where: {
        id: categoryId,
        storeId: storeId
      },
    })

    return NextResponse.json(category, { status: 200 })

 
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}