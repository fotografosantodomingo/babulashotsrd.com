import ReactDOM from "react-dom";
import { assetPath } from "@/lib/seo";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  mobileSrc?: string;
  mobileWidth?: number;
  mobileHeight?: number;
};

const DESKTOP_BP = "(min-width: 901px)";

export function HeroImage({ src, alt }: Props) {
  const desktop = assetPath(src);
  ReactDOM.preload(desktop, { as: "image", fetchPriority: "high", media: DESKTOP_BP } as Parameters<typeof ReactDOM.preload>[1]);
  const cssEscape = (s: string) => s.replace(/"/g, "%22");
  const style = { "--hero-bg-desktop": `url("${cssEscape(desktop)}")` } as React.CSSProperties;
  return <div className="hero-image" role="img" aria-label={alt} style={style} />;
}

export function mobileVariantOf(src: string): string {
  return src.replace(/\.webp$/, "-mobile.webp");
}
