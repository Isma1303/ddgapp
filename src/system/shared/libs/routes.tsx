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
import { Products } from "../../../coffee/components/items/products/Products";
import { ProductCategories } from "../../../coffee/components/items/product_categories/Product_categories";
import { SalesModule } from "../../../coffee/pages/sales/SalesModule";
import { UserCardPage } from "../../../ddg/user-cards/pages/UserCardPage";
import { UserCardScanPage } from "../../../ddg/user-cards/pages/UserCardScanPage";
import { UserCardAttendancePage } from "../../../ddg/user-cards/pages/UserCardAttendancePage";
import { UserCardCreatePage } from "../../../ddg/user-cards/pages/UserCardCreatePage";
import { UserCardsListPage } from "../../../ddg/user-cards/pages/UserCardsListPage";


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
        <Route
          path="/coffee/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/coffee/product-categories"
          element={
            <PrivateRoute>
              <ProductCategories />
            </PrivateRoute>
          }
        />
        <Route
          path="/coffee/sales"
          element={
            <PrivateRoute>
              <SalesModule />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-cards/card"
          element={
            <PrivateRoute>
              <UserCardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-cards/scan"
          element={
            <PrivateRoute>
              <UserCardScanPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-cards/attendance"
          element={
            <PrivateRoute>
              <UserCardAttendancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-cards/create"
          element={
            <PrivateRoute>
              <UserCardCreatePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/user-cards/list"
          element={
            <PrivateRoute>
              <UserCardsListPage />
            </PrivateRoute>
          }
        />
      </RouterRoutes>
    </BrowserRouter>
  );
};
