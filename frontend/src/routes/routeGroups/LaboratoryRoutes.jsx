import { Route } from "react-router-dom";
import { lazyRoute } from "../lazyRoute";

const Cases = lazyRoute(() => import("../../pages/cases/Cases"));
const CaseDetails = lazyRoute(() => import("../../pages/cases/CaseDetails"));
const AddCase = lazyRoute(() => import("../../pages/cases/AddCase"));
const Specimens = lazyRoute(() => import("../../pages/specimens/Specimens"));
const SpecimenDetails = lazyRoute(() => import("../../pages/specimens/SpecimenDetails"));
const AddSpecimen = lazyRoute(() => import("../../pages/specimens/AddSpecimen"));
const Blocks = lazyRoute(() => import("../../pages/blocks/Blocks"));
const BlockDetails = lazyRoute(() => import("../../pages/blocks/BlockDetails"));
const AddBlock = lazyRoute(() => import("../../pages/blocks/AddBlock"));
const Slides = lazyRoute(() => import("../../pages/slides/Slides"));
const SlideDetails = lazyRoute(() => import("../../pages/slides/SlideDetails"));
const AddSlide = lazyRoute(() => import("../../pages/slides/AddSlide"));
import RoleRoute from "../RoleRoute";

const LaboratoryRoutes = (
    <>
        {/* Case Management */}
        <Route
            path="/cases"
            element={<Cases />}
        />

        <Route element={<RoleRoute allowedRoles={["ADMIN", "TECHNICIAN"]} />}>
            <Route path="/cases/add" element={<AddCase />} />
        </Route>

        <Route
            path="/cases/:id"
            element={<CaseDetails />}
        />

        {/* Specimen Management */}
        <Route
            path="/specimens"
            element={<Specimens />}
        />

        <Route element={<RoleRoute allowedRoles={["ADMIN", "TECHNICIAN"]} />}>
            <Route path="/specimens/add" element={<AddSpecimen />} />
        </Route>

        <Route
            path="/specimens/:id"
            element={<SpecimenDetails />}
        />

        {/* Block Management */}
        <Route
            path="/blocks"
            element={<Blocks />}
        />

        <Route element={<RoleRoute allowedRoles={["ADMIN", "TECHNICIAN"]} />}>
            <Route path="/blocks/add" element={<AddBlock />} />
        </Route>

        <Route
            path="/blocks/:id"
            element={<BlockDetails />}
        />

        {/* Slide Management */}
        <Route
            path="/slides"
            element={<Slides />}
        />

        <Route element={<RoleRoute allowedRoles={["ADMIN", "TECHNICIAN"]} />}>
            <Route path="/slides/add" element={<AddSlide />} />
        </Route>

        <Route
            path="/slides/:id"
            element={<SlideDetails />}
        />
    </>
);

export default LaboratoryRoutes;
