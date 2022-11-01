import {useState, useEffect} from 'react'

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null })

  const updateMousePosition = ev => {
    setMousePosition({ x: ev.clientX, y: ev.clientY })
  }

  useEffect(() => {
    window.addEventListener("drag", updateMousePosition)

    return () => window.removeEventListener("drag", updateMousePosition)
  }, [])

  return mousePosition
}

export default useMousePosition