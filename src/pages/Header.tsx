import { IconGithub, IconTypeScriptText } from '../icons';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex justify-between items-center h-[var(--header-height)] px-4 md:px-8 bg-white border-b">
      <h1
        className="flex items-center gap-4 text-lg text-bg-gray-700"
        style={{ fontFamily: 'Consolas' }}
      >
        Programming
        <IconTypeScriptText
          className="transform scale-x-110"
          style={{ fontSize: 22 }}
        />
        <sup>Note</sup>
        {/* <sub>Note</sub> */}
      </h1>
      <a href="https://github.com/banqinghe/programming-typescript-note/">
        <IconGithub style={{ fontSize: 24 }} />
      </a>
    </header>
  );
}
