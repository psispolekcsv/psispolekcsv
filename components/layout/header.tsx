"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { assets } from "@/lib/assets";
import { mainNav, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function itemActive(pathname: string, item: NavItem) {
  if (item.href && isActive(pathname, item.href)) return true;
  return item.children?.some((child) => isActive(pathname, child.href)) ?? false;
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedMenu, setOpenedMenu] = useState<string | null>(null);
  const [pinnedMenu, setPinnedMenu] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
    setOpenedMenu(null);
    setPinnedMenu(false);
  }, [pathname]);

  useEffect(() => {
    if (!pinnedMenu) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenedMenu(null);
        setPinnedMenu(false);
      }
    };
    const outside = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const nav = document.querySelector("[aria-label='Hlavní navigace']");
      if (nav && !nav.contains(target)) {
        setOpenedMenu(null);
        setPinnedMenu(false);
      }
    };
    document.addEventListener("keydown", close);
    document.addEventListener("mousedown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("mousedown", outside);
    };
  }, [pinnedMenu]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image src={assets.logo} alt="Znak Klubu československého vlčáka" width={52} height={52} priority className="h-12 w-12" />
          <span className="hidden font-serif text-lg leading-tight text-ink-deep sm:block">
            Klub
            <span className="block text-sm font-sans tracking-wide text-ink/70">československého vlčáka</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Hlavní navigace">
          {mainNav.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenedMenu(item.label)}
                onMouseLeave={() => {
                  if (!pinnedMenu) setOpenedMenu(null);
                }}
              >
                <button
                  type="button"
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-semibold",
                    itemActive(pathname, item) ? "bg-ink text-white" : "text-ink hover:bg-mist",
                  )}
                  aria-expanded={openedMenu === item.label}
                  aria-controls={`${menuId}-${item.label}`}
                  onClick={() => {
                    if (pinnedMenu && openedMenu === item.label) {
                      setOpenedMenu(null);
                      setPinnedMenu(false);
                      return;
                    }
                    setPinnedMenu(true);
                    setOpenedMenu(item.label);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setOpenedMenu(null);
                      setPinnedMenu(false);
                    }
                  }}
                >
                  {item.label}
                  <span className={cn("ml-2 inline-block h-1.5 w-1.5 rounded-full", itemActive(pathname, item) ? "bg-amber" : "bg-transparent")} />
                </button>
                {openedMenu === item.label ? (
                  <div id={`${menuId}-${item.label}`} className="absolute left-0 top-full z-20 min-w-64 pt-2">
                    <ul className="rounded-lg border border-line bg-white p-2 shadow-[0_18px_40px_-28px_rgba(24,24,24,0.7)]">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm",
                              isActive(pathname, child.href) ? "bg-ink text-white" : "hover:bg-mist",
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href || "/"}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-semibold",
                  item.href && isActive(pathname, item.href) ? "bg-ink text-white" : "text-ink hover:bg-mist",
                )}
                aria-current={item.href && pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ),
          )}
          <Link href="/kontakty" className="ml-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white hover:bg-ink-deep">
            Kontakty
          </Link>
        </nav>

        <button
          type="button"
          className="ml-auto inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold lg:hidden"
          aria-expanded={open}
          aria-controls="mobilni-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
          Menu
        </button>
      </div>

      {open ? (
        <div id="mobilni-menu" className="fixed inset-x-0 bottom-0 top-[73px] z-50 overflow-y-auto bg-paper px-4 py-4 lg:hidden">
          <nav aria-label="Mobilní navigace" className="space-y-2 pb-16">
            {mainNav.map((item) => (
              <div key={item.label} className="rounded-lg border border-line bg-white">
                {item.href && !item.children ? (
                  <Link href={item.href} className="block px-4 py-3 font-semibold">
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <p className="border-b border-line px-4 py-3 font-semibold">{item.label}</p>
                    <ul>
                      {item.children?.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href} className="block px-4 py-3 text-ink/90">
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
            <Link href="/kontakty" className="block rounded-lg bg-ink px-4 py-3 text-center font-semibold text-white">
              Kontakty
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
