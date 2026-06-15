import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-344 px-3 pb-8 xs:px-4 lg:px-0">
      <section className="overflow-hidden rounded-3xl md:rounded-[30px] bg-brand text-white lg:h-184">
        <div className="grid h-full lg:grid-cols-2">
          <div className="flex flex-col justify-center px-5 pb-8 pt-28 xs:px-6 md:px-16 lg:px-24 lg:pb-20 lg:pt-36">
            <h1 className="max-w-130 text-[34px] font-medium leading-none xs:text-[40px] md:text-[56px] lg:text-[70px]">
              Make Life Easier for the Family:
            </h1>
            <p className="mt-5 max-w-130 text-base leading-[1.35] text-white/80 md:mt-7 md:text-[28px] md:leading-[1.07]">
              Find babysitters online for all occasions. Choose trusted nannies,
              save favorites, and arrange care with less friction.
            </p>

            <Link
              href="/nannies"
              className="group mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-3xl md:rounded-[30px] border border-white/40 px-8 text-base font-medium focus:outline-none md:mt-16 md:min-h-15 md:gap-4.5 md:px-12.5 md:text-xl"
            >
              Get started
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45 group-focus:rotate-45 group-focus-visible:rotate-45" />
            </Link>
          </div>

          <div className="relative min-h-107.5 md:min-h-130 lg:min-h-full">
            <Image
              src="https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=1200&q=80"
              alt="Nanny spending time with a child"
              fill
              priority
              sizes="(min-width: 1024px) 592px, 100vw"
              className="object-cover object-top lg:object-center"
            />

            <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-4.5 bg-white px-5 py-4 text-foreground shadow-[0_20px_50px_rgba(17,16,28,0.16)] md:bottom-8 md:left-12 md:gap-4 md:rounded-5 md:px-8 md:py-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-3.25 bg-brand text-white md:h-13.5 md:w-13.5">
                <Check className="h-5 w-5 md:h-6 md:w-6" />
              </span>
              <span>
                <span className="block text-sm text-(--color-muted)">
                  Experienced nannies
                </span>
                <span className="mt-1 block text-xl font-bold md:text-2xl">
                  15,000
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
