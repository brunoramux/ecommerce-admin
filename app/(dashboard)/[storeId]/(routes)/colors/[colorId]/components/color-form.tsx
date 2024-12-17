'use client'

import { Heading } from "@/components/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useOrigin } from "@/hooks/use-origin"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Color } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface ColorFormProps {
  initialData: Color | null
}

const colorFormSchema = z.object({
  name: z.string().min(1, {message: "Value required"}),
  value: z.string().min(1, {message: "Value required"}),
})

type ColorFormValues = z.infer<typeof colorFormSchema>


export const ColorForm: React.FC<ColorFormProps> = ({
  initialData
}) => {
  const params = useParams()
  const router = useRouter()
  const [ open, setOpen ] = useState(false)
  const [ loading, setLoading ] = useState(false)
  const origin = useOrigin()

  const title = initialData ? "Edit color" : "Create color"
  const description = initialData ? "Edit a color" : "Add a new color"
  const toastMessage = initialData ? "Color updated." : "Color created."
  const action = initialData ? "Save changes" : "Create"

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(colorFormSchema),
    defaultValues: initialData || {
      name: '',
      value: ''
    }
  })

  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true)
      if( initialData ){
        await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data)
      }
      router.refresh()
      setLoading(false)
      router.push(`/${params.storeId}/colors`)

      toast.success(toastMessage)
    } catch (error) {
      toast.error("Something went wrong.")
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
      router.refresh()
      router.push(`/${params.storeId}/colors`)
      toast.success("Color deleted.")
    } catch (error) {
      toast.error("Make sure you removed all products using this color.")
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
          <Button variant="destructive" disabled={loading} color="icon" onClick={() => setOpen(true)}> 
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Color name" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <div className="grid grid-cols-3 gap-8">
            <FormField 
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Color value" {...field}/>
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
