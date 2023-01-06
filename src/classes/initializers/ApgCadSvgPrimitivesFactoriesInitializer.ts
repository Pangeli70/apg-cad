/** -----------------------------------------------------------------------
 * @module [CAD]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.3 [APG 2022/12/28] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { eApgCadDftDimArrowStyles } from "../../enums/eApgCadDftDimArrowStyles.ts";
import { eApgCadDftTextStyles } from "../../enums/eApgCadDftTextStyles.ts";
import { eApgCadPrimitiveFactoryTypes } from "../../enums/eApgCadPrimitiveFactoryTypes.ts";
import { ApgCadSvgAnnotationsFactory } from "../factories/ApgCadSvgAnnotationsFactory.ts";
import { ApgCadSvgLinearDimensionsFactory } from "../factories/ApgCadSvgLinearDimensionsFactory.ts";
import { ApgCadSvgAngularDimensionsFactory } from "../factories/ApgCadSvgAngularDimensionsFactory.ts";
import { ApgCadSvgCartesiansFactory } from "../factories/ApgCadSvgCartesiansFactory.ts";
import { ApgCadSvgBasicShapesFactory } from "../factories/ApgCadSvgBasicShapesFactory.ts";
import { ApgCadSvgBaseInitializer } from "./ApgCadSvgBaseInitializer.ts";
import { ApgCadSvgGridFactory } from "../factories/ApgCadSvgGridFactory.ts";


/** 
 * Primitives Factories
 */
export class ApgCadSvgPrimitivesFactoriesInitializer extends ApgCadSvgBaseInitializer {

    override build() {


        const basicShapes = new ApgCadSvgBasicShapesFactory(this._cad);
        this._cad.primitiveFactories.set(eApgCadPrimitiveFactoryTypes.BASIC_SHAPES, basicShapes,);

        const grid = new ApgCadSvgGridFactory(this._cad);
        this._cad.primitiveFactories.set(eApgCadPrimitiveFactoryTypes.GRIDS, grid,);

        const cartesians = new ApgCadSvgCartesiansFactory(this._cad);
        this._cad.primitiveFactories.set(eApgCadPrimitiveFactoryTypes.CARTESIANS, cartesians,);

        const annotationsTextStyle = this._cad.getTextStyle(eApgCadDftTextStyles.ANNOTATIONS);
        const annotations = new ApgCadSvgAnnotationsFactory(
            this._cad,
            annotationsTextStyle!,
            eApgCadDftDimArrowStyles.MECHANICAL
        );
        this._cad.primitiveFactories.set(eApgCadPrimitiveFactoryTypes.ANNOTATIONS, annotations,);

        const dimensionsTextStyle = this._cad.getTextStyle(eApgCadDftTextStyles.DIMENSIONS);
        const linearDims = new ApgCadSvgLinearDimensionsFactory(
            this._cad,
            dimensionsTextStyle!,
            eApgCadDftDimArrowStyles.MECHANICAL
        )
        this._cad.primitiveFactories.set(eApgCadPrimitiveFactoryTypes.LINEAR_DIMS, linearDims,);


        const angulardDims = new ApgCadSvgAngularDimensionsFactory(
            this._cad,
            dimensionsTextStyle!,
            eApgCadDftDimArrowStyles.MECHANICAL
        );
        this._cad.primitiveFactories.set(eApgCadPrimitiveFactoryTypes.ANGULAR_DIMS, angulardDims,);

    }
}