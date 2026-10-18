# বাজার দর | BazarDor

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে দেখুন। পণ্য, বিভাগ ও বিভিন্ন বাজারের দাম এবং দৈনিক পরিবর্তন একটি responsive বাংলা interface-এ সাজানো হয়েছে।

## প্রযুক্তি

- Next.js App Router ও React
- TypeScript
- Tailwind CSS
- React Hot Toast
- Programming Hero Bazaar Dor API

## মূল ফিচার

1. **সাম্প্রতিক বাজারদর:** API থেকে পণ্যের তথ্য, দৈনিক price ticker এবং বাংলাদেশি
   সংখ্যায় দাম ও পরিবর্তন।
2. **দ্রুত product discovery:** দাম বাড়া/কমার তালিকা, সব পণ্যের responsive
   grid, category navigation ও numeric price sorting।
3. **বিস্তারিত বাজার তথ্য:** প্রতিটি পণ্যের সর্বনিম্ন, সর্বোচ্চ ও গড় দাম এবং
   বাজারভিত্তিক price breakdown।
4. **সব screen-এর উপযোগী UI:** mobile থেকে desktop layout, loading skeleton,
   toast feedback এবং friendly 404 page।

## চালানো

প্রয়োজন: Node.js এবং pnpm।

```bash
pnpm install
```

```bash
pnpm dev
```

Production build ও lint:

```bash
pnpm lint
pnpm build
pnpm start
```

## Data API

পণ্যের তথ্য আসে
[`https://openapi.programming-hero.com/api/bazardor`](https://openapi.programming-hero.com/api/bazardor)
থেকে। API responses পাঁচ মিনিটের জন্য cache করা হয়।