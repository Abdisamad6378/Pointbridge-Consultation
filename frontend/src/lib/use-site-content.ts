import { useQuery } from "@tanstack/react-query";
import { fetchPublicClients, fetchPublicImages, fetchPublicTeamMembers, fetchPublicTestimonials } from "@/lib/admin-api";
import { heroSlides, images } from "@/lib/images";
import {
  optimizeImageUrl,
  preloadFirstImage,
  readCachedImageMap,
  writeCachedImageMap,
} from "@/lib/site-image-cache";
import { blogPosts, partners as staticPartners, publications, teamMembers as staticTeamMembers, testimonials as staticTestimonials } from "@/lib/site-data";

export function siteImagesQueryOptions() {
  return {
    queryKey: ["site-images"] as const,
    queryFn: async () => {
      try {
        const data = await fetchPublicImages();
        writeCachedImageMap(data.map);
        const firstHero = data.map["hero.slide.1"];
        if (firstHero) preloadFirstImage(firstHero);
        return data;
      } catch {
        const cached = readCachedImageMap();
        if (cached) return { items: [], map: cached };
        return { items: [], map: {} };
      }
    },
    staleTime: 60_000,
    refetchOnMount: "always" as const,
    retry: 1,
  };
}

export function useSiteImageMap() {
  return useQuery({
    ...siteImagesQueryOptions(),
    select: (data) => data.map,
  });
}

export function useSiteImages() {
  const query = useSiteImageMap();
  return {
    ...query,
    getImage: (key: string, fallback: string) => query.data?.[key] ?? fallback,
  };
}

export function useHeroSlides() {
  const { data: map } = useSiteImageMap();

  const slides = heroSlides.map((slide, index) => {
    const raw = map?.[`hero.slide.${index + 1}`] ?? slide.image;
    return {
      ...slide,
      image: optimizeImageUrl(raw, index === 0 ? 1440 : 1200),
    };
  });

  return { slides };
}

export function usePublicTestimonials() {
  return useQuery({
    queryKey: ["site-testimonials"],
    queryFn: fetchPublicTestimonials,
    staleTime: 5 * 60_000,
    refetchOnMount: false,
    select: (data) =>
      data.items.length
        ? data.items.map((item) => ({
            id: item.id,
            name: item.name,
            role: item.role,
            quote: item.quote,
            image: item.image,
          }))
        : staticTestimonials.map((item, index) => ({
            ...item,
            image: item.image ?? images.team[index] ?? images.team[0],
          })),
  });
}

export function usePublicTeamMembers() {
  return useQuery({
    queryKey: ["site-team"],
    queryFn: fetchPublicTeamMembers,
    staleTime: 5 * 60_000,
    refetchOnMount: false,
    select: (data) =>
      data.items.length
        ? data.items.map((item) => ({
            id: item.id,
            name: item.name,
            role: item.role,
            bio: item.bio,
            image: item.image,
          }))
        : staticTeamMembers,
  });
}

export function usePublicClients() {
  return useQuery({
    queryKey: ["site-clients"],
    queryFn: fetchPublicClients,
    staleTime: 5 * 60_000,
    refetchOnMount: false,
    select: (data) =>
      data.items.length
        ? data.items.map((item) => ({
            id: item.id,
            name: item.name,
            logo: item.logo,
          }))
        : staticPartners.map((name) => ({ name, logo: null as string | null })),
  });
}

export function resolveBlogImage(slug: string, fallback: string, map?: Record<string, string>) {
  return map?.[`blog.${slug}`] ?? fallback;
}

export function resolvePublicationImage(slug: string, fallback: string, map?: Record<string, string>) {
  return map?.[`pub.${slug}`] ?? fallback;
}

export function resolveQuickLinkImage(key: keyof typeof images.quickLinks, map?: Record<string, string>) {
  return map?.[`quick.${key}`] ?? images.quickLinks[key];
}

export function resolveBlogPosts(map?: Record<string, string>) {
  return blogPosts.map((post) => ({
    ...post,
    image: resolveBlogImage(post.slug, post.image, map),
  }));
}

export function resolvePublications(map?: Record<string, string>) {
  return publications.map((item) => ({
    ...item,
    image: resolvePublicationImage(item.slug, item.image, map),
  }));
}
