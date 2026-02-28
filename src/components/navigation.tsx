import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'DASHBOARD', path: '/' },
  { label: 'ANOTHER PAGE', path: '/another' },
  { label: 'MANIFESTO', path: '/manifest' },
]

export default function Navigation() {
  const location = useLocation()

  return (
    <nav className="flex flex-col gap-2">
      <div className="text-xs mb-2 opacity-50 underline">MAIN_MENU</div>
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-1 transition-all duration-150 group flex items-center gap-2 focus:outline-none focus:bg-green-400 focus:text-black ${
              isActive
                ? 'bg-green-700 text-black font-bold border-l-4 border-white'
                : 'hover:bg-green-900 hover:pl-5'
            }`}
          >
            <span className={isActive ? 'text-black' : 'group-hover:animate-pulse'}>
              {isActive ? '>' : '$'}
            </span>
            {item.label}
          </Link>
        )
      })}
      <div className="mt-8 text-[10px] opacity-30 leading-tight">
        PRESS [TAB] TO NAVIGATE<br />
        PRESS [ENTER] TO SELECT
      </div>
    </nav>
  )
}
