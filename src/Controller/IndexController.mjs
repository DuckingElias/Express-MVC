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

    deleteArticle = async() => {
        await Article.destroy({
            where: {
                id: this.req.body.id
            }
        });
        this.res.end("OK");
    }

}