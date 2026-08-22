import { siteConfig } from "@/siteConfig";
import { getAlbums } from "@/lib/content-repository";
import PhotoWallClient from "./PhotoWallClient";

export const metadata = {
  title: "照片墙 | " + siteConfig.title,
};

export default async function PhotoWallPage() {
  const albums = await getAlbums();
  return <PhotoWallClient albums={albums} />;
}
