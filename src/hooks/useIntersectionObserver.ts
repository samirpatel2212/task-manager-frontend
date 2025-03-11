import { useState, useEffect, useRef } from 'react';

interface UseIntersectionObserverProps {
  onIntersect: () => void;
  threshold?: number;
  enabled?: boolean;
}

/**
 * Custom hook to implement an Intersection Observer.
 * This hook observes a target element and triggers a callback function when the element
 * intersects with the viewport. It supports customizing the intersection threshold and
 * enabling/disabling the observer.
 *
 * @param {UseIntersectionObserverProps} props - The props for the hook.
 * @param {() => void} props.onIntersect - The callback function to be executed when the target element intersects.
 * @param {number} [props.threshold=1] - The intersection threshold (0 to 1). The percentage of the target element's visibility that must be met for the intersection callback to be triggered.
 * @param {boolean} [props.enabled=true] - A boolean indicating whether the observer is enabled.
 *
 * @returns {{ targetRef: React.MutableRefObject<HTMLDivElement | null>, isIntersecting: boolean }} - An object containing the target ref and the intersection status.
 *
 */
const useIntersectionObserver = ({
  onIntersect,
  threshold = 1,
  enabled = true,
}: UseIntersectionObserverProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { threshold }
    );

    const target = targetRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [onIntersect, threshold, enabled]);

  return { targetRef, isIntersecting };
};

export default useIntersectionObserver;