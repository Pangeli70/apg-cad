/** -----------------------------------------------------------------------
 * @module [CAD-svg]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.0.1 [APG 2017/10/27]
 * @version 0.5.0 [APG 2018/11/25]
 * @version 0.8.0 [APG 2022/04/03] Porting to Deno
 * @version 0.9.2 [APG 2022/11/30] Github beta
 * @version 0.9.3 [APG 2022/12/18] Deno Deploy
 * -----------------------------------------------------------------------
 */
import { A2D, Svg } from "../../../deps.ts";
import { eApgCadDftDimArrowStyles } from "../../enums/eApgCadDftDimArrowStyles.ts";
import { eApgCadDftLayers } from "../../enums/eApgCadDftLayers.ts";
import { eApgCadLinearDimensionTypes } from "../../enums/eApgCadLinearDimensionTypes.ts";
import { eApgCadPrimitiveFactoryTypes } from "../../enums/eApgCadPrimitiveFactoryTypes.ts";
import { ApgCadSvg } from "../ApgCadSvg.ts";

import { ApgCadSvgUtils } from "../ApgCadSvgUtils.ts";
import { ApgCadSvgBasicShapesFactory } from "./ApgCadSvgBasicShapesFactory.ts";
import { ApgCadSvgPrimitivesFactory } from "./ApgCadSvgPrimitivesFactory.ts";


/** Apg Svg : Factory for CAD Linear dimensions with arrows and ladders
 */
export class ApgCadSvgLinearDimensionsFactory extends ApgCadSvgPrimitivesFactory {

  /** text style */
  textStyle: Svg.IApgSvgTextStyle;
  /** Arrow Block name*/
  arrowStyle: string = eApgCadDftDimArrowStyles.UNDEFINED;
  /** Additional class for the annotations */
  cssClass = "";


  public constructor(
    acad: ApgCadSvg,
    atextStyle: Svg.IApgSvgTextStyle,
    aarrowStyle: string,
    acssClass = ''
  ) {
    super(acad, eApgCadPrimitiveFactoryTypes.LINEAR_DIMS);
    this.textStyle = atextStyle;
    this.arrowStyle = aarrowStyle;
    this.cssClass = acssClass;
    this._ready = true;
  }


