export function LoadingSpinner() {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 right-0 bottom-0 animate-spin">
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-8 border-solid border-transparent border-t-blue-500 border-l-purple-500 border-b-pink-500 border-r-green-500"></div>
          </div>
          <div className="absolute top-2 left-2 right-2 bottom-2 animate-spin animate-reverse">
            <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-8 border-solid border-transparent border-t-yellow-500 border-l-red-500 border-b-indigo-500 border-r-orange-500"></div>
          </div>
        </div>
      </div>
    )
  }
  
  