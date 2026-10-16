import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState
} from 'react'

type MobileControlsContextValue = {
  isFooterHidden: boolean
  setIsFooterHidden: (isHidden: boolean) => void
}

const MobileControlsContext = createContext<MobileControlsContextValue>({
  isFooterHidden: false,
  setIsFooterHidden: () => undefined
})

export const MobileControlsProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const [isFooterHidden, setIsFooterHidden] = useState(false)
  const value = useMemo(
    () => ({
      isFooterHidden,
      setIsFooterHidden
    }),
    [isFooterHidden]
  )

  return (
    <MobileControlsContext.Provider value={value}>
      {children}
    </MobileControlsContext.Provider>
  )
}

export const useMobileControls = () => useContext(MobileControlsContext)
