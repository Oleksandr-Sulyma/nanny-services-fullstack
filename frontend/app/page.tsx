import Link from "next/link";

export default function Home() {
  return (
      <main>
      <h1>Nanny Services</h1>
      <h2>Find the best nanny for your children!</h2>
      <Link href="/nannies">Find a nanny</Link>
      </main>
  );
}
