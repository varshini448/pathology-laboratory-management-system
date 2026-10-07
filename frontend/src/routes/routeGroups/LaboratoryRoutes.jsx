import { Route } from "react-router-dom";

import Cases from "../../pages/cases/Cases";
import CaseDetails from "../../pages/cases/CaseDetails";
import AddCase from "../../pages/cases/AddCase";

import Specimens from "../../pages/specimens/Specimens";
import SpecimenDetails from "../../pages/specimens/SpecimenDetails";
import AddSpecimen from "../../pages/specimens/AddSpecimen";

import Blocks from "../../pages/blocks/Blocks";
import BlockDetails from "../../pages/blocks/BlockDetails";
import AddBlock from "../../pages/blocks/AddBlock";

import Slides from "../../pages/slides/Slides";
import SlideDetails from "../../pages/slides/SlideDetails";
import AddSlide from "../../pages/slides/AddSlide";

const LaboratoryRoutes = (
    <>
        {/* Case Management */}
        <Route
            path="/cases"
            element={<Cases />}
        />

        <Route
            path="/cases/add"
            element={<AddCase />}
        />

        <Route
            path="/cases/:id"
            element={<CaseDetails />}
        />

        {/* Specimen Management */}
        <Route
            path="/specimens"
            element={<Specimens />}
        />

        <Route
            path="/specimens/add"
            element={<AddSpecimen />}
        />

        <Route
            path="/specimens/:id"
            element={<SpecimenDetails />}
        />

        {/* Block Management */}
        <Route
            path="/blocks"
            element={<Blocks />}
        />

        <Route
            path="/blocks/add"
            element={<AddBlock />}
        />

        <Route
            path="/blocks/:id"
            element={<BlockDetails />}
        />

        {/* Slide Management */}
        <Route
            path="/slides"
            element={<Slides />}
        />

        <Route
            path="/slides/add"
            element={<AddSlide />}
        />

        <Route
            path="/slides/:id"
            element={<SlideDetails />}
        />
    </>
);

export default LaboratoryRoutes;
