/** Soft navy layer so the blurred field photos look deliberate next to sharper images. */
export function FieldPhotoTint({ src }: { src?: string }) {
  if (!src?.includes("/pointbridge/field/")) return null;

  return <div aria-hidden className="pointer-events-none absolute inset-0 bg-[oklch(0.24_0.07_260/0.22)]" />;
}
