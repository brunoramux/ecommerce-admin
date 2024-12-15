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
    const { name, billboardId } = body
    const { storeId } = await params

    if(!userId){
      return new NextResponse('Unauthorized', {status: 401})
    }

    if(!name){
      return new NextResponse('Label is required', {status: 400})
    }

    if(!billboardId){
      return new NextResponse('Billboard Id is required', {status: 400})
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

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId
      }
    })


    return NextResponse.json(category, { status: 201 })

  } catch (error) {
    console.log('[CATEGORY_POST]', error)
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

    const categories = await prismadb.category.findMany({
      where: {
        storeId
      }
    })


    return NextResponse.json(categories, { status: 200 })

  } catch (error) {
    console.log('[CATEGORIES_GET]', error)
    return new NextResponse("Internal error", { status: 500 }) 
  }
}