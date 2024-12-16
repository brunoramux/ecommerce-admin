import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(
  req: Request, 
  { params }: { params: { storeId: string, sizeId: string } }
){
  try {

    const { sizeId, storeId} = await params


    if(!storeId){
      return new NextResponse('Store is required', {status: 400})
    }

    if(!sizeId){
      return new NextResponse('Billboard is required', {status: 400})
    }

    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
      }
    })

    if(!store){
      return new NextResponse('Unauthorized.', {status: 403})
    }

    const size = await prismadb.size.findUnique({
      where: {
        storeId: storeId,
        id: sizeId
      }
    })


    return NextResponse.json(size, { status: 200 })

  } catch (error) {
    console.log('[SIZE_GET]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, sizeId: string } }
){
  try {
    const { userId } = await auth()
    const body = await req.json()

    const { name, value } = body

    const { sizeId, storeId } = await params

    if(!userId){
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if(!name){
      return new NextResponse('Label is required', { status: 400 })
    }

    if(!value){
      return new NextResponse('Value is required', { status: 400 })
    }


    if(!storeId){
      return new NextResponse('Store is required', { status: 400 })
    }

    if(!sizeId){
      return new NextResponse('BillboardD is required', { status: 400 })
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

    const size = await prismadb.size.updateMany({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value
      }
    })

    return NextResponse.json(size, { status: 200 })


  } catch (error) {
    console.log('[SIZE_PATCH]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string, sizeId: string } }
){
  try {
    const { userId } = await auth()
    const { sizeId, storeId } = await params

    if(!userId){
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if(!sizeId){
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
      return new NextResponse('Unauthorized.', { status: 403 })
    }

    const size = await prismadb.size.deleteMany({
      where: {
        id: sizeId,
        storeId: storeId
      },
    })

    return NextResponse.json(size, { status: 200 })

 
  } catch (error) {
    console.log('[SIZE_DELETE]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}