import { Route } from "react-router-dom";

import Users from "../../pages/users/Users";
import AddUser from "../../pages/users/AddUser";
import UserDetails from "../../pages/users/UserDetails";
import AccountOverview from "../../pages/users/AccountOverview";
import AccessControl from "../../pages/users/AccessControl";

import RoleRoute from "../RoleRoute";

const UserRoutes = (
    <>
        <Route
            element={
                <RoleRoute allowedRoles={["ADMIN"]} />
            }
        >
            <Route
                path="/users"
                element={<Users />}
            />

            <Route
                path="/users/add"
                element={<AddUser />}
            />

            <Route
                path="/users/access-control"
                element={<AccessControl />}
            />

            <Route
                path="/users/:id/account"
                element={<AccountOverview />}
            />

            <Route
                path="/users/:id"
                element={<UserDetails />}
            />
        </Route>
    </>
);

export default UserRoutes;