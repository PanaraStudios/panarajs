import { ContactController } from "./controllers/contactController.js";
import { HomeController } from "./controllers/homeController.js";
import { AboutController } from "./controllers/aboutController.js";

const routes = {
    '/': {
        route: '/',
        template: 'views/home.html',
        controller: HomeController,
    },
    'contact': {
        route: 'contact',
        template: 'views/contact.html',
        controller: ContactController,
    },
    'about': {
        route: 'about',
        template: 'views/about.html',
        controller: AboutController,
    },
}

export {routes};
