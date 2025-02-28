declare module 'nprogress' {
  interface NProgressStatic {
    start(): void;
    done(): void;
    configure(options: Partial<NProgressOptions>): void;
  }

  interface NProgressOptions {
    minimum: number;
    easing: string;
    speed: number;
    showSpinner: boolean;
  }

  const nprogress: NProgressStatic;
  export default nprogress;
} 