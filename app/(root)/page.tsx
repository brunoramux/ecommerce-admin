'use client'

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";



export default function SetupPage() {
  const onOpen = useStoreModal(state => state.onOpen)
  const isOpen = useStoreModal(state => state.isOpen)
  const onClose = useStoreModal(state => state.onClose)

  useEffect(() => {
    if(!isOpen){
      onOpen()
    }
  }, [isOpen, onOpen, onClose])

  return (
    <div className="p-4">
     
    </div>
  );
}
