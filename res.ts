/** -----------------------------------------------------------------------
 * @module [CAD/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * ------------------------------------------------------------------------
*/
import { Drash } from "./deps.ts";
import { Edr }  from "./deps.ts";
import * as res from "./resources/mod.ts";

export const resources: typeof Drash.Resource[] = [

    // Static
    Edr.ApgEdrPublicTextFileResource,
    Edr.ApgEdrPublicBinFileResource,

    // Cad
    res.ApgCadHomeResource,
    res.ApgCadSvgTestViewerResource

];
