import { useEffect } from "react";
import { type CarouselApi } from "@/components/ui/carousel";

interface UseAutoplayCarouselProps {
  api: CarouselApi | undefined;
  delay?: number;
  stopOnInteraction?: boolean;
}

export const useAutoplayCarousel = ({
  api,
  delay = 5000,
  stopOnInteraction = true,
}: UseAutoplayCarouselProps) => {
  useEffect(() => {
    if (!api) return;

    const autoplay = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, delay);

    const handleInteraction = () => {
      if (stopOnInteraction) {
        clearInterval(autoplay);
      }
    };

    if (stopOnInteraction) {
      api.on("pointerDown", handleInteraction);
    }

    return () => {
      clearInterval(autoplay);
      if (stopOnInteraction) {
        api.off("pointerDown", handleInteraction);
      }
    };
  }, [api, delay, stopOnInteraction]);
};
