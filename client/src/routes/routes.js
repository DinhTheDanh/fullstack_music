import config from '~/config/config';
// pages
import Home from '~/pages/Home';
import Profile from '~/pages/Profile';
import ProfileArtist from '~/pages/ProfileArtist';
import ResetPassword from '~/pages/ResetPassword';
import SearchPage from '~/pages/SearchPage';
import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/Signup/Signup';
import UpdateArtist from '~/pages/UpdateArtist';
import AdminShowArtist from '~/pages/AdminShowArtist';
import CollectionTrack from '~/pages/CollectionTrack';
import CreateArtist from '~/pages/CreateArtist';
import CreateSong from '~/pages/CreateSong';
import ForgotPassword from '~/pages/ForgotPassword';

// layouts
import NoHeaderAndSidebar from '~/layouts/NoHeaderAndSidebar';

//Public routes
const publicRoutes = [
    {
        path: config.routes.home,
        component: Home,
    },
    {
        path: config.routes.signup,
        component: SignUp,
        layout: NoHeaderAndSidebar,
    },
    {
        path: config.routes.login,
        component: SignIn,
        layout: NoHeaderAndSidebar,
    },
    {
        path: config.routes.forgotPassword,
        component: ForgotPassword,
        layout: NoHeaderAndSidebar,
    },
    {
        path: config.routes.resetPassword,
        component: ResetPassword,
        layout: NoHeaderAndSidebar,
    },
];
//Public routes
const privateRoutes = [
    {
        path: config.routes.collectionTrack,
        component: CollectionTrack,
        role: 'user',
    },
    {
        path: config.routes.profile,
        component: Profile,
        role: 'user',
    },

    {
        path: config.routes.search,
        component: SearchPage,
        role: 'user',
    },

    {
        path: config.routes.profileArtist,
        component: ProfileArtist,
        role: 'user',
    },
    {
        path: config.routes.createArtist,
        component: CreateArtist,
        role: 'admin',
    },
    {
        path: config.routes.createSong,
        component: CreateSong,
        role: 'admin',
    },
    {
        path: config.routes.adminShowArtist,
        component: AdminShowArtist,
        role: 'admin',
    },
    {
        path: config.routes.updateArtist,
        component: UpdateArtist,
        role: 'admin',
    },
];

export { publicRoutes, privateRoutes };
