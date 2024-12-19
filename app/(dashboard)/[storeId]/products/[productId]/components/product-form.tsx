'use client'

import { Heading } from "@/components/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import ImageUpload from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useOrigin } from "@/hooks/use-origin"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Product } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface ProductFormProps {
  initialData: Product | null
}

const productFormSchema = z.object({
  name: z.string().min(1, {message: "Value required"}),
  imageUrl: z.string() 
})

type ProductFormValues = z.infer<typeof productFormSchema>


export const ProductForm: React.FC<ProductFormProps> = ({
  initialData
}) => {
  const params = useParams()
  const router = useRouter()
  const [ open, setOpen ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const origin = useOrigin()

  const title = initialData ? "Edit product" : "Create product"
  const description = initialData ? "Edit a product" : "Add a new product"
  const toastMessage = initialData ? "Product updated." : "Product created."
  const action = initialData ? "Save changes" : "Create"

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: ''
    }
  })

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true)
      if( initialData ){
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/products`, data)
      }
      router.refresh()
      setLoading(false)
      router.push(`/${params.storeId}/products`)

      toast.success(toastMessage)
    } catch (error) {
      toast.error("Something went wrong.")
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
      router.refresh()
      router.push(`/${params.storeId}/products`)
      toast.success("Product deleted.")
    } catch (error) {
      toast.error("Make sure you removed all categories using this product.")
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
          <FormField 
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background image</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Product label" {...field}/>
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
