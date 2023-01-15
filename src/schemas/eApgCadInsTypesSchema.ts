/** -----------------------------------------------------------------------
 * @module [CAD-JSV]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/26] Github Beta
 * @version 0.9.4 [APG 2023/01/07] Deno Deploy Beta
  * -----------------------------------------------------------------------
 */
import { Uts, Jsv } from '../../deps.ts'
import { eApgCadInstructionTypes } from "../enums/eApgCadInstructionTypes.ts";

const rawSchema: Jsv.IApgJsvEnum = {
    $schema: "http://json-schema.org/schema#",
    $id: "eApgCadIns_Types#",
    definitions: {
        enumType: {
            type: "string",
            enum: Uts.ApgUtsEnum.StringValues(eApgCadInstructionTypes)
        }
    }
}


export const eApgCadIns_TypesSchema = Uts.ApgUtsObj.DeepFreeze(rawSchema) as Jsv.IApgJsvEnum;