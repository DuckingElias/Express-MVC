import Controller from "./Controller.mjs";
import Article from "../Model/ArticleModel.mjs";

export default class IndexController extends Controller {

    getLatestArticles = async () => {
        let articles = await Article.findAll({
            limit: 3
        });
        this.res.render("index", {
            articles: articles
        });
    }

}