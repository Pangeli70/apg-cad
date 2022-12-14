/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */

import { eApgCadInstructionTypes } from "../../src/enums/eApgCadInstructionTypes.ts";
import { eApgCadTestInsSets } from "../src/enums/eApgCadTestInsSets.ts";
import { IApgCadInsSetTest } from "../src/interfaces/IApgCadInsSetTest.ts";

export const ApgCadInsSetTest_01: IApgCadInsSetTest = {
    name: eApgCadTestInsSets.BASIC,
    description: "Some points and lines on the default layer: Zero ",
    instructions: [
        {
            id: 0,
            type: eApgCadInstructionTypes.SET_NAME,
            name: 'TEST 01',
        },
        {
            id: 1,
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P1',
            x: 100,
            y: 100
        },
        {
            id: 2,
            type: eApgCadInstructionTypes.NEW_POINT,
            name: 'P2',
            x: 900,
            y: 900
        },
        {
            id: 3,
            type: eApgCadInstructionTypes.DRAW_LINE,
            name: 'L2',
            points: ['P1', 'P2']
        },
        {
            id: 4,
            type: eApgCadInstructionTypes.NEW_POINT_DELTA,
            name: 'P3',
            origin: 'P2',
            x: 500,
            y: 100,
        },
        {
            id: 5,
            type: eApgCadInstructionTypes.DRAW_ALL_POINTS,
            name: 'Draw_all_pts',
            radious: 10
        },
        
    ]
}