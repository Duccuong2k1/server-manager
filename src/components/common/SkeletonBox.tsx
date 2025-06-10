import React from 'react'

type Props = {}

function SkeletonBox({}: Props) {
  return (
     <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
  )
}

export default SkeletonBox