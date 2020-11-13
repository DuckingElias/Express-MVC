import Controller from "./Controller.mjs";
import Article from "../Model/ArticleModel.mjs";

export default class IndexController extends Controller {

    getLatestArticles = async () => {
        let articles = await Article.findAll({
            limit: 3,
            order: [
                ["id", "DESC"]
            ]
        });
        this.res.render("index", {
            articles: articles
        });
    }

    postNewArticle = async() => {
        logger.debug(this.req.body)
        let article = await Article.create({
            title:  this.req.body.title,
            content: this.req.body.content
        });
        this.res.redirect("/");
    }

}