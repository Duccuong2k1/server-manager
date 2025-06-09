import { useState, useMemo } from 'react'

export function usePagination<T>(data: T[], pageSize: number = 10) {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = useMemo(() => Math.ceil(data.length / pageSize), [data.length, pageSize])
    const paginatedData = useMemo(
        () => data.slice((currentPage - 1) * pageSize, currentPage * pageSize),
        [data, currentPage, pageSize]
    )
    return { currentPage, setCurrentPage, totalPages, paginatedData, pageSize }
} 