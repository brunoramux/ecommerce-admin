'use client'

import { Heading } from "@/components/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useOrigin } from "@/hooks/use-origin"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Category } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface CategoryFormProps {
  initialData: Category | null
}

const categoryFormSchema = z.object({
  name: z.string().min(1, {message: "Value required"}),
  billboardId: z.string().min(1)
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>


export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData
}) => {
  const params = useParams()
  const router = useRouter()
  const [ open, setOpen ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const origin = useOrigin()

  const title = initialData ? "Edit category" : "Create category"
  const description = initialData ? "Edit a category" : "Add a new category"
  const toastMessage = initialData ? "Category updated." : "Category created."
  const action = initialData ? "Save changes" : "Create"

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData || {
      name: '',
      billboardId: ''
    }
  })

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true)
      if( initialData ){
        await axios.patch(`/api/${params.storeId}/categories/${params.billboardId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data)
      }
      router.refresh()
      setLoading(false)
      router.push(`/${params.storeId}/categories`)

      toast.success(toastMessage)
    } catch (error) {
      toast.error("Something went wrong.")
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/categories/${params.billboardId}`)
      router.refresh()
      router.push(`/${params.storeId}/categories`)
      toast.success("Category deleted.")
    } catch (error) {
      //toast.error("Make sure you removed all categories using this billboard.")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} loading={loading} onConfirm={() => onDelete()}/>
      <div className="flex items-center justify-between">
       <Heading title={title} description={description}/>
       {
        initialData && (
          <Button variant="destructive" disabled={loading} size="icon" onClick={() => setOpen(true)}> 
            <Trash className="h4- w-4"/>
          </Button>
        )
       }
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Category name" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> 
          <Button disabled={loading}>
            {action}
          </Button>
        </form> 
      </Form> 
    </>
  )
}
