import { API, SYSADMIN_API } from '@/utils/api'
import React, { useEffect, useState } from 'react'

function SenaraiPengguna() {

    const [data, set_data] = useState({
        row: [],
        total: 0,
        totalPages: 0
    })

    const [page, set_page]      = useState(1)
    const [limit, set_limit]    = useState(10)
    const [search, set_search]  = useState("")

    const getData = async () => {
        let api = await SYSADMIN_API(`pengurusan/pengguna?page=${page}&limit=${limit}&search=${search}`, {}, "GET", true)
        if(api.status_code === 200) {
            let data = api.data
            set_data({
                row: data.row,
                total: data.total,
                totalPages: data.totalPages
            })
        }
    }

    useEffect(() => {
        getData()
    }, [])
    return (
        <div>
            {JSON.stringify(data.row)}
        </div>
    )
}

export default SenaraiPengguna