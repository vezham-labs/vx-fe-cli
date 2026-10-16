import { useLocation } from '@tanstack/react-router'

import ClassesContent from './classes-content'

const ClassesPageContent = () => {
  const { href, pathname } = useLocation()

  if (pathname === '/academic/classes/allclasses') return <ClassesContent />

  return <p className="text-muted font-mono text-sm break-all">{href}</p>
}

export default ClassesPageContent
