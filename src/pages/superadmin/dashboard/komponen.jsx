import React, { useMemo, useState } from 'react'
import Icons from '@/components/ui/Icon'
import moment from 'moment'

// Palet carta (rujukan dataviz, disahkan untuk buta warna). Warna mengikut entiti, bukan kedudukan.
export const PALET = {
    light: {
        surface: '#ffffff', grid: '#eef0f3', axis: '#64748b', text: '#0f172a', muted: '#64748b',
        jenis: { 'Infaq': '#2a78d6', 'Auto-Infaq': '#eb6834', 'Kempen': '#1baf7a' },
        channel: { 'Online Banking': '#4a3aa7', 'Kredit': '#eda100' },
        baharu: '#4a3aa7', berulang: '#cbd5e1',
        good: '#0ca30c', critical: '#d03b3b',
        seq: ['#f1f5f9', '#cde2fb', '#9ec5f4', '#6da7ec', '#3987e5', '#256abf', '#184f95', '#0d366b'],
        single: '#2a78d6'
    },
    dark: {
        surface: '#1e293b', grid: '#334155', axis: '#94a3b8', text: '#f8fafc', muted: '#94a3b8',
        jenis: { 'Infaq': '#3987e5', 'Auto-Infaq': '#d95926', 'Kempen': '#199e70' },
        channel: { 'Online Banking': '#9085e9', 'Kredit': '#c98500' },
        baharu: '#9085e9', berulang: '#475569',
        good: '#0ca30c', critical: '#d03b3b',
        seq: ['#273449', '#104281', '#184f95', '#1c5cab', '#256abf', '#3987e5', '#6da7ec', '#b7d3f6'],
        single: '#3987e5'
    }
}

export const LABEL_JENIS = { 'Infaq': 'Infaq Am', 'Auto-Infaq': 'Auto Infaq', 'Kempen': 'Kempen' }
export const LABEL_CHANNEL = { 'Online Banking': 'Online Banking (FPX)', 'Kredit': 'Kredit' }

