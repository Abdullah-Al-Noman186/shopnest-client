import Link from "next/link";
// import { Facebook, Github, Instagram, ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="grid size-9 place-items-center rounded-xl bg-green-700">
              {/* <ShoppingBag size={19} /> */}
            </span>
            ShopNest
          </Link>
          <p className="mt-4 max-w-xs leading-7 text-slate-400">
            A simple, trusted marketplace for discovering and selling great
            products.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white">Explore</h3>
          <div className="mt-4 flex flex-col gap-3">
            <Link href="/products" className="hover:text-green-400">Products</Link>
            <Link href="/about" className="hover:text-green-400">About Us</Link>
            <Link href="/contact" className="hover:text-green-400">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white">For Sellers</h3>
          <div className="mt-4 flex flex-col gap-3">
            <Link href="/register" className="hover:text-green-400">Start Selling</Link>
            <Link href="/login" className="hover:text-green-400">Seller Login</Link>
            <Link href="/dashboard" className="hover:text-green-400">Seller Dashboard</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white">Stay Connected</h3>
          <p className="mt-4">hello@shopnest.com</p>
          <div className="mt-5 flex gap-4">
            <a href="https://github.com" aria-label="GitHub" className="hover:text-green-400">
                {/* <Github size={21} /> */}
            </a>
            <a href="https://facebook.com" aria-label="Facebook" className="hover:text-green-400">
              {/* <Facebook size={21} /> */}
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-green-400">
              {/* <Instagram size={21} /> */}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container-page py-5 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} ShopNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}