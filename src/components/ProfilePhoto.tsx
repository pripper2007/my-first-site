import Image from "next/image";

/**
 * Small profile photo displayed next to the name in the header.
 * Uses a placeholder SVG for now — swap the src for a real photo later.
 */
export default function ProfilePhoto() {
  return (
    <Image
      src="/images/pedro-ripper.png"
      alt="Pedro Ripper"
      width={80}
      height={80}
      priority
      className="rounded-full w-[64px] h-[64px] md:w-[80px] md:h-[80px] shrink-0"
    />
  );
}
