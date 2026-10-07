import { Link } from 'react-router-dom'
import { useState } from 'react'
import { EmptyState, SectionTitle, FilterPill } from '../components/ui'

const FILTERS = ['Hamısı', 'İtkin', 'Tapılmış'] as const

export default function ListingsPage() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>('Hamısı')

  return (
    <div className="animate-fade-in">
      <SectionTitle
        kicker="İtkin & Tapılmış"
        title="Elanlar"
        description="Xəritədə uyğunlaşdırma balı ilə sahibini tap. Bu modul MVP-nin Pillə 2 hissəsidir — verilənlər bazası sxemi hazırdır, elan formu backend qoşulan kimi aktivləşir."
        action={
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <FilterPill key={filter} active={active === filter} onClick={() => setActive(filter)}>
                {filter}
              </FilterPill>
            ))}
          </div>
        }
      />

      <EmptyState
        title="Burada elanlar görünəcək"
        description="İlk elanı verən siz ola bilərsiniz — sistem növ, rəng, məsafə və vaxta görə uyğunluq balı hesablayacaq."
        action={
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-parchment transition hover:bg-brand-700"
          >
            Elan ver
            <span aria-hidden>→</span>
          </Link>
        }
      />
    </div>
  )
}