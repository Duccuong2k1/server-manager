import React from 'react'



function SkeletonBox({height = 16, width = 96}: {height?:number, width?:number}) {
  return (
     <div className={`h-[${height}px]  bg-gray-200 dark:bg-gray-700 rounded w-[${width}px]`}></div>
  )
}

export default SkeletonBox