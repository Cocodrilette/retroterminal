// src/components/AutoIndex.tsx
import { Link } from 'react-router-dom';

export default function AutoIndex() {
  // 1. Escaneamos todos los archivos .md, .mdx, .tsx y .jsx en la carpeta pages
  // eager: true carga los módulos inmediatamente para acceder a sus metadatos
  const modules = import.meta.glob('../pages/**/*.{md,mdx,tsx,jsx}', { eager: true });

  const posts = Object.entries(modules).map(([path, module]: [string, any]) => {
    // 2. Limpiamos la ruta para convertirla en una URL de navegación
    // De: "../pages/blog/mi-post.mdx" -> A: "/blog/mi-post"
    const slug = path
      .replace('../pages', '')
      .replace(/\.(md|mdx|tsx|jsx)$/, '')
      .replace(/\/index$/, '') || '/';

        return {
          slug,
          title: module.frontmatter?.title || slug.split('/').pop()?.replace(/-/g, ' '),
          date: module.frontmatter?.date || 'SYS_UNKNOWN_DATE'
        };
      });
    
      const filteredPosts = posts.filter(post => post.slug !== '/');
    
      return (
        <nav className="not-prose mt-8 terminal-box p-4">
          <h3 className="text-xs opacity-50 mb-4 underline">SYSTEM_INDEX</h3>
          <ul className="space-y-4">
            {filteredPosts.map((post) => (
              <li key={post.slug} className="border-b border-green-900 pb-2 hover:bg-green-900 group transition-colors">
                <Link to={post.slug} className="flex justify-between items-center px-2">
                  <h2 className="text-xl font-bold uppercase tracking-tight group-hover:pl-2 transition-all">
                    {post.title}
                  </h2>
                  <p className="text-xs opacity-50 tabular-nums">[{post.date}]</p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      );
    }
    