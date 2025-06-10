import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { Server } from '@/lib/supabase/types'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1


    const { count, error: countError } = await supabase
        .from('servers')
        .select('*', { count: 'exact', head: true })
    if (countError) {
        return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    const { data, error } = await supabase
        .from('servers')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
        total: count,
        servers: data as Server[],
        page,
        pageSize
    })
} 