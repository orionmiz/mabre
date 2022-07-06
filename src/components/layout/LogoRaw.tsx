import Image from "next/image";
import LogoImage from "~/public/logo_raw.png";

export default function Logo() {
  return <Image src={LogoImage} alt="LogoRaw" />;
}
