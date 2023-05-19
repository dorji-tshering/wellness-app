import { NavigationModel } from '../navigation-model';
import Home from '../../pages/home/home';
import { lazy } from 'react';

const Fitness = lazy(() => import('../../pages/fitness/fitness'));
const Nutrition = lazy(() => import('../../pages/nutrition/nutrition'));
const Wellness = lazy(() => import('../../pages/wellness/wellness'));
const Login = lazy(() => import('../../pages/login/login'));
const NotFound = lazy(() => import('../../pages/not-found/not-found'));

export const ROUTE_CONSTANT: NavigationModel[] = [
    {
        name: '/',
        page: Home,
    },
    {
        name: '/login',
        page: Login,
    },
    {
        name: '/fitness',
        page: Fitness,
    },
    {
        name: '/nutrition',
        page: Nutrition,
    },
    {
        name: '/wellness',
        page: Wellness,
    },
    {
        name: '*',
        page: NotFound
    },
]