/** -----------------------------------------------------------------------
 * @module [CAD/Resources]
 * @author [APG] ANGELI Paolo Giusto
 * @version 0.9.2 [APG 2022/12/04] Deno Deploy Beta
 * -----------------------------------------------------------------------
 */
import { Drash, Tng, Uts } from "../../deps.ts";

import { eApgCadTestDefaults } from "../../test/src/enums/eApgCadTestDefaults.ts";
import { eApgCadTestInsSets } from "../../test/src/enums/eApgCadTestInsSets.ts";
import { eApgCadTestFactories } from "../../test/src/enums/eApgCadTestFactories.ts";
import { eApgCadTestFeatures } from "../../test/src/enums/eApgCadTestFeatures.ts";
import { eApgCadTestSvg } from "../../test/src/enums/eApgCadTestSvg.ts";
import { eApgCadTestTypes } from "../../test/src/enums/eApgCadTestTypes.ts";

type Enum = { [key: number | string]: string | number };

export class ApgCadHomeResource extends Drash.Resource {

    public override paths = ["/"];

    public async GET(_request: Drash.Request, response: Drash.Response) {


        const menu: any[] = [];
        const svgMenu = this.getMenuFromEnum(eApgCadTestSvg, eApgCadTestTypes.DIRECT_SVG);
        menu.push(svgMenu);
        const featuresMenu = this.getMenuFromEnum(eApgCadTestFeatures, eApgCadTestTypes.FEATURES);
        menu.push(featuresMenu);
        const factoriesMenu = this.getMenuFromEnum(eApgCadTestFactories, eApgCadTestTypes.FACTORIES);
        menu.push(factoriesMenu);
        const defaultsMenu = this.getMenuFromEnum(eApgCadTestDefaults, eApgCadTestTypes.DEFAULTS);
        menu.push(defaultsMenu);
        const insSetGroupsMenu = this.getMenuFromEnum(eApgCadTestInsSets, eApgCadTestTypes.INS_SETS);
        menu.push(insSetGroupsMenu);


        const templateData = {
            site: {
                name: "Apg-Cad",
                title: "Directory of the Apg Cad Tests"
            },
            page: {
                title: "Home",
                toolbar: "",
                released: "2022/12/04"
            },
            menu
        };

        const html = await Tng.ApgTngService.Render("/home.html", templateData) as string;

        response.html(html);

    }



    private getMenuFromEnum(aenum: Enum, atype: eApgCadTestTypes) {
        const svgMenu: { title: string, links: { href: string; caption: string; }[] } =
        {
            title: atype,
            links: []
        }
        const svgTests = Uts.ApgUtsEnum.StringValues(aenum);

        for (const test of svgTests) {
            svgMenu.links.push({
                href: "/test/" + atype + "/" + test,
                caption: test
            });
        }
        return svgMenu;
    }
}
