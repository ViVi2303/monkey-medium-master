import React, { Suspense } from "react";
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import PostRemoved from "./modules/post/PostRemoved";
import StaffManage from "./modules/user/StaffManage";
import PostDetailAdminPage from "./pages/PostDetailAdminPage";
import MeNotificationPage from "./pages/MeNotificationPage";
import AllNotification from "./modules/notification/AllNotification";
import MeBlocked from "./pages/MeBlocked";
import VerifyProfilePage from "./pages/VerifyProfilePage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SendEmailForgotPasswordPage from "./pages/SendEmailForgotPasswordPage";
import VerifySetupPasswordPage from "./pages/VerifySetupPasswordPagePage";
import ContextWrap from "./contexts/ContextWrap";
import StaffReportTable from "./modules/user/StaffReportTable";
import MeSettingPage from "./pages/MeSettingPage";
import Account from "./modules/setting/Account";
const AuthenticationPage = React.lazy(() =>
  import("./pages/AuthenticationPage")
);
const StaffPickPage = React.lazy(() => import("./pages/StaffPickPage"));
const MeMuted = React.lazy(() => import("./pages/MeMuted"));
const PostResolved = React.lazy(() => import("./modules/post/PostResolved"));
const PostReportManage = React.lazy(() =>
  import("./modules/post/PostReportAManage")
);
const MeLayout = React.lazy(() => import("./layout/MeLayout"));
const MeStoryPage = React.lazy(() => import("./pages/MeStoryPage"));
const MeLibraryPage = React.lazy(() => import("./pages/MeLibraryPage"));
const MyDraft = React.lazy(() => import("./modules/story/MyDraft"));
const ReadingHistory = React.lazy(() =>
  import("./modules/library/ReadingHistory")
);
const SignUpPage = React.lazy(() => import("./pages/SignUpPage"));
const ProfileFollowing = React.lazy(() =>
  import("./modules/profile/ProfileFollowing")
);
const ProfileFollower = React.lazy(() =>
  import("./modules/profile/ProfileFollower")
);
const ProfileHome = React.lazy(() => import("./modules/profile/ProfileHome"));
const ProfileReadingList = React.lazy(() =>
  import("./modules/profile/ProfileReadingList")
);
const UserReportsResolved = React.lazy(() =>
  import("./modules/user/UserReportsResolved")
);
const UserReportManage = React.lazy(() =>
  import("./modules/user/UserReportManage")
);
const MeFollowingPage = React.lazy(() => import("./pages/MeFollowingPage"));
const MeSuggestionPage = React.lazy(() => import("./pages/MeSuggestionPage"));
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const SearchStoriesPage = React.lazy(() => import("./pages/SearchStoriesPage"));
const SearchTopicsPage = React.lazy(() => import("./pages/SearchTopicsPage"));
const SearchUsersPage = React.lazy(() => import("./pages/SearchUsersPage"));
const EditBlogPage = React.lazy(() => import("./pages/EditBlogPage"));
const MePage = React.lazy(() => import("./pages/MePage"));
const FollowingPage = React.lazy(() => import("./pages/FollowingPage"));
const HomeMain = React.lazy(() => import("./modules/home/HomeMain"));
const TopicPage = React.lazy(() => import("./pages/TopicPage"));
const TopicUpdate = React.lazy(() => import("./modules/topic/TopicUpdate"));
const TopicAddNew = React.lazy(() => import("./modules/topic/TopicAddNew"));
const PostDetailPage = React.lazy(() => import("./pages/PostDetailPage"));
const UserManage = React.lazy(() => import("./modules/user/UserManage"));
const PostManage = React.lazy(() => import("./modules/post/PostManage"));
const TopicManage = React.lazy(() => import("./modules/topic/TopicManage"));
const WritePage = React.lazy(() => import("./pages/WritePage"));
const DashboardLayout = React.lazy(() =>
  import("./modules/dashboard/DashboardLayouts")
);
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const Layout = React.lazy(() => import("./layout/Layout"));
const PageNotFound = React.lazy(() => import("./pages/PageNotFound"));
const HomePage = React.lazy(() => import("./pages/HomePage"));
const SignInPage = React.lazy(() => import("./pages/SignInPage"));

