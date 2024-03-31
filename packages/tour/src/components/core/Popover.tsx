import React from 'react';

import ReactDOM from 'react-dom';

import {_DEFAULT_POPOVER_POSITION} from '../../constants';
import {calculatePopoverPosition} from '../../helpers';
import {useFocusTrap, useLockBodyScroll} from '../../hooks';
import {PopoverContextType, PopoverProps} from '../../types';
import {cn, setStyle} from '../../utils';

const PopoverContext = React.createContext<PopoverContextType | null>(null);

const usePopover = (): PopoverContextType => {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error('usePopover must be used within a Popover component');
  }
  return context;
};

const Popover = ({
  children,
  open,
  preferredPosition = _DEFAULT_POPOVER_POSITION,
  target,
  onClickOutside,
  shouldShowOverlay = true,
}: PopoverProps) => {
  if (!open) return null;

  return (
    <PopoverContext.Provider
      value={{
        open,
        preferredPosition,
        target,
        onClickOutside,
        shouldShowOverlay,
      }}>
      {children}
    </PopoverContext.Provider>
  );
};

const PopoverContent = ({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) => {
  const {open, target, preferredPosition, onClickOutside, shouldShowOverlay} =
    usePopover();
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const [isPositioned, setIsPositioned] = React.useState(false);

  // Position the popover
  React.useEffect(() => {
    const {current: popover} = popoverRef;

    if (!open || !popover) return;

    const positionPopover = () => {
      const targetRect = target?.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();

      const {translateX, translateY} = calculatePopoverPosition({
        popoverRect,
        targetRect,
        preferredPosition,
      });

      requestAnimationFrame(() => {
        popover.style.transform = `translate(${translateX}px, ${translateY}px)`;
      });
    };

    positionPopover();

    let restore: (() => void) | undefined;

    // Highlight the target element
    if (shouldShowOverlay && target) {
      restore = setStyle(target, 'zIndex', '10001');
    }

    // Wait for the popover to be positioned before enabling transitions
    const timeoutId = setTimeout(() => {
      if (!isPositioned) setIsPositioned(true);
    }, 20);

    return () => {
      if (restore) restore();
      clearTimeout(timeoutId);
    };
  }, [open, target, preferredPosition, shouldShowOverlay]);

  useFocusTrap(popoverRef, open);
  useLockBodyScroll(open);

  return ReactDOM.createPortal(
    <>
      <div
        className={cn('nt-popover-overlay', {
          active: open && !!shouldShowOverlay,
        })}
        onClick={onClickOutside}
      />
      <div
        {...props}
        ref={popoverRef}
        className={cn(
          'nt-popover',
          {'enable-transition': isPositioned},
          className,
        )}>
        {children}
      </div>
    </>,
    document.body,
  );
};

Popover.Content = PopoverContent;

export default Popover;
