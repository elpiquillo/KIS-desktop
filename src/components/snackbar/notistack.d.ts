import { SnackbarContent } from 'notistack';

declare module 'notistack' {
  interface VariantOverrides {
    extended: {
      title: string;
    };
  }
}

export { SnackbarContent };
