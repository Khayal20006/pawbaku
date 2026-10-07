import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { initials } from '../lib/format'

const NAV_ITEMS = [
  { to: '/', label: 'Ana' },
  { to: '/listings', label: 'İtkin & Tapılmış' },
  { to: '/adopt', label: 'Övladlığa götürmə' },
  { to: '/report', label: 'Kömək edin' },
]

function Logo() {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-pop">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path
            d="M12 8.5c-1 2-2.2 3.4-3.6 4.6M12 8.5c1 2 2.2 3.4 3.6 4.6m0-6a1.4 1.4 0 1 0 .01 0m-7.2 0a1.4 1.4 0 1 0 .01 0"
            strokeLinecap="round"
          />
          <path d="M6 18c1 .8 2.4 1.4 3.6 2.2 1 .6 2 .6 2.4.6.4 0 1.4 0 2.4-.6 1.2-.8 2.6-1.4 3.6-2.2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="display block text-xl leading-none text-ink">
        Paw<em className="font-extrabold text-brand-600">Baku</em>
      </span>
    </Link>
  )
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `link-underline rounded-md px-3 py-2 text-[13px] font-medium tracking-tight transition ${
      isActive ? 'text-ink is-active' : 'text-ink/60 hover:text-ink'
    }`

  return (
    <div className="flex min-h-screen flex-col">
      <header
        className={`sticky top-0 z-40 bg-paper/90 backdrop-blur-md transition-shadow ${
          scrolled
            ? 'shadow-[0_1px_0_rgb(34_29_22/0.1),0_16px_32px_-28px_rgb(34_29_22/0.35)]'
            : ''
        }`}
      >
        <div className="border-b border-ink/8 bg-brand-600">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white">
              Bakı · Heyvan Platforması
            </span>
            <a
              href="mailto:komak@pawbaku.az"
              className="rounded-full bg-white/15 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-white transition hover:bg-white/25"
            >
komak@pawbaku.az
            </a>
          </div>
        </div>

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Logo />

          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 ring-1 ring-ink/10 transition hover:ring-ink/25"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-brand-600 text-[11px] font-extrabold text-white">
                    {initials(user.fullName, user.username)}
                  </span>
                  <span className="hidden text-left md:block">
                    <span className="block text-xs font-semibold text-ink">
                      {user.fullName || user.username}
                    </span>
                  </span>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-xl border border-ink/10 bg-parchment shadow-lift">
                      <div className="border-b border-ink/8 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-ink">
                          {user.fullName || user.username}
                        </p>
                        <p className="truncate text-xs text-ink/50">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-ink/75 hover:bg-ink/5"
                      >
                        Profil
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full px-4 py-2.5 text-left text-sm text-rose-700 hover:bg-rose-50"
                      >
                        Çıxış
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-ink/70 transition hover:bg-ink/5 hover:text-ink"
                >
                  Daxil ol
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-brand-600 px-5 py-2 text-sm font-extrabold text-white shadow-[0_10px_24px_-14px_rgb(242_86_0/0.6)] transition hover:bg-brand-700"
                >
                  Qeydiyyat
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-lg p-2 text-ink/60 transition hover:bg-ink/5 lg:hidden"
              aria-label="Menyu"
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6">
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-ink/8 px-4 py-3 lg:hidden">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-ink/75 hover:bg-ink/5"
              >
                {item.label}
              </NavLink>
            ))}
            {!user && (
              <div className="mt-2 flex gap-2 border-t border-ink/8 pt-3">
                <Link
                  to="/login"
                  className="flex-1 rounded-full px-4 py-2 text-center text-sm font-semibold text-ink/70 ring-1 ring-ink/15"
                >
                  Daxil ol
                </Link>
                <Link
                  to="/register"
                  className="flex-1 rounded-full bg-brand-600 px-4 py-2 text-center text-sm font-extrabold text-white"
                >
                  Qeydiyyat
                </Link>
              </div>
            )}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Outlet />
      </main>

      <footer className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 pb-10 sm:flex-row sm:items-end">
            <div>
              <p className="display text-4xl leading-none text-white sm:text-6xl">
                Paw<em className="font-medium text-brand-400">Baku</em>
              </p>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
                İtkinlər tapılır, zədəlilər sağaldılır, sahibsizlər yeni ev tapır.
              </p>
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">
              Bir pəncə · bir ümid
            </div>
          </div>
          <p className="pt-6 text-center text-xs text-white/40">
            PawBaku · Portfolio layihəsi — MVP
          </p>
        </div>
      </footer>
    </div>
  )
}