import {FloatingCoords, FloatingPosition, FloatingRect} from './types';

/** Get the floating position based on the target and floating element */
export const getFloatingPosition = (
  targetRect: FloatingRect,
  floatingRect: FloatingRect,
  preferredPosition: FloatingPosition,
): FloatingCoords => {
  const spacing = 10; // Spacing from the target element
  const viewPortMargin = 10; // Margin from the viewport edges

  let top = 0;
  let left = 0;

  switch (preferredPosition) {
    case 'top-center':
      top = targetRect.top - floatingRect.height - spacing;
      left = targetRect.left + targetRect.width / 2 - floatingRect.width / 2;
      break;
    case 'bottom-center':
      top = targetRect.top + targetRect.height + spacing;
      left = targetRect.left + targetRect.width / 2 - floatingRect.width / 2;
      break;
    case 'left-center':
      top = targetRect.top + targetRect.height / 2 - floatingRect.height / 2;
      left = targetRect.left - floatingRect.width - spacing;
      break;
    case 'right-center':
      top = targetRect.top + targetRect.height / 2 - floatingRect.height / 2;
      left = targetRect.left + targetRect.width + spacing;
      break;
    case 'window-center':
      top = window.innerHeight / 2 - floatingRect.height / 2;
      left = window.innerWidth / 2 - floatingRect.width / 2;
      break;
  }

  // Adjustments for viewport bounds
  top = Math.max(
    viewPortMargin,
    Math.min(top, window.innerHeight - floatingRect.height - viewPortMargin),
  );
  left = Math.max(
    viewPortMargin,
    Math.min(left, window.innerWidth - floatingRect.width - viewPortMargin),
  );

  return {top, left};
};