export function RM(amount = 0, digits = 2) {
    return 'RM ' + Number(amount || 0).toLocaleString('en-MY', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

export function RMRingkas(amount = 0) {
    let n = Number(amount || 0)
    if(Math.abs(n) >= 1000000) return `RM${(n / 1000000).toFixed(1)}j`
    if(Math.abs(n) >= 1000) return `RM${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`
    return `RM${n.toFixed(0)}`
}

export function Nombor(n = 0) {
    return Number(n || 0).toLocaleString('en-MY')
}

export function Peratus(semasa, sebelum) {
    if(!sebelum) return null
    return ((semasa - sebelum) / sebelum) * 100
}

export function Delta({ nilai, songsang = false, className = '' }) {
    if(nilai === null || nilai === undefined || !isFinite(nilai)) return null
    let naik    = nilai >= 0
    let baik    = songsang ? !naik : naik
    return (
        <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${baik ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'} ${className}`}>
            <Icons icon={naik ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'} />
            {naik ? '+' : ''}{nilai.toFixed(1)}%
        </span>
    )
}

export function Panel({ tajuk, subtajuk, kanan, children, className = '', bodyClass = 'p-5' }) {
    return (
        <section className={`rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800 ${className}`}>
            {(tajuk || kanan) && (
                <header className='flex flex-wrap items-start justify-between gap-3 px-5 pt-5'>
                    <div>
                        <h3 className='text-[15px] font-semibold text-slate-900 dark:text-white'>{tajuk}</h3>
                        {subtajuk && <p className='mt-0.5 text-xs text-slate-500 dark:text-slate-400'>{subtajuk}</p>}
                    </div>
                    {kanan}
                </header>
            )}
            <div className={bodyClass}>{children}</div>
        </section>
    )
}

export function KpiTile({ ikon, label, nilai, delta, deltaSongsang, nota, pautan }) {
    return (
        <div className='flex flex-col rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-700 dark:bg-slate-800'>
            <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2 text-slate-500 dark:text-slate-400'>
                    <Icons icon={ikon} className='text-lg' />
                    <span className='text-xs font-semibold uppercase tracking-wider'>{label}</span>
                </div>
                <Delta nilai={delta} songsang={deltaSongsang} />
            </div>
            <p className='mt-3 text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-white'>{nilai}</p>
            {nota && <p className='mt-1 text-xs text-slate-500 dark:text-slate-400'>{nota}</p>}
            {pautan && <div className='mt-auto pt-3'>{pautan}</div>}
        </div>
    )
}

export function Legend({ items }) {
    return (
        <div className='flex flex-wrap items-center gap-x-4 gap-y-1'>
            {items.map(item => (
                <span key={item.label} className='inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300'>
                    <span className='h-2.5 w-2.5 rounded-[3px]' style={{ background: item.warna }} />
                    {item.label}
                </span>
            ))}
        </div>
    )
}

// Tooltip carta (recharts) - teks guna warna teks, warna siri hanya pada penanda
export function ChartTooltip({ active, payload, label, formatLabel, formatNilai = RM, jumlah = false }) {
    if(!active || !payload || !payload.length) return null
    let total = payload.reduce((t, p) => t + Number(p.value || 0), 0)
    return (
        <div className='min-w-[180px] rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs shadow-lg dark:border-slate-600 dark:bg-slate-900'>
            <p className='mb-1.5 font-semibold text-slate-900 dark:text-white'>{formatLabel ? formatLabel(label) : label}</p>
            {payload.slice().reverse().map(p => (
                <div key={p.dataKey} className='flex items-center justify-between gap-4 py-0.5'>
                    <span className='inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300'>
                        <span className='h-2 w-2 rounded-sm' style={{ background: p.color || p.fill }} />
                        {p.name}
                    </span>
                    <span className='font-medium tabular-nums text-slate-900 dark:text-white'>{formatNilai(p.value)}</span>
                </div>
            ))}
            {jumlah && payload.length > 1 && (
                <div className='mt-1.5 flex justify-between border-t border-slate-100 pt-1.5 font-semibold text-slate-900 dark:border-slate-700 dark:text-white'>
                    <span>Jumlah</span>
                    <span className='tabular-nums'>{formatNilai(total)}</span>
                </div>
            )}
        </div>
    )
}

// Bar 100% mendatar untuk komposisi (sedikit kategori) dengan label terus
export function BarKomposisi({ tajuk, data, warna, label }) {
    let total = data.reduce((t, d) => t + d.amaun, 0)
    return (
        <div>
            <p className='mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>{tajuk}</p>
            <div className='flex h-3 w-full gap-[2px] overflow-hidden rounded-full'>
                {data.map(d => (
                    <div key={d.label} title={`${label[d.label] || d.label}: ${RM(d.amaun)}`} className='h-full first:rounded-l-full last:rounded-r-full' style={{ width: `${total ? (d.amaun / total) * 100 : 0}%`, background: warna[d.label] || '#94a3b8' }} />
                ))}
            </div>
            <div className='mt-3 space-y-2'>
                {data.map(d => (
                    <div key={d.label} className='flex items-center justify-between gap-3 text-sm'>
                        <span className='inline-flex items-center gap-2 text-slate-600 dark:text-slate-300'>
                            <span className='h-2.5 w-2.5 rounded-[3px]' style={{ background: warna[d.label] || '#94a3b8' }} />
                            {label[d.label] || d.label}
                        </span>
                        <span className='text-right'>
                            <span className='font-semibold tabular-nums text-slate-900 dark:text-white'>{RM(d.amaun, 0)}</span>
                            <span className='ml-2 inline-block w-12 text-xs tabular-nums text-slate-500'>{total ? ((d.amaun / total) * 100).toFixed(1) : 0}%</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

const HARI = ['Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab', 'Ahd']

// Heatmap hari x jam (skala berjujukan satu hue)
export function HeatmapMasa({ data, seq }) {
    const [hover, set_hover] = useState(null)
    const { grid, max } = useMemo(() => {
        let g = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => ({ transaksi: 0, amaun: 0 })))
        let m = 0
        data.forEach(d => { g[d.hari][d.jam] = d; m = Math.max(m, d.transaksi) })
        return { grid: g, max: m }
    }, [data])

    const warna = n => {
        if(!n) return seq[0]
        let i = Math.min(seq.length - 1, 1 + Math.floor((n / max) * (seq.length - 1)))
        return seq[i]
    }

    let terbaik = null
    grid.forEach((baris, h) => baris.forEach((c, j) => { if(!terbaik || c.transaksi > terbaik.transaksi) terbaik = { ...c, hari: h, jam: j } }))

    return (
        <div>
            <div className='mb-3 h-5 text-xs text-slate-600 dark:text-slate-300'>
                {hover
                    ? <span><b>{HARI[hover.hari]}, {String(hover.jam).padStart(2, '0')}:00–{String(hover.jam).padStart(2, '0')}:59</b> · {Nombor(hover.transaksi)} transaksi · {RM(hover.amaun)}</span>
                    : terbaik && terbaik.transaksi > 0 && <span>Waktu paling aktif: <b>{HARI[terbaik.hari]}, {String(terbaik.jam).padStart(2, '0')}:00</b> ({Nombor(terbaik.transaksi)} transaksi)</span>}
            </div>
            <div className='overflow-x-auto'>
                <div className='min-w-[560px]'>
                    {grid.map((baris, h) => (
                        <div key={h} className='mb-[3px] flex items-center gap-[3px]'>
                            <span className='w-8 shrink-0 text-[11px] text-slate-500'>{HARI[h]}</span>
                            {baris.map((c, j) => (
                                <div
                                key={j}
                                onMouseEnter={() => set_hover({ ...c, hari: h, jam: j })}
                                onMouseLeave={() => set_hover(null)}
                                className={`h-5 flex-1 cursor-default rounded-[4px] transition-transform hover:scale-110 ${hover && hover.hari === h && hover.jam === j ? 'ring-2 ring-slate-900 dark:ring-white' : ''}`}
                                style={{ background: warna(c.transaksi) }}
                                />
                            ))}
                        </div>
                    ))}
                    <div className='mt-1 flex gap-[3px] pl-[35px]'>
                        {Array.from({ length: 24 }).map((_, j) => (
                            <span key={j} className='flex-1 text-center text-[10px] text-slate-400'>{j % 3 === 0 ? String(j).padStart(2, '0') : ''}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className='mt-3 flex items-center justify-end gap-2 text-[11px] text-slate-500'>
                <span>Kurang</span>
                {seq.map(c => <span key={c} className='h-3 w-5 rounded-[3px]' style={{ background: c }} />)}
                <span>Lebih</span>
            </div>
        </div>
    )
}

export function formatBulan(ym) {
    return moment(ym + '-01').format('MMM YY')
}

export function formatTarikh(d) {
    return moment(d).format('DD MMM')
}
