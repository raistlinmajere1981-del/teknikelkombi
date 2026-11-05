import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
export const sourceCatalog = JSON.parse(readFileSync(new URL('../../assets/i18n/tr.json',import.meta.url),'utf8'));
export const sourceKey = text => 'phrase.' + createHash('sha256').update(text).digest('hex');
export function localizationMetadata(translations = {}, copy = {}) {
  return {version:1,source_language:'tr',target_languages:['en'],
    languages:[{code:'tr',nativeName:'Türkçe',locale:'tr-TR',direction:'ltr'}, {code:'en',nativeName:'English',locale:'en-GB',direction:'ltr'}],
    site_catalog:structuredClone(sourceCatalog),translations:{...translations,site_text:{
      ...translations.site_text,...Object.fromEntries(Object.entries(copy).map(([source,text]) => [sourceCatalog.id+':'+sourceKey(source),{en:{text}}]))
    }}};
}
