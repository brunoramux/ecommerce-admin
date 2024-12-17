import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(
  req: Request, 
  { params }: { params: { storeId: string, colorId: string } }
){
  try {

    const { colorId, storeId} = await params


    if(!storeId){
      return new NextResponse('Store is required', {status: 400})
    }

    if(!colorId){
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

    const color = await prismadb.color.findUnique({
      where: {
        storeId: storeId,
        id: colorId
      }
    })


    return NextResponse.json(color, { status: 200 })

  } catch (error) {
    console.log('[COLOR_GET]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, colorId: string } }
){
  try {
    const { userId } = await auth()
    const body = await req.json()

    const { name, value } = body

    const { colorId, storeId } = await params

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

    if(!colorId){
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

    const color = await prismadb.color.updateMany({
      where: {
        id: colorId,
      },
      data: {
        name,
        value
      }
    })

    return NextResponse.json(color, { status: 200 })


  } catch (error) {
    console.log('[COLOR_PATCH]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string, colorId: string } }
){
  try {
    const { userId } = await auth()
    const { colorId, storeId } = await params

    if(!userId){
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if(!colorId){
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

    const color = await prismadb.color.deleteMany({
      where: {
        id: colorId,
        storeId: storeId
      },
    })

    return NextResponse.json(color, { status: 200 })

 
  } catch (error) {
    console.log('[COLOR_DELETE]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}