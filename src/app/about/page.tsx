import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="container-page py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-semibold text-green-700">ABOUT SHOPNEST</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
          Making online shopping feel more human.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          ShopNest connects buyers with independent sellers through a simple,
          secure, and friendly marketplace.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          ["Trust", "Clear product information and a safer marketplace for everyone."],
          ["Quality", "Thoughtfully selected products from passionate sellers."],
          ["Community", "A place where small businesses can grow."],
        ].map(([title, description]) => (
          <article key={title} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-bold text-green-800">{title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{description}</p>
          </article>
        ))}
      </div>

      <div className="mt-16 rounded-3xl bg-green-900 px-8 py-12 text-center text-white">
        <h2 className="text-3xl font-bold">Have something great to sell?</h2>
        <p className="mx-auto mt-3 max-w-xl text-green-100">
          Create a seller account and start building your shop on ShopNest.
        </p>
        <Link
          href="/register"
          className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-green-900 hover:bg-green-50"
        >
          Become a Seller
        </Link>
      </div>
    </section>
  );
}