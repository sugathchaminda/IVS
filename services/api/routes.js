import {
    GeneralController,
} from './controllers';

export default app => {
    app.use(new GeneralController().router);
};
