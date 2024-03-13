import { useContext, useEffect } from "react";
import { GlobalContext } from "../../context";
import axios from "axios";
import classes from "./styles.module.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const { blogList, setBlogList, pending, setPending } =
        useContext(GlobalContext);
    const navigate = useNavigate();

    async function fetchListOfBlogs() {
        setPending(true);
        const response = await axios.get("http://localhost:5000/api/blogs");
        const result = await response.data;

        if (result && result.blogList && result.blogList.length) {
            setBlogList(result.blogList);
            setPending(false);
        } else {
            setPending(false);
            setBlogList([]);
        }
    }

    async function handleDeleteBlog(currentId) {
        const response = await axios.delete(
            `http://localhost:5000/api/blogs/delete/${currentId}`
        );
        const result = await response.data;

        if (result?.message) {
            fetchListOfBlogs();
            // navigate(0)
        }
    }

    function handleEdit(currentBlog) {
        console.log(currentBlog);
        navigate("/add-blog", { state: { currentBlog } });
    }

    useEffect(() => {
        fetchListOfBlogs();
    }, []);

    return (
        <div className={classes.wrapper}>
            <h1>Blog List</h1>
            {pending
                ? <h1>Loading Blogs ! Please wait</h1>
                : <div className={classes.blogList}>
                    {blogList && blogList.length
                        ? (blogList.map((blog) => (
                            <div key={blog._id}>
                                <p>{blog.title}</p>
                                <p>{blog.description}</p>
                                <FaEdit onClick={() => handleEdit(blog)} size={30} />
                                <FaTrash
                                    onClick={() => handleDeleteBlog(blog._id)}
                                    size={30}
                                />
                            </div>))
                        )
                        : <h3>No Blogs Added</h3>
                    }
                </div>
            }
        </div>
    );
}