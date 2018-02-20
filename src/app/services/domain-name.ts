
import { environment } from '../../environments/environment';

/**
 * due to aot build const must not be declare..
 */
export function serverDomainName() {
	return environment.domainName;
}