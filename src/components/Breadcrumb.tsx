import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeNameMap: Record<string, string> = {
  '': 'होम',
  'journal': 'शोध पत्रिका',
  'library': 'डिजिटल पुस्तकालय',
  'pawari': 'पवारी भाषा',
  'dictionary': 'शब्दकोश',
  'grammar': 'व्याकरण',
  'lokgeet': 'लोकगीत',
  'paheli': 'पहेलियाँ',
  'gotra': 'गोत्र एवं वंशावली',
  'gotras': 'गोत्र एवं वंशावली',
  'quiz': 'क्विज़ एवं प्रमाण-पत्र',
  'sitemap': 'साइट मैप',
  'sansthan': 'संस्थान परिचय',
  'gallery': 'चित्र दीर्घा',
  'events': 'कार्यक्रम एवं सूचनाएँ',
  'submit-paper': 'शोध पत्र सबमिशन',
  'admin': 'एडमिन डैशबोर्ड',
};

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Do not show breadcrumb on home page
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <ol className="flex items-center space-x-2 text-xs font-serif text-stone-600 dark:text-stone-400">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-amber-700 dark:hover:text-amber-400 transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>होम</span>
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = routeNameMap[value] || decodeURIComponent(value);

          return (
            <li key={to} className="flex items-center space-x-2">
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              {isLast ? (
                <span className="font-bold text-amber-900 dark:text-amber-200 truncate max-w-[200px]" aria-current="page">
                  {label}
                </span>
              ) : (
                <Link
                  to={to}
                  className="hover:text-amber-700 dark:hover:text-amber-400 transition truncate max-w-[150px]"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
