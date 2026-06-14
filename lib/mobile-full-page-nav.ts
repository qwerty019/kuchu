/** Мобилка: обход intercept (@modal), полная подгрузка страницы в {children}. */
export function isMobileViewport(): boolean {
  return (
    typeof window !== "undefined" &&
    !window.matchMedia("(min-width: 1024px)").matches
  );
}

export function navigateMobileFullPage(
  href: string,
  options?: { reloadIfSameUrl?: boolean },
): void {
  if (typeof window === "undefined") return;

  const url = new URL(href, window.location.origin);
  const target = url.pathname + url.search + url.hash;
  const current =
    window.location.pathname +
    window.location.search +
    window.location.hash;

  if (current === target) {
    if (options?.reloadIfSameUrl) {
      window.location.reload();
    }
    return;
  }

  window.location.assign(target);
}
