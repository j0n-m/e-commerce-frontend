import domainList from "./domainList";

const validDomains = new Map(domainList.map((domain) => [domain, domain]));

export default validDomains;
