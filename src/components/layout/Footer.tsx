import Link from "next/link";

const FOOTER_LINKS = {
  Platform: [
    { href: "/issues", label: "Browse Issues" },
    { href: "/trending", label: "Trending Australia" },
    { href: "/suggest", label: "Suggest a Fix" },
    { href: "/report", label: "Report an Issue" },
  ],
  Community: [
    { href: "/join", label: "Join NationLovers" },
    { href: "/join#citizen", label: "Citizen Reporter" },
    { href: "/join#volunteer", label: "Volunteer" },
    { href: "/join#expert", label: "Verified Expert" },
  ],
  Info: [
    { href: "/about", label: "About NationLovers" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/contact", label: "Contact Support" },
    { href: "/admin", label: "Admin Panel" },
  ],
};

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

export function Footer() {
  return (
    <footer className="bg-footer-gradient border-t-2 border-gold mt-16">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🇦🇺</span>
              <span className="font-bold text-white text-lg">
                Nation<span className="text-gold">Lovers</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Australia&apos;s civic voice. Report issues. Suggest solutions. Drive real change — issue by issue, solution by solution.
            </p>
            <p className="text-white/40 text-xs">
              &quot;Built for Australians. Driven by Australians.&quot;
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-gold font-semibold text-sm mb-3 uppercase tracking-wider">
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* States row */}
        <div className="border-t border-white/10 pt-6 mb-6">
          <p className="text-white/40 text-xs mb-3">Browse by state:</p>
          <div className="flex flex-wrap gap-2">
            {STATES.map((state) => (
              <Link
                key={state}
                href={`/issues?state=${state}`}
                className="text-xs bg-white/10 hover:bg-white/20 text-white/70 hover:text-white px-3 py-1 rounded-full transition-colors"
              >
                {state}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs text-center md:text-left">
            © 2024 NationLovers Australia. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            🇦🇺 Made with love for Australia
          </p>
        </div>
      </div>
    </footer>
  );
}
