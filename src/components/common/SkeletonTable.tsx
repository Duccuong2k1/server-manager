// create a skeleton table component

import React from 'react';
import { TableCell } from '../ui/table';

const SkeletonTable: React.FC = () => {
  return (
    <>
    {
        [...Array(7)].map((_, index) => (
            <TableCell key={index} className="py-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </TableCell>
        ))
    }
    
    </>
  );
};

export default SkeletonTable;