function App() {
  return (
    <div id="main">
      <Suspense>
        <Routes>
          <Route
            path="/verify-profile"
            element={<VerifyProfilePage></VerifyProfilePage>}
          ></Route>
          <Route
            path="/verify-email"
            element={<VerifyEmailPage></VerifyEmailPage>}
          ></Route>
          <Route
            path="/verify-setup-password"
            element={<VerifySetupPasswordPage></VerifySetupPasswordPage>}
          ></Route>
          <Route
            path="/verify-forgot-password"
            element={<ForgotPasswordPage></ForgotPasswordPage>}
          ></Route>
          <Route element={<AuthenticationPage></AuthenticationPage>}>
            <Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>
            <Route path="/sign-up" element={<SignUpPage></SignUpPage>}></Route>
            <Route
              path="/send-email-password"
              element={
                <SendEmailForgotPasswordPage></SendEmailForgotPasswordPage>
              }
            ></Route>
          </Route>
          <Route element={<ContextWrap></ContextWrap>}>
            <Route element={<Layout></Layout>}>
              <Route element={<HomePage></HomePage>}>
                <Route path="/" element={<HomeMain></HomeMain>}></Route>
                <Route
                  path="/following"
                  element={<FollowingPage></FollowingPage>}
                ></Route>
              </Route>
              <Route element={<MePage></MePage>}>
                <Route
                  path="/me/following"
                  element={<MeFollowingPage></MeFollowingPage>}
                ></Route>
                <Route path="/me/muted" element={<MeMuted></MeMuted>}></Route>
                <Route path="/me/blocked" element={<MeBlocked />}></Route>
                <Route
                  path="/me/suggestions"
                  element={<MeSuggestionPage></MeSuggestionPage>}
                ></Route>
              </Route>
              <Route element={<MeLayout />}>
                <Route element={<MeStoryPage />}>
                  <Route
                    path="/me/stories/drafts"
                    element={<MyDraft></MyDraft>}
                  />
                </Route>
                <Route element={<MeLibraryPage />}>
                  <Route
                    path="/me/library/reading-history"
                    element={<ReadingHistory />}
                  />
                </Route>
                <Route element={<MeNotificationPage />}>
                  <Route
                    path="/me/notifications"
                    element={<AllNotification />}
                  />
                </Route>
                <Route element={<MeSettingPage />}>
                  <Route path="/me/settings" element={<Account />} />
                </Route>
              </Route>
              <Route
                path="/blog/:slug"
                element={<PostDetailPage></PostDetailPage>}
              ></Route>
              <Route
                path="/blog-detail/:id"
                element={<PostDetailAdminPage></PostDetailAdminPage>}
              ></Route>
              <Route
                path="/topic/:slug"
                element={<TopicPage></TopicPage>}
              ></Route>
              <Route element={<ProfilePage></ProfilePage>}>
                <Route path="/profile/:username" element={<ProfileHome />} />
                <Route
                  path="/profile/follower/:username"
                  element={<ProfileFollower />}
                />
                <Route
                  path="/profile/staff-pick/:username"
                  element={<StaffPickPage />}
                />
                <Route
                  path="/profile/following/:username"
                  element={<ProfileFollowing />}
                />
                <Route
                  path="/profile/reading-list/:username"
                  element={<ProfileReadingList></ProfileReadingList>}
                />
              </Route>

              <Route element={<SearchPage></SearchPage>}>
                <Route
                  path="/search"
                  element={<SearchStoriesPage></SearchStoriesPage>}
                ></Route>
                <Route
                  path="/search/topics"
                  element={<SearchTopicsPage></SearchTopicsPage>}
                ></Route>
                <Route
                  path="/search/people"
                  element={<SearchUsersPage></SearchUsersPage>}
                ></Route>
              </Route>
            </Route>
            <Route element={<DashboardLayout></DashboardLayout>}>
              <Route
                path="/dashboard"
                element={<DashboardPage></DashboardPage>}
              ></Route>
              <Route
                path="/manage/topic"
                element={<TopicManage></TopicManage>}
              ></Route>

              <Route
                path="/manage/add-topic"
                element={<TopicAddNew></TopicAddNew>}
              ></Route>
              <Route
                path="/manage/update-topic"
                element={<TopicUpdate></TopicUpdate>}
              ></Route>
              <Route
                path="/manage/posts"
                element={<PostManage></PostManage>}
              ></Route>
              <Route
                path="/manage/removed-article"
                element={<PostRemoved></PostRemoved>}
              ></Route>
              <Route
                path="/manage/report-article"
                element={<PostReportManage></PostReportManage>}
              ></Route>

              <Route
                path="/manage/report-article-resolved"
                element={<PostResolved></PostResolved>}
              ></Route>
              <Route
                path="/manage/staff"
                element={<StaffManage></StaffManage>}
              ></Route>
              <Route
                path="/manage/user"
                element={<UserManage></UserManage>}
              ></Route>
              <Route
                path="/manage/report-user"
                element={<UserReportManage></UserReportManage>}
              ></Route>
              <Route
                path="/manage/report-staff"
                element={<StaffReportTable></StaffReportTable>}
              ></Route>
              <Route
                path="/manage/report-user-resolved"
                element={<UserReportsResolved></UserReportsResolved>}
              ></Route>
            </Route>

            <Route path="/write" element={<WritePage></WritePage>}></Route>
            <Route
              path="/edit-blog/:slug"
              element={<EditBlogPage></EditBlogPage>}
            ></Route>
            <Route path="*" element={<PageNotFound></PageNotFound>}></Route>
          </Route>
        </Routes>
      </Suspense>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default App;
