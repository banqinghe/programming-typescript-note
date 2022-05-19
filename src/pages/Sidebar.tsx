import { Link, useLocation } from 'react-router-dom';
import chapters from '../config/chapters.json';
import cn from 'classnames';

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="min-w-max border-r hidden md:block">
      <ul
        className="sticky top-[var(--header-height)] py-4 text-base space-y-1"
        style={{ fontFamily: 'Helvetica' }}
      >
        {chapters.map(item => (
          <li
            key={item.link}
            className={cn('border-l-4 hover:bg-[#fbfbfb]', {
              'border-indigo-300 text-indigo-500':
                location.pathname === item.link,
              'border-transparent': location.pathname !== item.link,
            })}
          >
            <Link className="block px-6 py-3 " to={item.link}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
