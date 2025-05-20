import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { siteConfig } from "@/config/site";

// Wedding navbar component
export const Navbar = () => {
  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      className="bg-opacity-90 backdrop-blur-sm pt-4 pb-2"
    >
      {/* Left side navigation */}
      <NavbarContent className="flex-none" justify="center">
        <div className="hidden sm:flex gap-4 items-center">
          {siteConfig.navItems
            .slice(0, Math.ceil(siteConfig.navItems.length / 2))
            .map((item) => (
              <NavbarItem key={item.href}>
                <Link
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                    "hover:text-primary transition-colors"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            ))}
        </div>
      </NavbarContent>

      {/* Center content with names */}
      <NavbarContent className="flex-none" justify="center">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex flex-col justify-center items-center py-2"
            color="foreground"
            href="/"
          >
            <div
              className="font-script text-4xl font-medium text-primary relative mt-6"
              style={{
                transform: "rotate(-8deg)",
                fontFamily: "'Pinyon Script', 'Dancing Script', cursive",
              }}
            >
              Daniel & Kendall
            </div>
            <div className="text-xs tracking-widest uppercase mt-2 mb-1 text-foreground-500">
              OCTOBER 9TH, 2026
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Right side navigation */}
      <NavbarContent className="flex-none" justify="center">
        <div className="hidden sm:flex gap-4 items-center">
          {siteConfig.navItems
            .slice(Math.ceil(siteConfig.navItems.length / 2))
            .map((item) => (
              <NavbarItem key={item.href}>
                <Link
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium",
                    "hover:text-primary transition-colors"
                  )}
                  color="foreground"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </NavbarItem>
            ))}
        </div>
        <NavbarMenuToggle className="sm:hidden" />
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu className="pt-10">
        <div className="mx-4 flex flex-col gap-2 items-center">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color="foreground"
                className="w-full text-center text-lg py-2"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
