import theme from "@web/core/theme";

export enum Pathnames {
  HOME = "/",
  SUBJECTS = "/subjects",
  VOTING_SESSION = "/vote",
}

export const header = {
  height: 40,
};

export const pageColors = {
  homepage: theme.colors.yellow["200"],
  votingSession: theme.colors.green["200"],
  subjects: theme.colors.cyan["200"],
};

export const pageColorsByPathname = {
  [Pathnames.HOME]: pageColors.homepage,
  [Pathnames.VOTING_SESSION]: pageColors.votingSession,
  [Pathnames.SUBJECTS]: pageColors.subjects,
  "*": theme.colors.purple["400"],
};

export const backgroundShapesColorByPageColor: Record<string, string> = {
  [pageColors.homepage]: "rgba(255, 223, 92, 0.7)",
  [pageColors.votingSession]: "rgba(140, 217, 165, 0.7)",
  [pageColors.subjects]: "rgba(183, 244, 255, 0.6)",
  [theme.colors.purple["400"]]: "rgba(144, 112, 213, 0.7)",
};

export const spacing = {
  // this naming sux I know.
  stylizedGap: 15,
};
