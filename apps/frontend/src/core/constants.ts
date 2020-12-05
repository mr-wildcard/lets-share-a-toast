import theme from '@chakra-ui/theme';

export enum Pathnames {
  HOME = '/',
  SUBJECTS = '/subjects',
  VOTING_SESSION = '/vote',
}

export enum APIPaths {
  PROFILE = '/profile',
  TOASTS = '/toasts',
  TOAST = '/toasts/:id',
  TOAST_STATUS = '/toasts/:id/status',
  CURRENT_TOAST = '/toasts/current',
  USERS = '/users',
  SUBJECTS = '/subjects',
  SUBJECT = '/subjects/:id',
  SUBJECT_STATUS = '/subjects/:id/status',
  OAUTH = '/oauth2/authorize/google',
}

const FONT_FAMILY_LOGO = '"Kaushan Script", cursive';

// TODO: make this constant dynamic from API current toast.
export const TOTAL_NEEDED_SUBJECTS = 2;

export const header = {
  height: 60,
};

export const pageColors = {
  homepage: theme.colors.yellow['200'],
  votingSession: theme.colors.green['200'],
  subjects: theme.colors.cyan['200'],
};

export const pageColorsByPathname = {
  [Pathnames.HOME]: pageColors.homepage,
  [Pathnames.VOTING_SESSION]: pageColors.votingSession,
  [Pathnames.SUBJECTS]: pageColors.subjects,
  '*': theme.colors.purple['400'],
};

export const customFonts = {
  logo: FONT_FAMILY_LOGO,
};

export const spacing = {
  // this naming sux I know.
  stylizedGap: 15,
};

export const urlRegex = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
  'i'
);
