export default function ContactPage() {
  return (
    <section className="container-page py-16">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="font-semibold text-green-700">CONTACT US</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            We would love to hear from you.
          </h1>
          <p className="mt-5 max-w-lg leading-7 text-slate-600">
            Need help with an order, product, or seller account? Send us a
            message and our team will get back to you.
          </p>

          <div className="mt-8 space-y-4 text-slate-700">
            <p><strong>Email:</strong> hello@shopnest.com</p>
            <p><strong>Phone:</strong> +1 (555) 010-2026</p>
            <p><strong>Address:</strong> 100 Market Street, Commerce City</p>
          </div>
        </div>

        <form className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
          <div className="grid gap-5">
            <label className="grid gap-2 font-medium text-slate-700">
              Name
              <input className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700" />
            </label>

            <label className="grid gap-2 font-medium text-slate-700">
              Email
              <input type="email" className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700" />
            </label>

            <label className="grid gap-2 font-medium text-slate-700">
              Subject
              <input className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700" />
            </label>

            <label className="grid gap-2 font-medium text-slate-700">
              Message
              <textarea rows={5} className="resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-green-700" />
            </label>

            <button
              type="button"
              className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}