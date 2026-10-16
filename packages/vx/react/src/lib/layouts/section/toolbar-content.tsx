import {
  type ReactNode,
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'

export type SectionToolbarContent = {
  desktop: ReactNode
  mobile?: ReactNode
}

type SectionToolbarContentContextValue = {
  content: SectionToolbarContent
  setContent: (content: SectionToolbarContent) => void
}

const EMPTY_SECTION_TOOLBAR_CONTENT: SectionToolbarContent = {
  desktop: null
}

const SectionToolbarContentContext =
  createContext<SectionToolbarContentContextValue | null>(null)

export const SectionToolbarContentProvider = ({
  children
}: {
  children: ReactNode
}) => {
  const [content, setContent] = useState<SectionToolbarContent>(
    EMPTY_SECTION_TOOLBAR_CONTENT
  )
  const value = useMemo(() => ({ content, setContent }), [content])

  return (
    <SectionToolbarContentContext.Provider value={value}>
      {children}
    </SectionToolbarContentContext.Provider>
  )
}

const useSectionToolbarContentContext = () => {
  const context = useContext(SectionToolbarContentContext)

  if (!context)
    throw new Error(
      'Section toolbar content requires SectionToolbarContentProvider'
    )

  return context
}

export const useSectionToolbarContent = (content: SectionToolbarContent) => {
  const { setContent } = useSectionToolbarContentContext()

  useLayoutEffect(() => {
    setContent(content)
    return () => setContent(EMPTY_SECTION_TOOLBAR_CONTENT)
  }, [content, setContent])
}

export const useRegisteredSectionToolbarContent = () =>
  useSectionToolbarContentContext().content
