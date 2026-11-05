import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { preloadFirstImage } from "@/lib/site-image-cache";
import { cn } from "@/lib/utils";
import { useHeroSlides } from "@/lib/use-site-content";

function SlideTitle({ title, highlight, line2 }: { title: string; highlight?: string; line2?: string }) {
  // A highlight that isn't part of the title is the ending of the headline.
  const [before, after] = !highlight
    ? [title, ""]
    : title.includes(highlight)
      ? title.split(highlight)
      : [`${title} `, ""];

  return (
    <>
      {before}
      {highlight && <span className="text-secondary">{highlight}</span>}
      {after}
      {line2 && (
        <>
          <br />
          {line2}
        </>
      )}
    </>
  );
}

function HeroSlideImage({
  src,
  active,
  priority,
}: {
  src: string;
  active: boolean;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <div
        className={cn(
          "absolute inset-0 bg-[oklch(0.20_0.07_258)] transition-opacity duration-500",
          loaded ? "opacity-0" : "opacity-100",
        )}
        aria-hidden
      />
      <img
        src={src}
        alt=""
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-full w-full object-cover photo-blur brightness-[1.06] contrast-[1.04] saturate-[1.08] transition-all duration-700 ease-out",
          active ? "scale-105" : "scale-100",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </>
  );
}

export function HeroSlider() {
  const { slides: heroSlides } = useHeroSlides();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (heroSlides[0]?.image) preloadFirstImage(heroSlides[0].image);
  }, [heroSlides]);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || paused) return;

    const timer = window.setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => window.clearInterval(timer);
  }, [api, paused]);

  const slide = heroSlides[current] ?? heroSlides[0];

  return (
    <section
      className="relative isolate min-h-[max(70vh,40rem)] overflow-hidden sm:min-h-[78vh] lg:min-h-[85vh] xl:min-h-[88vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Carousel opts={{ loop: true }} setApi={setApi} className="min-h-[max(70vh,40rem)] sm:min-h-[78vh] lg:min-h-[85vh] xl:min-h-[88vh]">
        <CarouselContent className="-ml-0 min-h-[max(70vh,40rem)] sm:min-h-[78vh] lg:min-h-[85vh] xl:min-h-[88vh]">
          {heroSlides.map((item, index) => (
            <CarouselItem key={item.title} className="relative min-h-[max(70vh,40rem)] basis-full pl-0 sm:min-h-[78vh] lg:min-h-[85vh] xl:min-h-[88vh]">
              <div className="absolute inset-0 -z-10">
                <HeroSlideImage
                  src={item.image}
                  active={current === index}
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.14_0.07_260/0.62)] via-[oklch(0.14_0.07_260/0.22)] to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.07_260/0.35)] via-transparent to-transparent" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="pointer-events-none absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center px-4 pb-28 pt-16 sm:px-6 sm:pb-36 sm:pt-20 md:pb-40 md:pt-24 lg:px-8 lg:pb-48 lg:pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
            >
              {slide.eyebrow && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white sm:text-xs">
                  {slide.eyebrow}
                </p>
              )}
              <h1
                className={cn(
                  "max-w-4xl text-3xl font-bold leading-[1.1] tracking-tight xs:text-[2rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.25rem]",
                  slide.eyebrow ? "mt-3 sm:mt-4" : "mt-0",
                )}
              >
                <SlideTitle title={slide.title} highlight={slide.highlight} line2={slide.titleLine2} />
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/95 sm:mt-6 sm:text-base md:text-lg">
                {slide.description}
              </p>
              <div className="pointer-events-auto mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                <Button
                  asChild
                  size="lg"
                  className="w-full rounded-full bg-secondary px-6 text-secondary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-secondary/90 sm:w-auto sm:px-8"
                >
                  <Link to={slide.primaryTo}>
                    {slide.primaryLabel} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full border-white/50 bg-white/10 px-6 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:text-white sm:w-auto sm:px-8"
                >
                  <Link to={slide.secondaryTo}>
                    {slide.secondaryLabel === "Watch Video" && (
                      <Play className="mr-2 h-4 w-4 fill-white/20" />
                    )}
                    {slide.secondaryLabel}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sits below the text and above the quick-link cards that overlap the slider. */}
        <div className="absolute inset-x-0 bottom-16 z-10 flex items-center justify-center gap-3 sm:bottom-20 md:bottom-24 lg:bottom-32">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Previous slide"
            onClick={() => api?.scrollPrev()}
            className="h-10 w-10 rounded-full border-white/30 bg-black/20 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-black/35 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  current === index ? "w-8 bg-secondary" : "w-2.5 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Next slide"
            onClick={() => api?.scrollNext()}
            className="h-10 w-10 rounded-full border-white/30 bg-black/20 text-white backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-black/35 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </Carousel>
    </section>
  );
}
