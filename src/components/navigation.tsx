import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BananaLogo = () => {
  return (
    <div className="flex items-center space-x-2 mb-6 mt-4">
      <motion.div
        className="banana-animation"
        animate={{
          rotate: [0, 15, 0, -15, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img src="/timeline-images/gudetama.gif" alt="Gudetama" className="w-8 h-8 object-contain" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-2xl font-light tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-300"
      >
        banana chen
      </motion.h1>
    </div>
  );
};

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

const NavLink = ({ href, label, isActive }: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "relative px-3 py-1 transition-colors duration-200 text-base font-light tracking-wide rounded-md hover:bg-white/50",
        isActive
          ? "text-blue-500"
          : "text-gray-600 hover:text-gray-800"
      )}
    >
      {label.toLowerCase()}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-blue-400 to-purple-300"
          layoutId="underline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      )}
    </Link>
  );
};

const Navigation = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "our story" },
    { href: "/music", label: "music" },
    { href: "/letters", label: "letters" },
  ];

  return (
    <header className="border-b border-gray-200 pb-2 mb-6 max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between">
        <BananaLogo />
        <nav className="flex space-x-6">
          {links.map((link) => {
            // For home page, only match the exact path
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={isActive}
              />
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
