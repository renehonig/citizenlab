import React from 'react';
import{ GetTenantLocalesChildProps } from 'resources/GetTenantLocales';
import { replacePathnameLocale } from 'services/locale';
import { isAdminPage } from 'utils/helperUtils';

// https://github.com/nfl/react-helmet/issues/279 href comes first!
export default function getAlternateLinks(tenantLocales: GetTenantLocalesChildProps) {

  if (!isAdminPage() && Array.isArray(tenantLocales) && tenantLocales.length > 1) {
    return tenantLocales.map(loc => {
      return <link href={`${location.origin}${replacePathnameLocale(location.pathname, loc)}`} rel="alternate" hrefLang={loc} key={loc} />;
    });
  }

  return null;
}
