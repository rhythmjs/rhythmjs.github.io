import { useCallback, useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";

interface PagefindSubResult {
  title: string;
  url: string;
  excerpt: string;
}

interface PagefindData {
  url: string;
  excerpt: string;
  meta: { title?: string; group?: string };
  sub_results: PagefindSubResult[];
}

interface Pagefind {
  options(options: { baseUrl: string }): Promise<void>;
  debouncedSearch(
    query: string,
    options?: object,
    wait?: number,
  ): Promise<{ results: { data(): Promise<PagefindData> }[] } | null>;
}

interface Hit {
  url: string;
  title: string;
  group: string;
  excerpt: string;
}

type Status = "idle" | "loading" | "unavailable" | "ready";

const PAGEFIND_URL = "/pagefind/pagefind.js";
const MAX_HITS = 8;

let pagefind: Promise<Pagefind> | undefined;

function loadPagefind(): Promise<Pagefind> {
  pagefind ??= import(/* @vite-ignore */ PAGEFIND_URL).then(async (mod: Pagefind) => {
    await mod.options({ baseUrl: "/" });
    return mod;
  });
  return pagefind;
}

async function search(query: string): Promise<Hit[] | null> {
  const engine = await loadPagefind();
  const response = await engine.debouncedSearch(query, {}, 120);
  if (response === null) return null;
  const pages = await Promise.all(response.results.slice(0, MAX_HITS).map((result) => result.data()));
  return pages.map((page) => {
    const section = page.sub_results.find((sub) => sub.url.includes("#")) ?? page.sub_results[0];
    return {
      url: section?.url ?? page.url,
      title: page.meta.title ?? section?.title ?? page.url,
      group: page.meta.group ?? "",
      excerpt: section?.excerpt ?? page.excerpt,
    };
  });
}

export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [shortcut, setShortcut] = useState("Ctrl K");

  const openDialog = useCallback(() => setOpen(true), []);

  useEffect(() => {
    setShortcut(/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘ K" : "Ctrl K");
    const onKey = (event: KeyboardEvent) => {
      const typing = (event.target as HTMLElement | null)?.closest("input, textarea, select, [contenteditable]");
      if ((event.key === "k" && (event.metaKey || event.ctrlKey)) || (event.key === "/" && !typing)) {
        event.preventDefault();
        openDialog();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openDialog]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setHits([]);
      setStatus("idle");
      return;
    }
    let cancelled = false;
    setStatus("loading");
    search(trimmed)
      .then((found) => {
        if (cancelled || found === null) return;
        setHits(found);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("unavailable");
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  const go = (url: string) => {
    setOpen(false);
    window.location.assign(url);
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="min-w-8 justify-between gap-3 px-2 md:min-w-52"
        onClick={openDialog}
        aria-label="Search documentation"
      >
        <span className="flex items-center gap-2 text-muted-foreground">
          <MagnifyingGlassIcon />
          <span className="hidden md:inline">Search docs</span>
        </span>
        <Kbd className="hidden md:inline-flex">{shortcut}</Kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search documentation"
        description="Search guides, the tutorial and every package."
        className="top-[12vh] translate-y-0 sm:max-w-2xl"
      >
        <Command shouldFilter={false} loop>
          <CommandInput value={query} onValueChange={setQuery} placeholder="Search the documentation" />
          <CommandList className="max-h-[min(26rem,60vh)]">
            <CommandEmpty className="px-6 py-8 text-center text-muted-foreground">
              {status === "loading" && "Searching…"}
              {status === "idle" && "Type to search the landing page, the tutorial and every package."}
              {status === "ready" && `No results for “${query.trim()}”.`}
              {status === "unavailable" && (
                <>
                  The search index is created by a production build. Run <code>bun run build && bun run preview</code>{" "}
                  to try it locally.
                </>
              )}
            </CommandEmpty>
            {hits.length > 0 && (
              <CommandGroup heading="Results">
                {hits.map((hit) => (
                  <CommandItem
                    key={hit.url}
                    value={hit.url}
                    onSelect={() => go(hit.url)}
                    className="flex-col items-start gap-0.5 py-2"
                  >
                    <span className="flex flex-wrap items-baseline gap-x-2 font-semibold">
                      {hit.title}
                      {hit.group && (
                        <span className="text-[10px] font-medium tracking-wider text-primary uppercase">
                          {hit.group}
                        </span>
                      )}
                    </span>
                    <span
                      className="line-clamp-2 font-sans text-muted-foreground [&_mark]:bg-primary/25 [&_mark]:text-foreground"
                      dangerouslySetInnerHTML={{ __html: hit.excerpt }}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
