import { ArrowUpIcon, ListBulletsIcon } from "@phosphor-icons/react";
import { useActiveSection } from "./use-active-section";

export interface TocItem {
  id: string;
  text: string;
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useActiveSection(items.map((item) => item.id));

  if (items.length < 2) return null;

  return (
    <nav aria-label="On this page">
      <p className="toc-title">
        <ListBulletsIcon className="size-3.5" />
        On this page
      </p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              onClick={() => setActive(item.id)}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
      <a className="toc-top" href="#main">
        <ArrowUpIcon className="size-3.5" />
        Back to top
      </a>
    </nav>
  );
}
