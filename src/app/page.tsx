"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Star,
  Shield,
  Truck,
  Headphones,
  Clock,
  ArrowRight,
  Quote,
} from "lucide-react";

// -------------------- Data --------------------
const categories = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Sports",
  "Books",
  "Beauty",
];

const features = [
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "All transactions are encrypted and protected.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Get your orders within 2–3 business days.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Our team is here to help around the clock.",
  },
  {
    icon: Star,
    title: "Quality Guarantee",
    desc: "Every product is vetted for excellence.",
  },
];

const services = [
  { title: "Sell on ShopNest", desc: "Reach millions of buyers worldwide." },
  { title: "Bulk Orders", desc: "Special pricing for businesses." },
  { title: "Gift Cards", desc: "Perfect for any occasion." },
];

const stats = [
  { label: "Products Sold", value: 12000, suffix: "+" },
  { label: "Active Sellers", value: 540, suffix: "+" },
  { label: "Happy Customers", value: 8600, suffix: "+" },
  { label: "Countries Served", value: 35, suffix: "" },
];

const testimonials = [
  {
    quote: "ShopNest made it so easy to find unique gifts for my family.",
    author: "Sarah L.",
    role: "Customer",
    rating: 5,
  },
  {
    quote: "I've been selling on ShopNest for 6 months – my sales doubled!",
    author: "James K.",
    role: "Seller",
    rating: 5,
  },
  {
    quote: "The support team is incredibly responsive and helpful.",
    author: "Emily R.",
    role: "Buyer",
    rating: 4,
  },
];

const blogPosts = [
  {
    title: "10 Tips for Selling Online",
    excerpt: "Learn how to grow your store with these proven strategies.",
    date: "May 12, 2025",
  },
  {
    title: "Sustainable Shopping Guide",
    excerpt: "Make eco‑friendly choices without sacrificing style.",
    date: "May 8, 2025",
  },
  {
    title: "How to Spot Quality Products",
    excerpt: "A checklist for buyers to ensure they get the best value.",
    date: "May 1, 2025",
  },
];

// -------------------- Animation Variants --------------------
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

