// import type { SVGProps } from "react";

declare module "*.svg" {
  const content: (props: React.SVGProps<SVGElement>) => JSX.Element;
  export default content;
}
