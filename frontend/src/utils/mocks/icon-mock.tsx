import { forwardRef } from "react";


export function mockIcon(icon: { default: (props: any) => JSX.Element }, text = 'Icon') {
  const origin = icon.default;

  (icon as any).default = forwardRef<HTMLDivElement, any>((props, ref) => <div ref={ref} {...props}>{text}</div>);

  return {
    origin,
    mockRestore: () => {
      icon.default = origin;
    }
  };
}

export type MockIcon = ReturnType<typeof mockIcon>;