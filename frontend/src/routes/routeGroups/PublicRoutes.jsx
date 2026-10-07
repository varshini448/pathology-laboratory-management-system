import { Route } from "react-router-dom";

import Home from "../../pages/home/Home";
import PendingApproval from "../../pages/auth/PendingApproval";
import Unauthorized from "../../pages/auth/Unauthorized";

const PublicRoutes = (
    <>
        <Route path="/" element={<Home />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
    </>
);

export default PublicRoutes;
