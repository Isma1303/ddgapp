import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import { Login } from "../../../admin/pages/Login";
import { PrivateRoute } from "./privateRoute";
import { PublicRoute } from "./publicRoute";
import { Dashboard } from "../../../ddg/pages/dashboard/Dashboard";
import { Events } from "../../../ddg/components/events/Events";
import { Announcements } from "../../../ddg/components/announcements/Announcements";
import { Settings } from "../../../admin/components/profile/Settings";
import { Messages } from "../../../admin/components/profile/Messages";
import { Users } from "../../../admin/components/Users/Users";
import { Roles } from "../../../admin/components/Roles/Roles";
import { Assignaments } from "../../../admin/components/Assignaments/Assignaments";
import { NewEvent } from "../../../ddg/components/events/NewEvent/NewEvent";
import { EventDetail } from "../../../ddg/components/events/EventDetail/EventDetail";

export const Routes = () => {
    return (
        <BrowserRouter>
            <RouterRoutes>
                <Route
                    path="/"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/events"
                    element={
                        <PrivateRoute>
                            <Events />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/announcements"
                    element={
                        <PrivateRoute>
                            <Announcements />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/profile/settings"
                    element={
                        <PrivateRoute>
                            <Settings />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/profile/messages"
                    element={
                        <PrivateRoute>
                            <Messages />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <PrivateRoute>
                            <Users />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/roles"
                    element={
                        <PrivateRoute>
                            <Roles />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/assignaments"
                    element={
                        <PrivateRoute>
                            <Assignaments />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/events/new"
                    element={
                        <PrivateRoute>
                            <NewEvent />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/events/detail/:event_id"
                    element={
                        <PrivateRoute>
                            <EventDetail />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/events/:event_id"
                    element={
                        <PrivateRoute>
                            <EventDetail />
                        </PrivateRoute>
                    }
                />
            </RouterRoutes>
        </BrowserRouter>
    )
}