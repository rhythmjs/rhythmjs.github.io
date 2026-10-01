import {
  ArrowLeftIcon,
  BoundingBoxIcon,
  BracketsAngleIcon,
  LightningIcon,
  PlugsConnectedIcon,
  StackSimpleIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CopyIcon,
  GithubLogoIcon,
  InfoIcon,
  LightbulbIcon,
  PencilSimpleIcon,
  WarningIcon,
  XLogoIcon,
} from "@phosphor-icons/react";

export const iconMap = {
  copy: CopyIcon,
  "arrow-right": ArrowRightIcon,
  "arrow-left": ArrowLeftIcon,
  "arrow-up-right": ArrowUpRightIcon,
  github: GithubLogoIcon,
  x: XLogoIcon,
  pencil: PencilSimpleIcon,
  info: InfoIcon,
  lightbulb: LightbulbIcon,
  alert: WarningIcon,
  layers: StackSimpleIcon,
  brackets: BracketsAngleIcon,
  plugs: PlugsConnectedIcon,
  boundary: BoundingBoxIcon,
  lightning: LightningIcon,
} as const;

export type IconName = keyof typeof iconMap;
