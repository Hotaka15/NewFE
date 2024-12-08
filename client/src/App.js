import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import {
  Home,
  Login,
  Profile,
  Register,
  ResetPassword,
  Chat,
  ErrorPage,
  ChangePassword,
  Admin,
  ProfileFix,
  PostPage,
  Friend,
  ProfileDetail,
  Search,
  Save,
  Demo,
  NewFeed,
  Check,
  SearchUser,
  SearchUserN,
} from "./pages";
import { useSelector } from "react-redux";
import PrivateRoute from "./until/privateroute";
import { FriendCardRequest } from "./components";
import FriendDetailRequest from "./pages/FriendDetailRequest";
import FriendDetailSuggest from "./pages/FriendDetailSuggest";
import { SocketProvider } from "./context/SocketContext";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  // console.log(location);
  // console.log(user);

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ form: location }} replace />
  );
}
function App() {
  const theme = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  //console.log(user);
  //console.log(user?.role);
  return (
    <div className="w-full min-h-[100vh]" data-theme={theme.theme}>
      <SocketProvider>
        <Routes>
          {user?.role === "Admin" ? (
            <Route element={<Layout />}>
              <Route path="/admin" element={<Admin />} />

              {/* <Route path="/" element={<Home />} />
            <Route path="/profile/:id?" element={<Profile />} />
            <Route path="/chat/:id?" element={<Chat />} /> */}

              <Route path="/" element={<Home />} />
              <Route path="/friend" element={<Friend />} />
              <Route path="/frienddetails" element={<ProfileDetail />} />
              <Route path="/friendsuggest" element={<FriendDetailSuggest />} />
              <Route path="/friendrequest" element={<FriendDetailRequest />} />
              <Route path="/profile/:id?" element={<ProfileFix />} />
              <Route path="/chat/:id?" element={<Chat />} />
              <Route path="/post/:id?" element={<PostPage />} />
              <Route path="/search/:keyword?" element={<Search />} />
              <Route path="/searchuser/:keyword?" element={<SearchUser />} />
              <Route path="/user/:keyword?" element={<SearchUserN />} />
              <Route path="/save" element={<Save />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/newfeed" element={<NewFeed />} />
            </Route>
          ) : (
            <Route element={<Layout />}>
              {/* <Route path="/admin" element={<Admin />} /> */}
              <Route path="/" element={<Home />} />
              <Route path="/friend" element={<Friend />} />
              <Route path="/frienddetails" element={<ProfileDetail />} />

              <Route path="/friendsuggest" element={<FriendDetailSuggest />} />
              <Route path="/friendrequest" element={<FriendDetailRequest />} />
              <Route path="/profile/:id?" element={<ProfileFix />} />
              <Route path="/chat/:id?" element={<Chat />} />
              <Route path="/post/:id?" element={<PostPage />} />
              <Route path="/search/:keyword?" element={<Search />} />
              <Route path="/user/:keyword?" element={<SearchUserN />} />
              <Route path="/searchuser/:keyword?" element={<SearchUser />} />
              <Route path="/save" element={<Save />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/newfeed" element={<NewFeed />} />
            </Route>
          )}
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/reset-password/:id/:token"
            element={<ChangePassword />}
          />

          <Route path="/check" element={<Check />} />
        </Routes>
      </SocketProvider>
    </div>
  );
}

export default App;