  #adaptPointsByType(
    afirst: A2D.Apg2DPoint,
    asecond: A2D.Apg2DPoint,
    atype: eApgCadLinearDimensionTypes,
  ) {

    // If the segment is diagonal
    if ((afirst.x !== asecond.x) && (afirst.y !== asecond.y)) {
      // Segment diagonal type vertical
      if (atype === eApgCadLinearDimensionTypes.Vertical) {
        afirst.x = asecond.x
      }
      // Segment diagonal type horizontal
      else if (atype === eApgCadLinearDimensionTypes.Horizontal) {
        afirst.y = asecond.y //k
      }
    }
  }

  #adaptDisplacementByType(
    afirst: A2D.Apg2DPoint,
    asecond: A2D.Apg2DPoint,
    atype: eApgCadLinearDimensionTypes,
    adisplacement: number
  ) {
    let r = adisplacement;
    // If the segment is diagonal
    if ((afirst.x !== asecond.x) && (afirst.y !== asecond.y)) {
      // Segment diagonal type vertical
      if (atype === eApgCadLinearDimensionTypes.Vertical) {
        if (afirst.x < asecond.x && asecond.y > afirst.y) {
          r *= -1;
        }
        if (afirst.x > asecond.x && asecond.y < afirst.y) {
          r *= -1;
        }
      }
      // Segment diagonal type horizontal
      else if (atype === eApgCadLinearDimensionTypes.Horizontal) {
        if (afirst.y > asecond.y && asecond.x > afirst.x) {
          r *= -1;
        }
        if (afirst.y < asecond.y && asecond.x < afirst.x) {
          r *= -1;
        }
      }
    }
    return r;
  }



  /** Builds a Cad Linear Dimension with the ladders*/
  build(
    atype: eApgCadLinearDimensionTypes,
    a1stPoint: A2D.Apg2DPoint,
    a2ndPoint: A2D.Apg2DPoint,
    adisplacement: number,
    atextBef = '',
    atextAft = ''
  ) {
    const r = this._cad.svg.group()
    const EPSILON = 0.00001;

    // step 1) Preliminary checks
    // ------------------------------------------------------------------------------

    // Copy the points
    const p1 = A2D.Apg2DPoint.Clone(a1stPoint);
    const p2 = A2D.Apg2DPoint.Clone(a2ndPoint);

    // If the two points are coincident  or almost coincident retruns
    if ((Math.abs(p1.y - p2.y) < EPSILON) && (Math.abs(p1.x - p2.x) < EPSILON)) {
      this._messages.push('The two points are coincident');
      return r;
    }

    // Vertical dimensions cannot be horizontal
    if (p1.x === p2.x && atype === eApgCadLinearDimensionTypes.Horizontal) {
      this._messages.push('Changed the dimension type from horizontal to vertical');
      atype = eApgCadLinearDimensionTypes.Vertical;
    }

    // Horizontal dimensions cannot be vertical
    if (p1.y === p2.y && atype === eApgCadLinearDimensionTypes.Vertical) {
      this._messages.push('Changed the dimension type from vertical to horizontal');
      atype = eApgCadLinearDimensionTypes.Horizontal;
    }

    // The aligned dimensions must be forced to become vertical or horizontal if necessary
    if (atype === eApgCadLinearDimensionTypes.Aligned) {
      if (p1.x === p2.x) {
        this._messages.push('Changed the dimension type from aligned to vertical');
        atype = eApgCadLinearDimensionTypes.Vertical;
      }
      if (p1.y === p2.y) {
        this._messages.push('Changed the dimension type from aligned to horizontal');
        atype = eApgCadLinearDimensionTypes.Horizontal;
      }
    }

    // step 2: Prepare the starting and ending points
    // Eg. this is necessary if the segment is diagonal but we need an horizontal or vertical dimension
    // --------------------------------------------------------------------------------------------

    // Copy the original points into the Intial Ladder Points.
    const ladderStart1 = A2D.Apg2DPoint.Clone(p1);
    const ladderStart2 = A2D.Apg2DPoint.Clone(p2);

    adisplacement = this.#adaptDisplacementByType(p1, p2, atype, adisplacement);
    this.#adaptPointsByType(p1, p2, atype)

    //  step 3) : perform calculations
    // --------------------------------------------------------------------------------------------

    const pointsLine = new A2D.Apg2DLine(p1, p2);

    const arrow1Pos = pointsLine.offsetPoint(p1, adisplacement);
    const arrow2Pos = pointsLine.offsetPoint(p2, adisplacement);

    let dimLine = new A2D.Apg2DLine(arrow1Pos, arrow2Pos);
    if (dimLine.angle > 90 && dimLine.angle <= 270) {
      arrow1Pos.swapWith(arrow2Pos);
      ladderStart1.swapWith(ladderStart2);
      dimLine = new A2D.Apg2DLine(arrow1Pos, arrow2Pos);
    }

    const textBasePoint = arrow1Pos.halfwayFrom(arrow2Pos);

    const textOrientation = ApgCadSvgUtils.GetTextOrientation(dimLine.angle);
    const arrowOrientation = dimLine.angle % 360;

    const textLineSpacing = this.textStyle.size * ((this.textStyle.leading || 1.1) - 1);

    const textPoint = dimLine.offsetPoint(textBasePoint, textLineSpacing);


    let debugText = '';
    if (ApgCadSvgUtils.DEBUG_MODE) {

      const t1stP = ApgCadSvgUtils.GetPointAsString('1stP', a1stPoint)
      const t2ndP = ApgCadSvgUtils.GetPointAsString('2ndP', a2ndPoint)
      const tP1 = ApgCadSvgUtils.GetPointAsString('P1', p1)
      const tP2 = ApgCadSvgUtils.GetPointAsString('P2', p2)
      const taP1 = ApgCadSvgUtils.GetPointAsString('ap1', arrow1Pos)
      const taP2 = ApgCadSvgUtils.GetPointAsString('ap2', arrow2Pos)
      const ttbp = ApgCadSvgUtils.GetPointAsString('tbp', textBasePoint)
      const ttp = ApgCadSvgUtils.GetPointAsString('tp', textPoint)
      debugText += '\n'
        + 't: ' + atype + '\n'
        + `${t1stP} - ${t2ndP}\n`
        + `${tP1} - ${tP2}\n`
        + `${taP1} - ${taP2}\n`
        + `${ttbp} - ${ttp}\n`
        + 'ts: ' + textLineSpacing.toFixed(0) + '\n'
        + 'o: ' + dimLine.angle.toFixed(2) + '°\n'
        + 'll: ' + adisplacement.toFixed(0);
    }

    const dimension =
      (atextBef !== '' ? atextBef + ' ' : '')
      + dimLine.length.toFixed(2)
      + (atextAft !== '' ? ' ' + atextAft : '')

    // step 4: draw the svg
    // ---------------------------------------------------------------------------------

    // Start to create the svg element
    this.#draw(
      r,
      arrow1Pos, arrow2Pos, arrowOrientation,
      textPoint, dimension, textOrientation,
      ladderStart1, ladderStart2
    );

    // Draw debug elements
    if (ApgCadSvgUtils.DEBUG_MODE) {
      this.#drawDebug(a1stPoint, a2ndPoint, p1, p2, textPoint, debugText, textOrientation);
    }
    return r;


  }


  #draw(

    ar: Svg.ApgSvgNode,
    arrow1Pos: A2D.Apg2DPoint,
    arrow2Pos: A2D.Apg2DPoint,
    arrowOrientation: number,
    textPoint: A2D.Apg2DPoint,
    dimension: string,
    textOrientation: number,
    ladderStart1: A2D.Apg2DPoint,
    ladderStart2: A2D.Apg2DPoint
  ) {

    // If specified adds the CSS class
    if (this.cssClass !== '') {
      ar.class(this.cssClass);
    }

    // Draw the main line
    this._cad.svg
      .line(arrow1Pos.x, arrow1Pos.y, arrow2Pos.x, arrow2Pos.y)
      .childOf(ar);

    // Draw the arrow symbols
    const arrowBlock = this._cad.svg
      .getFromDef(this.arrowStyle);

    if (arrowBlock) {
      this._cad.svg
        .use(this.arrowStyle, arrow1Pos.x, arrow1Pos.y)
        .rotate(arrowOrientation, arrow1Pos.x, arrow1Pos.y)
        .childOf(ar);

      this._cad.svg
        .use(this.arrowStyle, arrow2Pos.x, arrow2Pos.y)
        .rotate(arrowOrientation+180, arrow2Pos.x, arrow2Pos.y)
        .childOf(ar);
    }

    // Draw the text
    const _textDef = this._cad.svg
      .text(textPoint.x, textPoint.y, dimension, this.textStyle.leading || 1.2)
      .rotate(textOrientation)
      .stroke("none", 0)
      .childOf(ar);

    // Draw the ladders
    this._cad.svg
      .line(ladderStart1.x, ladderStart1.y, arrow1Pos.x, arrow1Pos.y)
      .childOf(ar);

    this._cad.svg
      .line(ladderStart2.x, ladderStart2.y, arrow2Pos.x, arrow2Pos.y)
      .childOf(ar);
    return ar;
  }

  #drawDebug(
    afstp: A2D.Apg2DPoint,
    asndp: A2D.Apg2DPoint,
    ap1: A2D.Apg2DPoint,
    ap2: A2D.Apg2DPoint,
    atextPoint: A2D.Apg2DPoint,
    adebugText: string,
    atextOrientation: number
  ) {
    const currLayer = this._cad.currentLayer;
    const currGroup = this._cad.currentGroup;

    this._cad.setCurrentLayer(eApgCadDftLayers.DEBUG);
    const leyerDef = this._cad.layerDefs.get(eApgCadDftLayers.DEBUG);

    const DOT_SIZE = 10;
    const pf = this._cad.getPrimitiveFactory(eApgCadPrimitiveFactoryTypes.BASIC_SHAPES) as ApgCadSvgBasicShapesFactory;

    // First and last point
    pf
      .buildDot(afstp, DOT_SIZE)
      .childOf(this._cad.currentLayer);

    pf
      .buildDot(asndp, DOT_SIZE)
      .childOf(this._cad.currentLayer);

    // Text origin
    pf
      .buildDot(atextPoint, DOT_SIZE)
      .childOf(this._cad.currentLayer);

    // Line between original points
    pf
      .buildLine(afstp, asndp)
      .childOf(this._cad.currentLayer);

    // Line between dimension points
    pf
      .buildLine(ap1, ap2)
      .childOf(this._cad.currentLayer);

    const textStyle = leyerDef!.textStyle;
    const textLineHeight = (textStyle.size * (textStyle.leading || 1.1));

    // Draw the debug info
    const _debugText = this._cad.svg
      .text(atextPoint.x, atextPoint.y, adebugText, textLineHeight)
      .rotate(atextOrientation)//, textPosition.x, textPosition.y)
      .textStyle(textStyle)
      .childOf(this._cad.currentLayer);

    this._cad.currentGroup = currGroup;
    this._cad.currentLayer = currLayer;
  }
}
