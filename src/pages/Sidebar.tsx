import { Link, useLocation } from 'react-router-dom';
import cn from 'classnames';

const links = [
  { label: 'Intro', link: '/' },
  { label: 'Chapter 3: 类型全解', link: '/chapter3' },
  { label: 'Chapter 4: 函数', link: '/chapter4' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="min-w-max border-r hidden md:block">
      <ul
        className="sticky top-[var(--header-height)] py-4 text-base space-y-1"
        style={{ fontFamily: 'Helvetica' }}
      >
        {links.map(item => (
          <li
            key={item.link}
            className={cn('border-l-4 hover:bg-[#fbfbfb]', {
              'border-indigo-300 text-indigo-500':
                location.pathname === item.link,
              'border-transparent': location.pathname !== item.link,
            })}
          >
            <Link className="block px-6 py-3 " to={item.link}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
