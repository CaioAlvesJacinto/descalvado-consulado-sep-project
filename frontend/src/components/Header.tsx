
import Logo from "./header/Logo";
import Navigation from "./header/Navigation";
import UserMenu from "./header/UserMenu";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <Navigation />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
