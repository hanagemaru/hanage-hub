export type Game = {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  playUrl: string;
  status: string;
};

export const gradientSweeper: Game = {
  title: "Gradient Sweeper",
  subtitle: "色を読んで解くマインスイーパー",
  description:
    "数字の代わりに、赤・青・紫のグラデーションを手がかりに爆弾を探すパズルゲームです。",
  href: "/games/gradient-sweeper/",
  playUrl: "https://sweeper.hanage.app/",
  status: "開発中",
};
