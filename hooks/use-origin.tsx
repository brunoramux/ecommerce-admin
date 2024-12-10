import { useEffect, useState } from "react"

export const useOrigin = () => {
  // Hook para usarmos a variável origin sem problemas de hidratacao do Next
  const [mounted, setMounted] = useState(false)
  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : ''

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted){
    return ''
  }

  return origin
}