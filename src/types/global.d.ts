
interface Window {
  hbspt: any;
  FB?: {
    login: (callback: (response: { authResponse?: { accessToken: string } }) => void, options: { scope: string }) => void;
  };
  dataLayer?: any[];
}

