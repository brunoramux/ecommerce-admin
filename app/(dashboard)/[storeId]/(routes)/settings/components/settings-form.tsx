'use client'

import { Heading } from "@/components/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useOrigin } from "@/hooks/use-origin"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Store } from "@prisma/client"
import axios from "axios"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

interface SettingsFormProps {
  initialData: Store
}

const settingsFormSchema = z.object({
  name: z.string().min(1, {message: "Value required"})
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>


export const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData
}) => {
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const origin = useOrigin()

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: initialData
  })

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true)
      await axios.patch(`/api/stores/${params.storeId}`, data)
      router.refresh()
      setLoading(false)
      toast.success("Store updated.")
    } catch (error) {
      toast.error("Something went wrong.")
      setLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/stores/${params.storeId}`)
      router.refresh()
      router.push("/")
      toast.success("Store deleted.")
    } catch (error) {
      toast.error("Make sure you removed all products and categorics first.")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} loading={loading} onConfirm={() => onDelete()}/>
      <div className="flex items-center justify-between">
       <Heading title="Settings" description="Manage store preferences"/>
       <Button variant="destructive" disabled={loading} size="icon" onClick={() => setOpen(true)}> 
        <Trash className="h4- w-4"/>
       </Button>
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
                    <Input disabled={loading} placeholder="Store name" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> 
          <Button disabled={loading}>
            Save changes
          </Button>
        </form> 
      </Form> 
      <Separator />
      <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public" />
    </>
  )
}
