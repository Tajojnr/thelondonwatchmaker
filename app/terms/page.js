export default function TermsPage() {
  return (
    <main className="pt-40 pb-20 bg-[#F7F4EE]">
      <div className="max-w-3xl mx-auto px-6 font-inter text-[#06100C]/80 leading-relaxed">
        <h1 className="text-4xl font-playfair text-[#06100C] mb-8">Terms of Repair & Bailment</h1>
        <section className="space-y-6">
          <p><strong>1. Estimate & Diagnostics:</strong> All estimates are subject to physical inspection. A diagnostic fee may apply if a watch is not proceeded with after a complex inspection.</p>
          <p><strong>2. Parts:</strong> We use genuine manufacturer parts wherever possible. If obsolete, we will consult the client on custom fabrication or high-grade alternatives.</p>
          <p><strong>3. Collection & Bailment:</strong> Timepieces not collected within 90 days of "Ready" notification may be subject to storage fees. Under the Torts (Interference with Goods) Act 1977, we reserve the right to sell goods to recover costs after 12 months of non-collection.</p>
          <p><strong>4. Warranty:</strong> Our movement services carry a 12-month or 24-month mechanical warranty (excluding water damage if the watch was not pressure tested or failed such test).</p>
        </section>
      </div>
    </main>
  );
}