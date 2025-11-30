export default class AppConfig {
  trustedDomains: string[] | string;
  trustedStripeDomains: string[];

  constructor(
    trustedDomains: string[] | string,
    trustedStripeDomains: string[],
  ) {
    this.trustedDomains = trustedDomains;
    this.trustedStripeDomains = trustedStripeDomains;
  }

  static getConfig(): AppConfig {
    let trustedDomains = [
      "mybackend.com",
      "mybackend.com",
    ].flatMap((domain) => {
      return ["https://www." + domain, "https://" + domain];
    });
    if (process.env.NODE_ENVIRONMENT === "development") {
      trustedDomains.push(
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
      );
    } else if (process.env.NODE_ENVIRONMENT === "staging") {
      const stagingTrustedDomains = [
        "mybackend.com",
        "mybackend.com",
        "mybackend.com",
      ].flatMap((domain) => {
        return ["https://www." + domain, "https://" + domain];
      });
      trustedDomains.push(...stagingTrustedDomains);
    }

    const trustedStripeDomains = ["*"];

    return new AppConfig(trustedDomains, trustedStripeDomains);
  }
}
