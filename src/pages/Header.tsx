import { IconGithub, IconTypeScriptText, IconContent } from '../icons';
import { Link } from 'react-router-dom';
import cn from 'classnames';

interface ListItemProps {
  link: string;
  nativeLink?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function ListLink(props: ListItemProps) {
  const { link, nativeLink = false, children, className = '' } = props;
  return (
    <>
      {nativeLink ? (
        <a
          className={cn(
            'block py-2 px-4 hover:bg-light-400 rounded',
            className
          )}
          target="_blank"
          href={link}
        >
          {children}
        </a>
      ) : (
        <Link
          className={cn(
            'block py-2 px-4 hover:bg-light-400 rounded',
            className
          )}
          to={link}
        >
          {children}
        </Link>
      )}
    </>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex justify-between items-center h-[var(--header-height)] px-4 md:px-8 bg-white border-b">
      <h1
        className="flex items-center gap-4 text-lg text-bg-gray-700"
        style={{ fontFamily: 'Consolas' }}
      >
        Programming
        <IconTypeScriptText className="transform scale-x-110 text-2xl" />
        <sup>Note</sup>
      </h1>
      <a
        className="hidden md:inline"
        href="https://github.com/banqinghe/programming-typescript-note/"
        target="_blank"
      >
        <IconGithub style={{ fontSize: 24 }} />
      </a>

      <div className="dropdown dropdown-end !md:hidden ">
        <button className="btn m-1">
          <IconContent className="text-[24px]" />
        </button>
        <ul
          tabIndex={0}
          className="dropdown-content menu px-2 py-2 shadow bg-white rounded w-max"
        >
          <li>
            <ListLink link="/">Intro</ListLink>
          </li>
          <li>
            <ListLink link="/chapter3">Chapter 3: All Types</ListLink>
          </li>
          <li>
            <ListLink link="/chapter4">Chapter 4: Function</ListLink>
          </li>
          <li>
            <hr className="my-1" />
            <ListLink
              nativeLink
              link="https://github.com/banqinghe/programming-typescript-note/"
              className="flex justify-center items-center gap-3"
            >
              <IconGithub className="text-lg" />
              GitHub
            </ListLink>
          </li>
        </ul>
      </div>
    </header>
  );
}
