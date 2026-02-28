import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface NavNode {
  name: string
  path?: string
  children: Record<string, NavNode>
  isFolder: boolean
  fullPath: string
}

export default function Navigation() {
  const location = useLocation()
  
  // 1. Scan all pages
  const modules = import.meta.glob('../pages/**/*.{md,mdx,tsx,jsx}', { eager: true })
  
  // 2. Build the tree
  const root: NavNode = { name: 'ROOT', children: {}, isFolder: true, fullPath: '/' }
  
  Object.keys(modules).forEach((path) => {
    const cleanPath = path
      .replace('../pages/', '')
      .replace(/\.(md|mdx|tsx|jsx)$/, '')
    
    const isIndex = cleanPath.endsWith('/index') || cleanPath === 'index'
    const routePath = isIndex ? '/' + cleanPath.replace(/\/index$/, '').replace(/^index$/, '') : '/' + cleanPath
    const parts = cleanPath.split('/').filter(p => p !== 'index' && p !== '')
    
    if (parts.length === 0) {
      if (isIndex) root.path = '/'
      return
    }

    let current = root
    let pathAcc = ''
    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1
      pathAcc += (pathAcc === '' ? '' : '/') + part
      if (!current.children[part]) {
        current.children[part] = {
          name: part.toUpperCase().replace(/-/g, '_'),
          children: {},
          isFolder: true, 
          fullPath: '/' + pathAcc
        }
      }
      if (isLast) {
        current.children[part].path = routePath
      }
      current = current.children[part]
    })
  })

  // Post-process to fix isFolder (if no children, it's a file unless explicitly marked)
  const fixIsFolder = (node: NavNode) => {
    Object.values(node.children).forEach(child => {
      child.isFolder = Object.keys(child.children).length > 0
      fixIsFolder(child)
    })
  }
  fixIsFolder(root)

  // 3. State for the current browsing directory
  const [currentBrowsingPath, setCurrentBrowsingPath] = useState('/')

  // Sync browsing path with URL location
  useEffect(() => {
    if (location.pathname === '/') {
      setCurrentBrowsingPath('/')
      return
    }

    // When we change location, we find the node
    const parts = location.pathname.split('/').filter(Boolean)
    // Try to find if this path IS a folder in our tree
    let current = root
    let pathFound = '/'
    for (const part of parts) {
      if (current.children[part]) {
        current = current.children[part]
        if (current.isFolder) pathFound += (pathFound === '/' ? '' : '/') + part
      }
    }
    
    // If the current location is a file, browsing path should be its parent
    if (!current.isFolder) {
       const parentParts = parts.slice(0, -1)
       setCurrentBrowsingPath('/' + parentParts.join('/'))
    } else {
       setCurrentBrowsingPath(pathFound)
    }
  }, [location.pathname])

  // Helper to find node by path
  const findNode = (path: string): NavNode | null => {
    if (path === '/' || path === '') return root
    const parts = path.split('/').filter(Boolean)
    let current = root
    for (const part of parts) {
      if (current.children[part]) {
        current = current.children[part]
      } else {
        return null
      }
    }
    return current
  }

  const currentNode = findNode(currentBrowsingPath) || root
  const parentPath = currentBrowsingPath === '/' ? null : '/' + currentBrowsingPath.split('/').filter(Boolean).slice(0, -1).join('/')

  return (
    <nav className="flex flex-col gap-1 overflow-y-auto custom-scrollbar flex-1 pr-1 font-mono text-sm">
      <div className="text-[10px] mb-2 opacity-30 border-b border-green-900 pb-1 flex justify-between uppercase">
        <span>PATH: {currentBrowsingPath}</span>
        <span>DIR_NAV_v3</span>
      </div>
      
      {/* UP DIRECTORY */}
      {parentPath !== null && (
        <button
          onClick={() => setCurrentBrowsingPath(parentPath)}
          className="px-2 py-0.5 text-left transition-all flex items-center gap-2 hover:bg-green-900/30 text-green-700"
        >
          <span className="text-[10px] opacity-40">[D]</span>
          .. (UP_DIR)
        </button>
      )}

      {/* DASHBOARD if at root */}
      {currentBrowsingPath === '/' && (
        <Link
          to="/"
          className={`px-2 py-0.5 transition-all flex items-center gap-2 ${
            location.pathname === '/' ? 'bg-[var(--terminal-green)] text-[var(--terminal-bg)] font-bold' : 'hover:bg-green-900/30'
          }`}
        >
          <span className="text-[10px] opacity-40">[F]</span>
          DASHBOARD.SYS
        </Link>
      )}

      {/* DIRECTORY CONTENTS */}
      {Object.entries(currentNode.children)
        .sort(([, a], [, b]) => {
          // Files (isFolder = false) first, then directories (isFolder = true)
          if (a.isFolder !== b.isFolder) return a.isFolder ? 1 : -1
          return a.name.localeCompare(b.name)
        })
        .map(([key, child]) => {
          const isCurrentPage = child.path && location.pathname === child.path
          
          if (child.isFolder) {
            return (
              <button
                key={key}
                onClick={() => setCurrentBrowsingPath(child.fullPath)}
                className="px-2 py-0.5 text-left transition-all flex items-center gap-2 hover:bg-green-900/30 bg-transparent text-[var(--terminal-green)] border-none cursor-pointer w-full"
              >
                <span className="text-[10px] opacity-40 font-mono">[D]</span>
                <span className="truncate">{child.name}</span>
              </button>
            )
          }

          return (
            <Link
              key={key}
              to={child.path || '#'}
              className={`px-2 py-0.5 transition-all flex items-center gap-2 group truncate ${
                isCurrentPage
                  ? 'bg-[var(--terminal-green)] text-[var(--terminal-bg)] font-bold'
                  : 'hover:bg-green-900/30'
              }`}
            >
              <span className="text-[10px] opacity-40">[F]</span>
              <span className="truncate">{child.name}</span>
            </Link>
          )
        })
      }

      <div className="mt-auto pt-4 text-[9px] opacity-20 italic leading-tight">
        SELECT_OBJECT_TO_ACCESS<br />
        RESTRICTED_ACCESS_ONLY
      </div>
    </nav>
  )
}
