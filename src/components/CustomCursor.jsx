import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return undefined;
    }

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    const label = labelRef.current;

    const moveCursorX = gsap.quickTo(cursor, 'x', { duration: 0.12, ease: 'power3.out' });
    const moveCursorY = gsap.quickTo(cursor, 'y', { duration: 0.12, ease: 'power3.out' });
    const moveFollowerX = gsap.quickTo(follower, 'x', { duration: 0.25, ease: 'power3.out' });
    const moveFollowerY = gsap.quickTo(follower, 'y', { duration: 0.25, ease: 'power3.out' });

    const setDefault = () => {
      gsap.to(cursor, { scale: 1, backgroundColor: 'rgba(56, 189, 248, 0.9)', duration: 0.2 });
      gsap.to(follower, { scale: 1, opacity: 0.7, borderColor: 'rgba(56, 189, 248, 0.35)', duration: 0.2 });
      gsap.to(label, { opacity: 0, y: 6, duration: 0.16 });
    };

    const setInteractive = () => {
      gsap.to(cursor, { scale: 1.4, backgroundColor: 'rgba(16, 185, 129, 0.95)', duration: 0.2 });
      gsap.to(follower, { scale: 1.35, opacity: 0.95, borderColor: 'rgba(16, 185, 129, 0.5)', duration: 0.2 });
      gsap.to(label, { opacity: 1, y: 0, duration: 0.16 });
    };

    const handleMove = (event) => {
      moveCursorX(event.clientX);
      moveCursorY(event.clientY);
      moveFollowerX(event.clientX);
      moveFollowerY(event.clientY);
    };

    const handleOver = (event) => {
      const interactiveTarget = event.target.closest('button, a, input, select, textarea, [data-cursor]');

      if (!interactiveTarget) {
        setDefault();
        return;
      }

      label.textContent = interactiveTarget.getAttribute('data-cursor') ?? 'Open';
      setInteractive();
    };

    const handleLeave = () => {
      setDefault();
    };

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleLeave);
    };
  }, []);

  return (
    <>
      <div ref={followerRef} className="custom-cursor-follower" />
      <div ref={cursorRef} className="custom-cursor-dot" />
      <div ref={labelRef} className="custom-cursor-label">
        Open
      </div>
    </>
  );
}

export default CustomCursor;
