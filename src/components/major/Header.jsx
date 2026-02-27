"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { WP_BASE } from "@/config";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState([]);
  const [logo, setLogo] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const base = WP_BASE.replace("/wp/v2", "");
    const fetchHeaderData = async () => {
      try {
        const [menuRes, optionsRes] = await Promise.all([
          fetch(`${base}/hoild/v1/menu`, { cache: "no-store" }),
          fetch(`${base}/hoild/v1/header-options`, { cache: "no-store" }),
        ]);
        if (menuRes.ok) setMenu(await menuRes.json());
        if (optionsRes.ok) {
          const optionsData = await optionsRes.json();
          setLogo(optionsData?.website_logo || null);
        }
      } catch (error) {
        console.error("Failed to fetch header data:", error);
      }
    };
    fetchHeaderData();
  }, []);

  const buildMenuTree = (items) => {
    const map = {};
    const roots = [];
    items.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });
    items.forEach((item) => {
      if (item.parent && item.parent !== 0 && item.parent !== "0" && map[item.parent]) {
        map[item.parent].children.push(map[item.id]);
      } else if (!item.parent || item.parent === 0 || item.parent === "0") {
        roots.push(map[item.id]);
      }
    });
    return roots;
  };

  const menuTree = buildMenuTree(menu);
  const rightMenuItems = menuTree.slice(-2);
  const centerMenuItems = menuTree.slice(0, -2);

  const toggleSubmenu = (id) => setOpenSubmenu(openSubmenu === id ? null : id);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[linear-gradient(90deg,#0a1a63_0%,#06154f_55%,#031141_100%)] shadow-lg backdrop-blur-md"
          : "bg-transparent"
      }`}
      style={{ borderBottom: "1px solid rgba(255,255,255,0.30)" }}
    >
      <nav className="w-full relative">
        <div className="flex items-center h-16">
          {/* LEFT: LOGO (inside container) */}
          <div className="web-width mx-auto px-6 flex items-center justify-between w-full">
            <div className="flex items-center shrink-0">
              {logo?.url ? (
                <Link href="/">
                  <div className="relative w-[140px] h-[40px]">
                    <Image
                      src={logo.url}
                      alt="Website Logo"
                      fill
                      sizes="140px"
                      className="object-contain"
                      priority
                    />
                  </div>
                </Link>
              ) : (
                <Link href="/" className="text-2xl font-bold text-white">
                  Holid.
                </Link>
              )}
            </div>

            {/* CENTER: MENU (inside container, centered) */}
            <ul className="hidden lg:flex items-center gap-10 text-white">
              {centerMenuItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                return (
                  <li key={item.id} className="relative group">
                    <Link
                      href={item.url}
                      className="flex items-center gap-2 py-2 text-white text-base font-normal leading-normal font-sans hover:text-white/90 transition-colors"
                    >
                      {item.title}
                      {hasChildren && (
                        <span className="text-lg leading-none transition-transform duration-300 group-hover:rotate-45">
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M7.02595 1.21868e-06V5.97445H13V7.02627L7.02595 7.02556V13H5.97407L5.97478 7.02556H0V5.97445H5.97405L5.97476 0L7.02595 1.21868e-06Z" fill="white"/>
                    </svg>
                        </span>
                      )}
                    </Link>
                    {hasChildren && (
                      <ul className="absolute left-0 top-full pt-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-[100]">
                        <div className="bg-[#000821] border border-white/10 rounded-lg shadow-xl py-2">
                          {item.children.map((child) => (
                            <li key={child.id}>
                              <Link
                                href={child.url}
                                className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                              >
                                {child.title}
                              </Link>
                            </li>
                          ))}
                        </div>
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Spacer to push right items outside container visually */}
            <div className="hidden lg:block w-[140px] shrink-0" />
          </div>

          {/* RIGHT: ACTION ITEMS (outside container, positioned absolute right) */}
          <div className="hidden lg:flex absolute right-0 top-0 h-16 items-center">
            {rightMenuItems.map((item, index) => (
              <Link
                key={item.id}
                href={item.url}
                className={
                  index === rightMenuItems.length - 1
                    ? "h-full px-7 flex items-center bg-[#2d59ff] hover:bg-[#3a66ff] text-white text-base font-normal leading-normal font-sans transition-colors"
                    : "h-full px-7 flex items-center text-white text-base font-normal leading-normal font-sans hover:text-white/90 transition-colors"
                }
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className="lg:hidden absolute right-6 text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`lg:hidden bg-[#000821] overflow-hidden transition-all duration-300 ${
            mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="px-6 py-4">
            {centerMenuItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              return (
                <li key={item.id} className="border-b border-white/10 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.url}
                      className="py-3 text-white text-base font-normal leading-normal font-sans hover:text-white/90 transition-colors flex-1"
                      onClick={() => !hasChildren && setMobileOpen(false)}
                    >
                      {item.title}
                    </Link>
                    {hasChildren && (
                      <button
                        onClick={() => toggleSubmenu(item.id)}
                        className="p-3 text-white/70 hover:text-white transition-colors"
                        aria-label={`Toggle ${item.title} submenu`}
                      >
                        <span
                          className={`inline-block transition-transform duration-200 ${
                            openSubmenu === item.id ? "rotate-45" : ""
                          } text-xl leading-none`}
                        >
                          +
                        </span>
                      </button>
                    )}
                  </div>
                  {hasChildren && (
                    <ul
                      className={`pl-4 overflow-hidden transition-all duration-300 ${
                        openSubmenu === item.id ? "max-h-96 pb-2" : "max-h-0"
                      }`}
                    >
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={child.url}
                            className="block py-2 text-sm text-white/60 hover:text-white transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            {rightMenuItems.map((item, index) => (
              <li key={item.id} className="border-b border-white/10 last:border-b-0">
                <Link
                  href={item.url}
                  className={`block py-3 transition-colors ${
                    index === rightMenuItems.length - 1
                      ? "text-white text-base font-normal leading-normal font-sans"
                      : "text-white text-base font-normal leading-normal font-sans hover:text-white/90"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
