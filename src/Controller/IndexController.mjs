import Controller from "./Controller.mjs";

export default class IndexController extends Controller {

    getIndexPage = () => {
        this.res.render("index");
    }

}