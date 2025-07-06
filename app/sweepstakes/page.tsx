export default function SweepstakesPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <section className="w-full max-w-3xl mx-auto text-center">
        <p className="text-2xl md:text-3xl font-light leading-relaxed mb-8">
          &quot;To receive free tokens without a purchase, mail a self-addressed stamped envelope (SASE) with your full name, age, mailing address, valid email address, and a handwritten note stating &apos;HCCC Gameroom Sweepstakes Entry Request&apos; to:&quot;
        </p>
        <div className="text-2xl md:text-3xl font-semibold leading-relaxed mb-8">
          HCCC Gameroom – Free Token Request<br/>
          1234 Gameroom Way, Suite 100<br/>
          Austin, TX 78701
        </div>
        <p className="text-2xl md:text-3xl font-light leading-relaxed">
          Each valid request will receive 5 tokens, limit one request per household per week.
        </p>
      </section>
    </div>
  );
} 