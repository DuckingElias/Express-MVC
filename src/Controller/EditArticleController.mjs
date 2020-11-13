import Controller from "./Controller.mjs";
import Article from "../Model/ArticleModel.mjs";

export default class EditArticleController extends Controller {

    postNewArticle = async() => {
        let editId = this.req.params.id;

        if(editId !== undefined) {
            await Article.update({
                title: this.req.body.title,
                content: this.req.body.content
            }, {
                where: {
                    id: editId
                }
            });
        } else {
            let article = await Article.create({
                title:  this.req.body.title,
                content: this.req.body.content
            });
        }
        this.res.redirect("/");
    }

    getEditArticle = async() => {
        let editId = this.req.params.id;
        let options = {};
        if(editId !== undefined) {
            let article = await Article.findOne({
                where: {
                    id: editId
                }
            });
            options = {
                article: article
            }
        }
        this.res.render("edit", options);
    }

}