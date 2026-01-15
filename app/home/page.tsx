"use client";
import { useState } from "react";
import {
  MapPin,
  Wallet,
  Clock,
  UtensilsCrossed,
  ArrowRight,
  Star,
} from "lucide-react";

export default function Home() {
  const [budget, setBudget] = useState(2500);

  const handleCTAClick = () => {
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            {/* Hero Content */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-2 w-fit rounded-full bg-accent/10 px-4 py-2">
                <span className="text-sm font-medium text-accent">
                  By OAU Students, For OAU Students
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-balance leading-tight">
                  Stop Trekking.{" "}
                  <span className="text-accent">Start Eating.</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg">
                  See every buka and restaurant on campus. Filter by price.
                  Never walk into a canteen you can&apos;t afford again.
                </p>
              </div>

              <button
                onClick={handleCTAClick}
                className="group w-fit flex items-center gap-3 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 active:scale-95 animate-bounce-gentle"
              >
                Find Affordable Food Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary/60 border-2 border-background flex items-center justify-center text-xs font-bold text-white"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Trusted by 1000+ hungry students
                </span>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative h-[400px] sm:h-[500px] rounded-3xl bg-gradient-to-br from-accent/20 to-primary/10 border-2 border-accent/20 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 gap-6">
                <div className="w-full max-w-xs bg-white rounded-2xl p-6 shadow-lg space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span className="text-sm font-medium text-foreground">
                      Campus Locations
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                    <span className="text-sm font-medium text-foreground">
                      Budget:
                    </span>
                    <span className="text-lg font-bold text-accent">
                      ₦{budget}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                  />

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Available options:
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Rice & Stew</span>
                        <span className="font-semibold">₦800</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Jollof Rice</span>
                        <span className="font-semibold">₦1,200</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Pepper Rice</span>
                        <span className="font-semibold">₦1,500</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-muted/40">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
              Why ChowFinder?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We&apos;ve been there. Hungry, broke, and tired of wasting time.
              Here&apos;s how ChowFinder changes the game.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Problem Card 1 */}
            <div className="group rounded-3xl border-2 border-border bg-card p-8 transition-all duration-300 hover:border-accent hover:shadow-lg">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Wallet className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Price Surprises</h3>
              <p className="text-muted-foreground mb-4">
                You think that rice is ₦500, but it&apos;s actually ₦1,200. Your
                heart sinks.
              </p>
              <div className="text-accent font-semibold text-sm">
                ✓ See exact prices before you go
              </div>
            </div>

            {/* Problem Card 2 */}
            <div className="group rounded-3xl border-2 border-border bg-card p-8 transition-all duration-300 hover:border-accent hover:shadow-lg">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Long Treks</h3>
              <p className="text-muted-foreground mb-4">
                Walking to your favorite spot only to find it&apos;s closed for
                the day.
              </p>
              <div className="text-accent font-semibold text-sm">
                ✓ Real-time availability & location
              </div>
            </div>

            {/* Problem Card 3 */}
            <div className="group rounded-3xl border-2 border-border bg-card p-8 transition-all duration-300 hover:border-accent hover:shadow-lg">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <UtensilsCrossed className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Limited Budget</h3>
              <p className="text-muted-foreground mb-4">
                You have ₦2,000. You need options that won&apos;t break the
                bank.
              </p>
              <div className="text-accent font-semibold text-sm">
                ✓ Filter by your exact budget
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
              Packed with Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to find food fast.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="rounded-3xl border-2 border-border p-8 bg-card space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Real-time Budget Slider</h3>
              <p className="text-muted-foreground">
                Slide to your last ₦500 and see only what you can actually
                afford. No surprises, just solutions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl border-2 border-border p-8 bg-card space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Hyper-Local Data</h3>
              <p className="text-muted-foreground">
                Every small &quot;buka&quot; that Google Maps misses. We know
                OAU&apos;s hidden gems.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl border-2 border-border p-8 bg-card space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Live Menus</h3>
              <p className="text-muted-foreground">
                No more guessing prices before you get there. See what&apos;s
                available today.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-3xl border-2 border-border p-8 bg-card space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Community Ratings</h3>
              <p className="text-muted-foreground">
                See what other students think. Real reviews from people
                who&apos;ve eaten there.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
              What Students Are Saying
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="rounded-3xl bg-white/10 backdrop-blur p-8 border border-white/20">
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-lg mb-6">
                &quot;I was tired of wasting 30 minutes looking for food I could
                afford. ChowFinder saved me. Literally.&quot;
              </p>
              <div>
                <p className="font-bold">Chioma</p>
                <p className="text-sm text-white/60">100-level, Medicine</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-3xl bg-white/10 backdrop-blur p-8 border border-white/20">
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-lg mb-6">
                &quot;Broke but Fed is our new life motto. ChowFinder makes it
                happen every single day.&quot;
              </p>
              <div>
                <p className="font-bold">Ayokunle</p>
                <p className="text-sm text-white/60">200-level, Engineering</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-5xl sm:text-6xl font-bold mb-6 text-balance">
            Ready to Eat?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Stop overthinking. Your next affordable meal is just a tap away.
          </p>
          <button
            onClick={handleCTAClick}
            className="group inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-5 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 active:scale-95"
          >
            Explore the Map
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 sm:px-6 lg:px-8 bg-muted/40 border-t border-border">
        <div className="mx-auto max-w-6xl text-center text-muted-foreground">
          <p>© 2026 OAU ChowFinder. Built by students, for students.</p>
        </div>
      </footer>
    </main>
  );
}
