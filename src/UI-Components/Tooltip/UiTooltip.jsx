// your-tooltip.jsx
import {
  Content,
  Portal,
  Provider,
  Root,
  Trigger,
} from "@radix-ui/react-tooltip";

export default function UiTooltip({
  side = "top",
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  className,
  containerClass,
  tooltipDelay = 1000,
}) {
  return (
    <Provider delayDuration={tooltipDelay}>
      <Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <Trigger asChild>{children}</Trigger>
        <Portal>
          <Content
            side={side}
            align="center"
            className={`z-50  m-2 ${containerClass}`}
          >
            <div
              className={`px-2 py-1 bg-heading text-offWhite font-semibold text-xs 
        rounded tracking-wide ${className}`}
            >
              {content}
            </div>
          </Content>
        </Portal>
      </Root>
    </Provider>
  );
}
