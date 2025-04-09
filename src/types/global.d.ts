
interface Window {
  hbspt: any;
  FB?: {
    login: (callback: (response: { authResponse?: { accessToken: string } }) => void, options: { scope: string }) => void;
    api: (path: string, method: string, params: any, callback: (response: any) => void) => void;
    AppEvents?: {
      logPageView: () => void;
    };
    init?: (options: {
      appId: string;
      autoLogAppEvents: boolean;
      xfbml: boolean;
      version: string;
    }) => void;
  };
  dataLayer?: any[];
}
