import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(
  req: Request, 
  { params }: { params: { storeId: string } }
){
  try {
    const { userId } = await auth() 
    const body = await req.json()
    const { name, value } = body
    const { storeId } = await params

    if(!userId){
      return new NextResponse('Unauthorized', {status: 401})
    }

    if(!name){
      return new NextResponse('Label is required', {status: 400})
    }

    if(!value){
      return new NextResponse('Value is required', {status: 400})
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

    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId: storeId
      }
    })


    return NextResponse.json(size, { status: 201 })

  } catch (error) {
    console.log('[SIZES_POST]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}

export async function GET(
  req: Request, 
  { params }: { params: { storeId: string } }
){
  try {
    const { storeId } = await params


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

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: storeId
      }
    })


    return NextResponse.json(sizes, { status: 200 })

  } catch (error) {
    console.log('[SIZES_GET]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}