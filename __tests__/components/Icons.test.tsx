import React from "react";
import { render } from "@testing-library/react";
import {
  TrophyIcon,
  MoonIcon,
  SunIcon,
  VolumeIcon,
  VolumeXIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  TypeIcon,
  BookIcon,
  BarChartIcon,
  HandIcon,
  SettingsIcon,
  TimerIcon,
  CheckmarkIcon,
  MedalIcon,
  RefreshIcon,
  DownloadIcon,
} from "@/components/Icons";

const icons = [
  { name: "TrophyIcon", Component: TrophyIcon },
  { name: "MoonIcon", Component: MoonIcon },
  { name: "SunIcon", Component: SunIcon },
  { name: "VolumeIcon", Component: VolumeIcon },
  { name: "VolumeXIcon", Component: VolumeXIcon },
  { name: "PauseIcon", Component: PauseIcon },
  { name: "PlayIcon", Component: PlayIcon },
  { name: "RotateCcwIcon", Component: RotateCcwIcon },
  { name: "TypeIcon", Component: TypeIcon },
  { name: "BookIcon", Component: BookIcon },
  { name: "BarChartIcon", Component: BarChartIcon },
  { name: "HandIcon", Component: HandIcon },
  { name: "SettingsIcon", Component: SettingsIcon },
  { name: "TimerIcon", Component: TimerIcon },
  { name: "CheckmarkIcon", Component: CheckmarkIcon },
  { name: "MedalIcon", Component: MedalIcon },
  { name: "RefreshIcon", Component: RefreshIcon },
  { name: "DownloadIcon", Component: DownloadIcon },
];

describe("Icons", () => {
  icons.forEach(({ name, Component }) => {
    it(`${name} renders without crashing`, () => {
      const { container } = render(<Component />);
      expect(container.firstChild).toBeTruthy();
    });

    it(`${name} renders an SVG element`, () => {
      const { container } = render(<Component />);
      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it(`${name} has valid viewBox`, () => {
      const { container } = render(<Component />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
    });
  });
});
