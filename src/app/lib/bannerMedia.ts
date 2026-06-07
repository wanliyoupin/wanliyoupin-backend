export type BannerMediaItem = {
  file_type?: string;
  file_url: string;
  title?: string;
  link?: string;
  sort?: number;
};

export function isBannerVideo(banner: BannerMediaItem | string | null | undefined): boolean {
  if (!banner || typeof banner === "string") return false;
  const ft = (banner.file_type ?? "").toLowerCase();
  if (ft === "video" || ft.startsWith("video/")) return true;
  const url = (banner.file_url ?? "").toLowerCase();
  return /\.(mp4|webm|mov|m4v|mkv)(\?|#|$)/i.test(url);
}

export function inferBannerFileType(banner: BannerMediaItem | string): "image" | "video" {
  if (typeof banner === "string") return "image";
  return isBannerVideo(banner) ? "video" : "image";
}

export function normalizeBannerItem(b: unknown, sortFallback = 0): BannerMediaItem {
  if (typeof b === "string") {
    return { file_type: "image", file_url: b, title: "", link: "", sort: sortFallback };
  }
  const x = (b ?? {}) as BannerMediaItem;
  const file_url = x.file_url || "";
  const item: BannerMediaItem = {
    file_url,
    title: x.title || "",
    link: x.link || "",
    sort: x.sort ?? sortFallback,
  };
  item.file_type = x.file_type ?? (isBannerVideo({ ...item, file_type: x.file_type }) ? "video" : "image");
  return item;
}