// -------------------- Components --------------------
const SectionHeading = ({
  subtitle,
  title,
  description,
}: {
  subtitle: string;
  title: string;
  description?: string;
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={fadeInUp}
    className="mb-12 text-center"
  >
    <p className="font-semibold uppercase tracking-wider text-green-700">
      {subtitle}
    </p>
    <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h2>
    {description && (
      <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600">
        {description}
      </p>
    )}
  </motion.div>
);

const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const step = Math.max(1, Math.floor(value / (duration / 16)));
      const timer = setInterval(() => {
        start += step;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <span ref={ref} className="text-4xl font-bold text-green-800">
      {count}
      {suffix}
    </span>
  );
};

// -------------------- Main Homepage --------------------
export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [email, setEmail] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // For carousel auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="overflow-hidden">
      {/* ========== HERO SECTION ========== */}
      <section className="relative flex min-h-[60vh] max-h-[70vh] items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        {/* Animated background particles */}
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-green-400/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 5,
                repeat: Infinity,
                repeatType: "mirror",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>

        <div className="container-page relative grid items-center gap-10 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <p className="mb-4 font-semibold text-green-400">
              YOUR MARKETPLACE, YOUR WAY
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Discover products you’ll love on{" "}
              <span className="text-green-500">ShopNest.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Browse unique products, support independent sellers, and start
              selling your own products today.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/products"
                  className="inline-block rounded-xl bg-green-700 px-8 py-3.5 font-semibold text-white transition hover:bg-green-800"
                >
                  Shop Now
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/register"
                  className="inline-block rounded-xl border border-slate-500 px-8 py-3.5 font-semibold transition hover:bg-slate-900"
                >
                  Sell on ShopNest
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="rounded-3xl bg-gradient-to-br from-green-700 to-green-950 p-8 shadow-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
              Featured today
            </p>
            <h2 className="mt-4 text-3xl font-bold">Everything in one nest.</h2>
            <p className="mt-3 text-green-50">
              From everyday essentials to standout finds, ShopNest makes buying
              and selling simple.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-green-200">
              <Clock size={16} />
              <span>New arrivals every week</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={28} className="text-white/60" />
        </motion.div>
      </section>

      {/* ========== CATEGORIES ========== */}
      <section className="container-page py-20">
        <SectionHeading
          subtitle="Explore"
          title="Featured Categories"
          description="Find exactly what you need across our curated collections."
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {categories.map((category) => (
            <motion.div key={category} variants={fadeInUp}>
              <Link
                href={`/products?category=${encodeURIComponent(category)}`}
                className="block rounded-2xl border border-slate-200 bg-white p-5 text-center font-semibold shadow-sm transition hover:-translate-y-1 hover:border-green-700 hover:text-green-700 hover:shadow-md"
              >
                {category}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="bg-slate-50 py-20">
        <div className="container-page">
          <SectionHeading
            subtitle="Why ShopNest"
            title="Built for Buyers and Sellers"
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-slate-600">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== SERVICES ========== */}
      <section className="container-page py-20">
        <SectionHeading
          subtitle="Services"
          title="More Than Just a Marketplace"
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-3"
        >
          {services.map(({ title, desc }) => (
            <motion.div
              key={title}
              variants={fadeInUp}
              className="rounded-2xl border border-slate-200 p-8 text-center transition hover:border-green-700 hover:shadow-lg"
            >
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-slate-600">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ========== STATISTICS ========== */}
      <section className=" py-20 ">
        <div className="container-page text-green-700">
          <SectionHeading
            subtitle="Our Impact"
            title="ShopNest by the Numbers"
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid gap-8 text-center text-white sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map(({ label, value, suffix }) => (
              <motion.div key={label} variants={fadeInUp} className="rounded-2xl  bg-green-700/20 p-6">
                <p className="text-4xl font-bold text-white">
                  <Counter  value={value} suffix={suffix} />
                </p>
                <p className="mt-2 text-sm font-medium uppercase tracking-wider text-green-700">
                  {label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="container-page py-20">
        <SectionHeading subtitle="Testimonials" title="What Our Community Says" />
        <div className="relative mx-auto max-w-3xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl bg-slate-50 p-8 text-center shadow-sm"
            >
              <Quote className="mx-auto mb-4 text-green-600" size={40} />
              <p className="text-lg font-medium text-slate-800">
                “{testimonials[currentTestimonial].quote}”
              </p>
              <div className="mt-4 flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < testimonials[currentTestimonial].rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }
                  />
                ))}
              </div>
              <p className="mt-3 font-semibold text-slate-900">
                {testimonials[currentTestimonial].author}
              </p>
              <p className="text-sm text-slate-500">
                {testimonials[currentTestimonial].role}
              </p>
            </motion.div>
          </AnimatePresence>
          {/* Dots */}
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  idx === currentTestimonial ? "bg-green-700" : "bg-slate-300"
                }`}
                aria-label={`View testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========== BLOG ========== */}
      <section className="bg-slate-50 py-20">
        <div className="container-page">
          <SectionHeading
            subtitle="Insights"
            title="Latest from Our Blog"
            description="Tips, trends, and stories to help you get the most out of ShopNest."
          />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="grid gap-6 md:grid-cols-3"
          >
            {blogPosts.map((post) => (
              <motion.article
                key={post.title}
                variants={fadeInUp}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <p className="text-xs font-medium uppercase text-green-700">
                  {post.date}
                </p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  {post.title}
                </h3>
                <p className="mt-2 text-slate-600">{post.excerpt}</p>
                <Link
                  href="#"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-700 transition hover:text-green-800"
                >
                  Read More <ArrowRight size={14} />
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== NEWSLETTER ========== */}
      <section className="container-page py-20">
        <div className="rounded-3xl bg-gradient-to-r from-green-700 to-green-900 p-10 text-white md:p-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Stay in the Loop</h2>
            <p className="mt-2 text-green-100">
              Subscribe to our newsletter and get the latest deals and updates.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(`Subscribed with ${email}`);
                setEmail("");
              }}
              className="mt-6 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-xl border-0 px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-green-400"
              />
              <button
                type="submit"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-green-800 transition hover:bg-slate-100"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="bg-slate-50 py-20">
        <div className="container-page max-w-3xl">
          <SectionHeading subtitle="FAQ" title="Frequently Asked Questions" />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="space-y-3"
          >
            {[
              {
                q: "How do I start selling?",
                a: "Simply create a seller account, list your products, and start selling.",
              },
              {
                q: "Is my payment information secure?",
                a: "Yes, we use industry‑standard encryption to protect all transactions.",
              },
              {
                q: "What is your return policy?",
                a: "Most items are eligible for return within 30 days of delivery.",
              },
              {
                q: "How long does shipping take?",
                a: "Delivery typically takes 2–3 business days for domestic orders.",
              },
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="border-b border-slate-200">
                <button
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="flex w-full items-center justify-between py-4 text-left text-lg font-semibold text-slate-900 transition hover:text-green-700"
                >
                  {item.q}
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-200 ${
                      faqOpen === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {faqOpen === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-4 text-slate-600">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="container-page py-20 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeIn}
          className="rounded-3xl bg-slate-900 p-12 text-white"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to start your journey?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            Join thousands of satisfied users and discover the joy of buying and
            selling on ShopNest.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/products"
                className="inline-block rounded-xl bg-green-600 px-8 py-3.5 font-semibold transition hover:bg-green-700"
              >
                Start Shopping
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="inline-block rounded-xl border border-slate-400 px-8 py-3.5 font-semibold transition hover:bg-slate-800"
              >
                Become a Seller
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}