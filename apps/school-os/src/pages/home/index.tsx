import { ReorderableGridList } from '@vezham/react/bookmarks/favorites'

const HomePage = () => {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-2 py-4 md:px-6 md:pt-20 md:pb-12">
      Welcome to School!...
      <ReorderableGridList />
    </div>
  )
}

export default HomePage
