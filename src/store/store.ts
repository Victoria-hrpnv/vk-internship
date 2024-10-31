import {makeAutoObservable, runInAction} from "mobx";
import jsonp from 'jsonp'

interface Post {
    id: number,
    text : string
}


class PostsStore {
    posts: Post[] = [];
    isLoading:boolean = false;
    offset:number = 0;
    error :  Error | null= null;

    get http():string {
        return `https://api.vk.com/method/wall.get?owner_id=insidevk&access_token=e30849bee30849bee30849be7de02a5a3dee308e30849be84172a1b414af49b749d1bc5&v=5.199&count=5&offset=${String(this.offset)}`
    }

    constructor() {
        makeAutoObservable(this);
    }

    fetchData():void {
        this.isLoading = true;
        this.error = null;
        jsonp(this.http, {}, (err, data):void => {
                if (err) {
                    this.error = err;
                } else {
                    this.posts = [...this.posts, ...data.response.items];
                    this.offset += 5;
                }
                this.isLoading = false;
        });

    }

    deleteFunction(id : number):void{
        runInAction(():void => {
            this.posts = this.posts.filter((post) => post.id !== id);
        });
    }

}

export default new PostsStore();