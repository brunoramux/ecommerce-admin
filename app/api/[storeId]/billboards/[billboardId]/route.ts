import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(
  req: Request, 
  { params }: { params: { storeId: string, billboardId: string } }
){
  try {
    const { userId } = await auth() 

    const { billboardId, storeId} = await params

    if(!userId){
      return new NextResponse('Unauthorized', {status: 401})
    }

    if(!storeId){
      return new NextResponse('Store is required', {status: 400})
    }

    if(!billboardId){
      return new NextResponse('Billboard is required', {status: 400})
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

    const billboard = await prismadb.billboard.findUnique({
      where: {
        storeId: storeId,
        id: billboardId
      }
    })


    return NextResponse.json(billboard, { status: 200 })

  } catch (error) {
    console.log('[BILLBOARD_GET]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string, billboardId: string } }
){
  try {
    const { userId } = await auth()
    const body = await req.json()

    const { label, imageUrl } = body

    const {billboardId, storeId} = await params

    if(!userId){
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if(!label){
      return new NextResponse('Label is required', { status: 400 })
    }

    if(!imageUrl){
      return new NextResponse('Image URL is required', { status: 400 })
    }

    if(!storeId){
      return new NextResponse('Store is required', { status: 400 })
    }

    if(!billboardId){
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

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: billboardId,
        storeId: storeId
      },
      data: {
        label,
        imageUrl
      }
    })

    return NextResponse.json(billboard, { status: 200 })


  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string, billboardId: string } }
){
  try {
    const { userId } = await auth()
    const { billboardId, storeId } = await params

    if(!userId){
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if(!billboardId){
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

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: billboardId,
        storeId: storeId
      },
    })

    return NextResponse.json(billboard, { status: 200 })

 
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}