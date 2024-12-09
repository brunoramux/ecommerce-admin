'use client'

import { Heading } from "@/components/heading"
import { Button } from "@/components/ui/button"
import type { Store } from "@prisma/client"
import { Trash } from "lucide-react"

interface SettingsFormProps {
  initialData: Store
}

export default function SettingsForm({ initialData }: SettingsFormProps){
  return (
    <div className="flex items-center justify-between">
       <Heading title="Settings" description="Manage store preferences"/>
       <Button variant="destructive" size="icon" onClick={() => {}}> 
        <Trash className="h4- w-4"/>
       </Button>
    </div>
  )
}
