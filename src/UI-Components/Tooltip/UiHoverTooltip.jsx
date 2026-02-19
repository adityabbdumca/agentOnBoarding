import {
    Arrow,
    Content,
    Portal,
    Root,
    Trigger,
} from "@radix-ui/react-hover-card";

export default function UiHoverToolTip({
  side = "top",
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  className,
  containerClass,
  openDelay = 700,
  closeDelay = 300,
}) {
  return (
    <Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      openDelay={openDelay}
      closeDelay={closeDelay}
    >
      <Trigger asChild>{children}</Trigger>

      <Portal>
        <Content
          side={side}
          align="center"
          className={`z-50 m-2 ${containerClass ?? ""}`}
        >
          <div
            className={`rounded px-3 py-2 bg-heading text-xs font-semibold tracking-wide ${
              className ?? ""
            }`}
          >
            {content}
          </div>
          <Arrow className="relative bottom-3 border border-extraLightGray" />
        </Content>
      </Portal>
    </Root>
  );
}
