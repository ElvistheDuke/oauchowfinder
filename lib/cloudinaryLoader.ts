// lib/cloudinaryLoader.ts (or .js)
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // 1. Check if src is already a full Cloudinary URL or just a Public ID
  // If it's a full URL, we need to extract the part after /upload/
  const isFullUrl = src.includes("res.cloudinary.com");
  const baseUrl = `https://res.cloudinary.com/dwq7l4mpg/image/upload`;

  const publicId = isFullUrl
    ? src.split("/upload/")[1].replace(/^\/?[v\d]+\//, "") // Clean up versioning
    : src;

  // 2. Add transformations:
  // f_auto: converts HEIC to WebP/AVIF
  // q_auto: optimizes file size
  // w_: resizes to the specific width Next.js requests
  const params = [`f_auto`, `q_auto`, `w_${width}`, `c_limit`].join(",");

  return `${baseUrl}/${params}/${publicId}`;
}
